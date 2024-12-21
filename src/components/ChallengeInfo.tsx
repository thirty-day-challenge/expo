import { gridData } from "@/lib/util/dates";
import { Challenge } from "@prisma/client";
import { Link, router } from "expo-router";
import { Notebook, Pencil } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function ChallengeInfo({
  challenge,
  gridData,
}: {
  challenge: Challenge;
  gridData: gridData;
}) {
  return (
    <View className="gap-5">
      <View className="gap-2">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-xl font-bold tracking-tight">
            {challenge.title}
          </Text>
          <View className="flex gap-2 flex-row-reverse">
            <EditChallengeButton challenge={challenge} />
            <NoteButton challenge={challenge} />
            <CompletionDisplay gridData={gridData} />
          </View>
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

function NoteButton({ challenge }: { challenge: Challenge }) {
  return (
    <Link href={`/challenge-forms/note/?id=${challenge.id}`} asChild>
      <Pressable className="bg-neutral-200 p-1.5 rounded-lg">
        <Notebook size={20} color={"black"} />
      </Pressable>
    </Link>
  );
}

function CompletionDisplay({ gridData }: { gridData: gridData }) {
  let totalCount = 0;
  let completedCount = 0;
  gridData.forEach((item) => {
    if (item.dailyProgress?.completed) completedCount++;
    if (!item.isPadding && new Date() > item.dateValue) totalCount++;
  });

  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <Pressable
      className="bg-neutral-200 p-1.5 rounded-lg"
      onPress={() => router.push("/tabs")}
    >
      {() => {
        if (percentage > 75) {
          return <Text>✅</Text>;
        }
        if (percentage > 25) {
          return <Text>🏃‍♀️</Text>;
        }
        return <Text>😴</Text>;
      }}
    </Pressable>
  );
}
