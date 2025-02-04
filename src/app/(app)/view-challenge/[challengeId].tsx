import ViewChallenge from "@/components/index/ViewChallenge";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftFromLine } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function ViewChallengeScreen() {
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();

  if (!challengeId) {
    return (
      <View>
        <Text>Error, challenge of id {challengeId} does not exist!</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Pressable
        className="bg-black rounded-md p-2 absolute left-10 z-10"
        onPress={() => router.back()}
      >
        <ArrowLeftFromLine size={20} color="white" />
      </Pressable>
      <ViewChallenge challengeId={challengeId} />
    </View>
  );
}
