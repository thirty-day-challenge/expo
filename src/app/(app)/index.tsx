import {
  View,
  Text,
  Pressable,
  FlatList,
  ListRenderItemInfo,
  TextInput,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ErrorBoundaryProps, useRouter } from "expo-router";
import SignOutButton from "@/components/SignOutButton";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-expo";
import { Challenge } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useChallenges } from "@/lib/hooks/react-query";
import { queryClient } from "@/lib/util/react-query";
import SafeView from "@/components/SafeView";

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SafeView
      top
      className="flex-1 flex justify-center items-center bg-red-600"
    >
      <Text>{props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </SafeView>
  );
}

export default function Page() {
  const { data: challengesData, error, isLoading } = useChallenges();

  if (error) {
    console.error(error);
    throw new Error("Data fetching error");
  }

  if (isLoading) return <Text>Loading...</Text>;

  if (challengesData.length === 0) return <NewChallengeForm />;

  return <Text>Hi</Text>;
}

// <View className="w-5/6 mx-auto">
//   <Calendar />
// </View>;

function NewChallengeForm() {
  type FormData = { actionPlan: string };
  const { userId } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();

  const mutation = useMutation({
    mutationFn: handleCreatePlan,
  });

  async function handleCreatePlan(data: FormData) {
    const { actionPlan } = data;

    const challengeInput = {
      title: actionPlan,
      wish: "temporary filler wish",
      dailyAction: "temporary filler dailyAction",
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

    queryClient.invalidateQueries({ queryKey: ["challenges"] });
  }

  return (
    <View className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto">
      <Text className="font-bold text-lg">
        What is your daily action plan for your 30 day challenge?
      </Text>
      <View className="w-full gap-0.5">
        <Controller
          control={control}
          name="actionPlan"
          rules={{
            required: "Please enter an action plan!",
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
        {errors.actionPlan ? (
          <Text className="text-red-500 text-sm">
            {errors.actionPlan.message}
          </Text>
        ) : null}
      </View>
      <Pressable
        className="px-3 py-2 bg-blue-500 mr-auto rounded-lg"
        onPress={handleSubmit((data) => mutation.mutate(data))}
      >
        <Text className="text-white">Submit</Text>
      </Pressable>
    </View>
  );
}

function Calendar() {
  const data = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
  ];

  return (
    <View className="">
      <Grid data={data} Item={Item} />
    </View>
  );
}

function Item(item: ListRenderItemInfo<number>) {
  return (
    <View className="bg-white m-[1px] flex-1 aspect-square">
      <Text>{item.item}</Text>
    </View>
  );
}

function Grid({ data, Item }) {
  return (
    <FlatList
      data={data}
      renderItem={Item}
      keyExtractor={(item) => item.toString()}
      numColumns={7}
      className="bg-slate-400 p-[1px]"
    />
  );
}
