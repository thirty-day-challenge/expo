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
import { useRouter } from "expo-router";
import SignOutButton from "@/components/SignOutButton";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-expo";
import { Challenge } from "@prisma/client";

type FormData = { actionPlan: string };

export default function Page() {
  const { top } = useSafeAreaInsets();
  const { userId } = useAuth();
  const router = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>();

  const handleCreatePlan = async (data: FormData) => {
    const { actionPlan } = data;

    const challengeInput = {
      title: actionPlan,
      description: null,
      clerkId: userId,
    };

    const {
      message,
      data: challengeData,
    }: { message: String; data: Challenge } = await fetch(
      "http://192.168.68.74:3000/api/create-new-challenge",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challengeInput),
      }
    )
      .then((response) => response.json())
      .then((data) => data)
      .catch((e) => console.error(`Challenge failed to be created: ${e}`));

    console.log(message, challengeData);
  };

  return (
    <View
      style={{ paddingTop: top }}
      className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto"
    >
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
        onPress={handleSubmit(handleCreatePlan)}
      >
        <Text className="text-white">Submit</Text>
      </Pressable>
    </View>
  );
}

// <View className="w-5/6 mx-auto">
//   <Calendar />
// </View>;

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
