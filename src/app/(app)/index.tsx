import {
  View,
  Text,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import React from "react";
import { ErrorBoundaryProps, Link, Redirect, router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Challenge } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import {
  daily_progress,
  useChallenges,
  useDailyProgress,
} from "@/lib/hooks/react-query/queries";
import { queryClient } from "@/lib/util/react-query";
import SafeView from "@/components/SafeView";
import { getDate } from "date-fns";
import { createCalendarDates, gridData, isDateValid } from "@/lib/util/dates";
import {
  DailyProgressOptionalDefaults,
  DailyProgressSchema,
} from "@30-day-challenge/prisma-zod";
import { z } from "zod";
import ky from "ky";
import { Pencil } from "lucide-react-native";
import {
  DailyProgressInput,
  upsertDailyProgress,
} from "@/lib/db/dailyProgress";
import { useDailyProgressMutation } from "@/lib/hooks/react-query/mutations";

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
  const {
    data: challengesData,
    error,
    isLoading: isChallengesLoading,
  } = useChallenges();
  const { isLoading: isDailyProgressDataLoading } = useDailyProgress();

  if (isChallengesLoading || isDailyProgressDataLoading)
    return <Text>Challenges data is loading...</Text>;

  if (!challengesData || challengesData.length === 0)
    return <Redirect href={"/challenge-forms/create"} />;

  return (
    <View className="w-5/6 mx-auto gap-5">
      <ChallengeInfo challenge={challengesData[0]} />
      <Calendar />
    </View>
  );
}

function EditChallengeButton({ challenge }: { challenge: Challenge }) {
  return (
    <Link
      href={`/challenge-forms/edit/?title=${challenge.title}&wish=${challenge.wish}&dailyAction=${challenge.dailyAction}&id=${challenge.id}&icon=${challenge.icon}`}
      asChild
    >
      <Pressable className="bg-black p-1.5 rounded-lg">
        <Pencil size={20} color={"white"} />
      </Pressable>
    </Link>
  );
}

function ChallengeInfo({ challenge }: { challenge: Challenge }) {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-xl font-bold tracking-tight">
            {challenge.title}
          </Text>
          <EditChallengeButton challenge={challenge} />
        </View>
        <View className="gap-2">
          <View className="flex flex-row gap-1">
            <Text className="font-bold">Wish:</Text>
            <Text>{challenge.wish}</Text>
          </View>
          <View className="flex flex-row gap-1">
            <Text className="font-bold">Daily action:</Text>
            <Text>{challenge.dailyAction}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Calendar() {
  const { data: challengesData } = useChallenges();
  const { data: dailyProgressData } = useDailyProgress();

  if (dailyProgressData == undefined) throw new Error();

  const challenge = challengesData![0];
  const gridData = createCalendarDates(challenge, dailyProgressData);

  return (
    <View className="gap-2">
      <WeekDays />
      <FlatList
        data={gridData}
        renderItem={(item) => <Day {...item} />}
        numColumns={7}
        className="p-[1px]"
      />
    </View>
  );
}

function WeekDays() {
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

  return (
    <FlatList
      data={weekDays}
      renderItem={(item) => (
        <View className="flex-1 items-center justify-center">
          <Text className="font-bold text-neutral-500 text-sm">
            {item.item}
          </Text>
        </View>
      )}
      numColumns={7}
      className="p-[1px]"
    />
  );
}

function StridePadding({
  index,
  item,
}: {
  index: number;
  item: gridData[number];
}) {
  const isNotLeftEdge = index % 7 !== 0;
  const isNotRightEdge = index % 7 !== 6;
  const isCompleted = item.dailyProgress?.completed;

  return (
    <>
      {isNotLeftEdge && isCompleted && item.leftCompleted ? (
        <View className={`bg-neutral-200 absolute w-1/2 h-full left-0`}></View>
      ) : null}
      {isNotRightEdge && isCompleted && item.rightCompleted ? (
        <View className={`bg-neutral-200 absolute w-1/2 h-full right-0`}></View>
      ) : null}
    </>
  );
}

function Day({
  index,
  item,
  separators,
}: ListRenderItemInfo<gridData[number]>) {
  const { data: challengesData } = useChallenges();
  const { userId } = useAuth();

  const { mutate } = useDailyProgressMutation();

  function handlePress() {
    const dailyProgressInput: DailyProgressInput = {
      id: item.dailyProgress?.id || undefined,
      clerkId: userId!,
      date: item.dateValue,
      completed: item.dailyProgress?.completed == true ? false : true,
      challengeId: challengesData![0].id,
    };

    mutate(dailyProgressInput);
  }

  return (
    <Pressable
      className={`flex-1 aspect-square flex flex-row`}
      key={index}
      onPress={() => router.push(`/view-day/?date=${item.dateValue}`)}
      onLongPress={handlePress}
      disabled={!isDateValid(item.dateValue, challengesData![0].startDate)}
    >
      <View className={`w-full my-[3px] relative`}>
        <StridePadding index={index} item={item} />
        <View
          className={`flex flex-1 items-center justify-center mx-[3px] ${
            item.dailyProgress?.completed ? "bg-neutral-200 rounded-xl" : null
          }`}
        >
          <Text
            className={
              isDateValid(item.dateValue, challengesData![0].startDate)
                ? "text-black font-bold"
                : "text-gray-400"
            }
          >
            {!item.isPadding ? getDate(item.dateValue) : null}
          </Text>
          <Text>
            {item.dailyProgress?.completed ? challengesData![0].icon : null}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
