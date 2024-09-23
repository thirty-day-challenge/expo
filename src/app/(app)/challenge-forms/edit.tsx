import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ChallengeForm } from "@/components/ChallengeForm";
import { ArrowLeftFromLine } from "lucide-react-native";

export type EditChallengeSearchParams = {
  id: string;
  title: string;
  wish: string;
  dailyAction: string;
  icon: string;
  note: string;
};

export default function EditChallenge() {
  const searchParams = useLocalSearchParams<EditChallengeSearchParams>();

  return (
    <KeyboardAvoidingView className="flex-1" behavior="padding" enabled>
      <Pressable
        className="bg-black rounded-md p-2 absolute left-10 z-10"
        onPress={() => router.back()}
      >
        <ArrowLeftFromLine size={20} color="white" />
      </Pressable>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1 flex flex-col items-center gap-5 justify-center w-3/4 mx-auto">
          <View className="w-full">
            <Text className="font-bold text-xl">Edit Your Challenge!</Text>
          </View>
          <ChallengeForm searchParams={searchParams} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
