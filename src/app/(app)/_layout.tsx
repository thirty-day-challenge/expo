import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import "@/global.css";
import { Redirect, Slot } from "expo-router";
import { Text, View } from "react-native";
import { useEffect } from "react";
import SafeView from "@/components/SafeView";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded)
    return (
      <SafeView top>
        <Text>Loading...</Text>
      </SafeView>
    );

  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return (
    <SafeView top bottom>
      <Slot />
    </SafeView>
  );
}
