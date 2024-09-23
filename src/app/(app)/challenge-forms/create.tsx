import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { useChallenges } from "@/lib/hooks/react-query/queries";
import { ChallengeForm } from "@/components/ChallengeForm";

export default function NewChallengeForm() {
  const { data: challengeData } = useChallenges();

  if (challengeData && challengeData.length >= 1)
    return <Redirect href={"/"} />;

  return (
    <View className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto">
      <View className="w-full">
        <Text className="font-bold text-xl">Create Your Challenge!</Text>
      </View>
      <ChallengeForm />
    </View>
  );
}
