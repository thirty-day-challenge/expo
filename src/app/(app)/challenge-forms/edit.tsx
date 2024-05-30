import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { ChallengeForm } from "@/components/ChallengeForm";
import { ArrowLeftFromLine } from "lucide-react-native";

export type EditChallengeSearchParams = {
  id: string;
  title: string;
  wish: string;
  dailyAction: string;
  icon: string;
};

export default function EditChallenge() {
  const searchParams = useLocalSearchParams<EditChallengeSearchParams>();

  return (
    <>
      <Link href={"/"} asChild>
        <Pressable className="bg-black rounded-md p-2 absolute top-14 left-10">
          <ArrowLeftFromLine size={20} color="white" />
        </Pressable>
      </Link>
      <View className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto">
        <Text className="font-bold text-xl w-full">Edit Your Challenge!</Text>
        <ChallengeForm searchParams={searchParams} />
      </View>
    </>
  );
}
