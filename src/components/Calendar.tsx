import { DailyProgressInput } from "@/lib/db/dailyProgress";
import { useDailyProgressMutation } from "@/lib/hooks/react-query/mutations";
import { useChallenges } from "@/lib/hooks/react-query/queries";
import { gridData, isDateValid } from "@/lib/util/dates";
import { useAuth } from "@clerk/clerk-expo";
import { getDate } from "date-fns";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Calendar({ gridData }: { gridData: gridData }) {
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
      onPress={() =>
        router.push(
          `/view-day/?date=${item.dateValue}&id=${item.dailyProgress?.id}`
        )
      }
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
