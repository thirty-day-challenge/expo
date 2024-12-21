import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { EditChallengeSearchParams } from "@/app/(app)/challenge-forms/edit";
import { useAuth } from "@clerk/clerk-expo";
import { useChallengeMutation } from "@/lib/hooks/react-query/mutations";
import { ChallengeInput } from "@/lib/db/challenge";

export type FormData = {
  title: string;
  wish: string;
  dailyAction: string;
  icon: string;
};
export type ChallengeFormProps = {
  searchParams?: Partial<EditChallengeSearchParams>;
};

export function ChallengeForm({ searchParams }: ChallengeFormProps) {
  const {
    id = undefined,
    title = null,
    wish = null,
    dailyAction = null,
    icon = null,
    note = null,
  } = searchParams || {};

  const { userId } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();

  const { mutate } = useChallengeMutation(id);

  async function handleFormSubmission(data: FormData) {
    const { title, wish, dailyAction, icon } = data;

    const challengeInput: ChallengeInput = {
      title,
      wish,
      dailyAction,
      icon,
      note: note,
      ...(searchParams && searchParams.id
        ? { id: searchParams.id }
        : { clerkId: userId! }),
    };

    return mutate(challengeInput);
  }

  const validateEmoji = (emojiString: string) => {
    const emojiRegex =
      /^(?:\uD83D[\uDC00-\uDFFF]|\uD83C[\uDDE0-\uDDFF]|\uD83E[\uDD00-\uDDFF]|[\u2600-\u26FF\u2700-\u27BF\u2B50-\u2B55\u2E3A\u2E3B\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDFFF])$/;

    return emojiRegex.test(emojiString) ? true : "Please enter a valid emoji!";
  };

  return (
    <>
      <View className="w-full gap-3">
        {/* title */}
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
                    className="ios:py-1"
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
        {/* wish */}
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
                    className="ios:py-1"
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
        {/* daily action */}
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
                    className="ios:py-1"
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
        {/* icon */}
        <View className="w-full flex gap-3">
          <Text className="font-bold text-lg">Icon</Text>
          <View className="w-full gap-0.5">
            <Controller
              control={control}
              name="icon"
              rules={{
                required: "Please enter an emoji!",
                validate: validateEmoji,
              }}
              defaultValue={icon ? icon : "✅"}
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="border border-black rounded-lg px-2 w-full">
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="ios:py-1"
                  />
                </View>
              )}
            />
            {errors.icon ? (
              <Text className="text-red-500 text-sm">
                {errors.icon.message}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <Pressable
        className="px-3 py-2 bg-blue-500 mr-auto rounded-lg"
        onPress={handleSubmit((data) => handleFormSubmission(data))}
      >
        <Text className="text-white">Submit</Text>
      </Pressable>
    </>
  );
}
