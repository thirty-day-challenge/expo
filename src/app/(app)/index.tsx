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
import { ErrorBoundaryProps, Redirect, useRouter } from "expo-router";
import SignOutButton from "@/components/SignOutButton";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@clerk/clerk-expo";
import { Challenge } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useChallenges } from "@/lib/hooks/react-query";
import { queryClient } from "@/lib/util/react-query";
import SafeView from "@/components/SafeView";
import { addDays, eachDayOfInterval, getDate, getDay, subDays } from "date-fns";
import { createCalendarDates, gridData } from "@/lib/util/dates";

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

  if (isLoading) return <Text>Challenges data is loading...</Text>;

  if (!challengesData || challengesData.length === 0)
    return <Redirect href={"/new-challenge-form"} />;

  return (
    <View className="w-5/6 mx-auto">
      <Calendar />
    </View>
  );
}

function Calendar() {
  // data has to be fetched and successful for this component to be rendered
  const { data } = useChallenges();

  const challenge = data![0];
  const gridData = createCalendarDates(challenge);

  return (
    <View className="">
      <FlatList
        data={gridData}
        renderItem={Day}
        numColumns={7}
        className="bg-slate-400 p-[1px]"
      />
    </View>
  );
}

function Day({
  index,
  item,
  separators,
}: ListRenderItemInfo<gridData[number]>) {
  const handlePress = async () => {
    console.log(item.dateValue);
  };

  return (
    <Pressable
      className="bg-white m-[1px] flex-1 aspect-square"
      key={index}
      onPress={handlePress}
    >
      <Text
        className={item.isPadding ? "text-neutral-500" : "text-black font-bold"}
      >
        {getDate(item.dateValue)}
      </Text>
    </Pressable>
  );
}
