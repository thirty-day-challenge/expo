import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { MutateOptions } from "@tanstack/react-query";
import { format } from "date-fns";
import { EditChallengeSearchParams } from "@/app/(app)/challenge-forms/edit";
import { Challenge } from "@30-day-challenge/prisma-zod";

export type FormData = { title: string; wish: string; dailyAction: string };
export type ChallengeFormProps = {
  mutate: (
    variables: FormData,
    options?: MutateOptions<Challenge, Error, FormData, unknown> | undefined
  ) => void;
  searchParams: Partial<EditChallengeSearchParams>;
};
export function ChallengeForm({
  mutate,
  searchParams: { id, title, wish, dailyAction },
}: ChallengeFormProps) {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();

  return (
    <>
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
              defaultValue={
                title ? title : `${format(new Date(), "LLLL")} Challenge`
              }
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
              defaultValue={wish ? wish : ""}
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
              defaultValue={dailyAction ? dailyAction : ""}
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
    </>
  );
}
