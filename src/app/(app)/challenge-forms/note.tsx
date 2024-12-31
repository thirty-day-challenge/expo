import { useChallengeMutation } from "@/lib/hooks/react-query/mutations";
import { useChallenges } from "@/lib/hooks/react-query/queries";
import { Link, router } from "expo-router";
import { ArrowLeftFromLine } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Note() {
  const {
    data: challengeData,
    isLoading: isChallengesLoading,
    error,
  } = useChallenges();

  if (isChallengesLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    router.back();
    return;
  }
  if (!isChallengesLoading && challengeData && challengeData.length === 0) {
    router.back();
    return;
  }

  const { mutate } = useChallengeMutation(challengeData![0].id);

  const [noteValue, setNoteValue] = useState<string | null>("");

  useEffect(() => {
    if (challengeData && challengeData[0]) {
      setNoteValue(challengeData[0].note || "");
    }
  }, [challengeData]);

  const saveChanges = () => {
    const noteInput = {
      ...challengeData![0],
      note: noteValue || undefined,
    };

    mutate(noteInput);
    router.back();
  };

  return (
    <KeyboardAvoidingView className="flex-1" behavior="padding" enabled>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex flex-1 items-center justify-center gap-3 z-10">
          <View className="flex items-start w-2/3 mx-auto gap-5">
            <View>
              <Text className="text-lg font-bold">
                Write a note about this challenge!
              </Text>
            </View>
            <TextInput
              className="border border-black rounded-lg px-2 w-full min-h-40"
              multiline
              numberOfLines={40}
              textAlignVertical="top"
              value={noteValue || ""}
              onChangeText={setNoteValue}
            />
            <Pressable
              className="bg-black rounded-lg px-3 py-2 text-white"
              onPress={saveChanges}
            >
              <Text className="text-white">Submit</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Pressable
        className="bg-black rounded-md p-2 absolute top-0 left-10 z-50"
        onPress={() => router.back()}
      >
        <ArrowLeftFromLine size={20} color="white" />
      </Pressable>
    </KeyboardAvoidingView>
  );
}
