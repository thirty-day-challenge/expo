import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/util/react-query";
import { Redirect, router } from "expo-router";
import { challenges, useChallenges } from "@/lib/hooks/react-query";
import { format } from "date-fns";
import { ChallengeForm, FormData } from "@/components/ChallengeForm";
import { z } from "zod";
import { ChallengeSchema } from "@30-day-challenge/prisma-zod";

export default function NewChallengeForm() {
  const { userId } = useAuth();

  const { data: challengeData } = useChallenges();
  const { mutate } = useMutation({
    mutationFn: handleCreatePlan,
    onSuccess: async (data) => {
      queryClient.setQueryData(["challenges"], (oldData: challenges) => {
        return [...oldData, data];
      });
      router.push("/");
    },
  });

  async function handleCreatePlan(data: FormData) {
    const { title, wish, dailyAction, icon } = data;

    const challengeInput = {
      title,
      wish,
      dailyAction,
      icon,
      clerkId: userId,
    };

    const ResponseSchema = z.object({
      message: z.string(),
      data: ChallengeSchema,
    });

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_NEXTJS_URL}/api/challenge/create`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challengeInput),
      }
    )
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => {
        console.error(`Challenge failed to be created: ${e}`);
        throw new Error("Something went wrong");
      });

    try {
      const { data } = ResponseSchema.parse(response);
      return data;
    } catch (error) {
      throw new Error("Validation failed: " + error);
    }
  }

  if (challengeData && challengeData.length >= 1)
    return <Redirect href={"/"} />;

  return (
    <View className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto">
      <Text className="font-bold text-xl w-full">Create Your Challenge!</Text>
      <ChallengeForm mutate={mutate} />
    </View>
  );
}
