import SafeView from "@/components/SafeView";
import "@/global.css";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import { Text } from "react-native";

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
    <SafeView top>
      <Slot />
    </SafeView>
  );
}
