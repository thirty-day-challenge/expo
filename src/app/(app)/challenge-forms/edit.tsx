import { View, Text } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/util/react-query";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { challenges, useChallenges } from "@/lib/hooks/react-query";
import { ChallengeForm, FormData } from "@/components/ChallengeForm";
import ky from "ky";
import { z } from "zod";
import { ChallengeSchema } from "@30-day-challenge/prisma-zod";

export type EditChallengeSearchParams = {
  id: string;
  title: string;
  wish: string;
  dailyAction: string;
};

export default function EditChallenge() {
  const { userId } = useAuth();

  const searchParams = useLocalSearchParams<EditChallengeSearchParams>();

  const { mutate } = useMutation({
    mutationFn: handleCreatePlan,
    onSuccess: (data) => {
      queryClient.setQueryData(["challenges"], (oldData: challenges) => {
        return oldData.map((challenge) => {
          if (challenge.id === searchParams.id) {
            return data;
          }
          return challenge;
        });
      });
      router.push("/");
    },
  });

  async function handleCreatePlan(data: FormData) {
    const { title, wish, dailyAction } = data;

    const challengeInput = {
      id: searchParams.id,
      title,
      wish,
      dailyAction,
    };

    const response = await ky
      .put(`${process.env.EXPO_PUBLIC_NEXTJS_URL}/api/update-challenge`, {
        json: challengeInput,
      })
      .json()
      .catch((e) => {
        throw new Error(`Challenge failed to be updated: ${e}`);
      });

    const ResponseSchema = z.object({
      message: z.string(),
      data: ChallengeSchema,
    });

    try {
      const { data } = ResponseSchema.parse(response);
      return data;
    } catch (error) {
      throw new Error("Validation failed: " + error);
    }
  }

  return (
    <View className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto">
      <Text className="font-bold text-xl w-full">Edit Your Challenge!</Text>
      <ChallengeForm mutate={mutate} searchParams={searchParams} />
    </View>
  );
}
