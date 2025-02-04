import {
  View,
  Text,
  KeyboardAvoidingView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { Redirect, router } from "expo-router";
import { useChallenges } from "@/lib/hooks/react-query/queries";
import { ChallengeForm } from "@/components/ChallengeForm";
import { ArrowLeftFromLine } from "lucide-react-native";

export default function NewChallengeForm() {
  const { data: challengeData } = useChallenges();

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
            <Text className="font-bold text-xl">Create Your Challenge!</Text>
          </View>
          <ChallengeForm />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
