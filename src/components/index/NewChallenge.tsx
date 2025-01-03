import { ChallengeForm } from "@/components/ChallengeForm";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const NewChallenge = () => {
  return (
    <KeyboardAvoidingView className="flex-1" behavior="padding" enabled>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1 flex flex-col items-center gap-5 justify-center mx-auto w-3/4">
          <View className="w-full">
            <Text className="font-bold text-xl">Create Your Challenge!</Text>
          </View>
          <ChallengeForm />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default NewChallenge;
