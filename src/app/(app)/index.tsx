import { View, Text, Pressable } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import SignOutButton from "@/components/SignOutButton";

export default function Page() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={{ paddingTop: top }}
      className="flex-1 flex flex-col items-start"
    >
      <Text>You are signed in</Text>
      <SignOutButton />
    </View>
  );
}
