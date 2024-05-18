import { View, Text, Pressable } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Pressable
      className="bg-red-600 px-5 py-3 rounded-lg"
      onPress={() => signOut()}
    >
      <Text className="text-white">Sign Out</Text>
    </Pressable>
  );
}
