import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/util/react-query";
import { Redirect, router } from "expo-router";
import { useChallenges } from "@/lib/hooks/react-query";
import { format } from "date-fns";

type FormData = { title: string; wish: string; dailyAction: string };

export default function NewChallengeForm() {
  const { userId } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();

  const { data: challengeData } = useChallenges();
  const { mutate } = useMutation({
    mutationFn: handleCreatePlan,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["challenges"] });
      router.push("/");
    },
  });

  async function handleCreatePlan(data: FormData) {
    const { title, wish, dailyAction } = data;

    const challengeInput = {
      title,
      wish,
      dailyAction,
      clerkId: userId,
    };

    await fetch(
      `${process.env.EXPO_PUBLIC_NEXTJS_URL}/api/create-new-challenge`,
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
  }

  if (challengeData && challengeData.length >= 1)
    return <Redirect href={"/"} />;

  return (
    <View className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto">
      <Text className="font-bold text-xl w-full">Create Your Challenge!</Text>
      <View className="w-full gap-3">
        <View className="w-full flex gap-3">
          <Text className="font-bold text-lg">Title</Text>
          <View className="w-full gap-0.5">
            <Controller
              control={control}
              name="title"
              rules={{
                required: "Please enter a title!",
              }}
              defaultValue={`${format(new Date(), "LLLL")} Challenge`}
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="border border-black rounded-lg px-2 w-full">
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.title ? (
              <Text className="text-red-500 text-sm">
                {errors.title.message}
              </Text>
            ) : null}
          </View>
        </View>
        <View className="w-full flex gap-3">
          <Text className="font-bold text-lg">Wish</Text>
          <View className="w-full gap-0.5">
            <Controller
              control={control}
              name="wish"
              rules={{
                required: "Please enter a wish!",
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="border border-black rounded-lg px-2 w-full">
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.wish ? (
              <Text className="text-red-500 text-sm">
                {errors.wish.message}
              </Text>
            ) : null}
          </View>
        </View>
        <View className="w-full flex gap-3">
          <Text className="font-bold text-lg">Daily Action</Text>
          <View className="w-full gap-0.5">
            <Controller
              control={control}
              name="dailyAction"
              rules={{
                required: "Please enter a daily action!",
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="border border-black rounded-lg px-2 w-full">
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.dailyAction ? (
              <Text className="text-red-500 text-sm">
                {errors.dailyAction.message}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <Pressable
        className="px-3 py-2 bg-blue-500 mr-auto rounded-lg"
        onPress={handleSubmit((data) => mutate(data))}
      >
        <Text className="text-white">Submit</Text>
      </Pressable>
    </View>
  );
}
