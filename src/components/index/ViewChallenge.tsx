import Calendar from "@/components/Calendar";
import ChallengeInfo from "@/components/ChallengeInfo";
import ImageList from "@/components/ImageList";
import {
  useChallenges,
  useDailyProgress,
} from "@/lib/hooks/react-query/queries";
import { createCalendarDates } from "@/lib/util/dates";
import { Redirect } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const ViewChallenge = ({ route }: any) => {
  const challengeId = route.params?.id;

  const {
    data: challengesData,
    error,
    isLoading: isChallengesLoading,
  } = useChallenges();
  const { isLoading: isDailyProgressDataLoading } = useDailyProgress();
  const { data: dailyProgressData } = useDailyProgress();

  const filteredDailyProgressData =
    dailyProgressData?.filter((day) => day.challengeId === challengeId) || [];

  if (isChallengesLoading || isDailyProgressDataLoading)
    return <Text>Challenges data is loading...</Text>;

  if (!challengesData || challengesData.length === 0)
    return <Redirect href={"/challenge-forms/create"} />;

  if (dailyProgressData == undefined) throw new Error();

  const challenge = challengesData.find(
    (challenge) => challenge.id === challengeId
  )!;

  const gridData = createCalendarDates(challenge, dailyProgressData);

  return (
    <View className="flex-1 mt-5" style={{ overflow: "scroll" }}>
      <View className="w-5/6 mx-auto gap-5">
        <ChallengeInfo challenge={challenge} gridData={gridData} />
        <Calendar gridData={gridData} challengeId={challengeId} />
      </View>
      <ScrollView className="w-full">
        <View className="w-5/6 mx-auto">
          <ImageList dailyProgressData={filteredDailyProgressData} />
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewChallenge;
