import SafeView from "@/components/SafeView";
import "@/global.css";
import { useChallenges } from "@/lib/hooks/react-query/queries";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isLoading: isChallengesLoading, error } = useChallenges();

  if (!isLoaded || isChallengesLoading)
    return (
      <SafeView top className="flex items-center justify-center">
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
