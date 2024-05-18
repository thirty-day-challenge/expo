import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import "@/global.css";
import { Redirect, Slot } from "expo-router";
import { Text, View } from "react-native";
import { useEffect } from "react";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  console.log(isSignedIn);

  if (!isLoaded) return <Text>Loading...</Text>;

  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return <Slot />;
}
