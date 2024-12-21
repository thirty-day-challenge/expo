import Calendar from "@/components/Calendar";
import ChallengeInfo from "@/components/ChallengeInfo";
import SafeView from "@/components/SafeView";
import {
  useChallenges,
  useDailyProgress,
} from "@/lib/hooks/react-query/queries";
import { createCalendarDates } from "@/lib/util/dates";
import { DailyProgress } from "@30-day-challenge/prisma-zod";
import { ErrorBoundaryProps, Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, Text, View } from "react-native";

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SafeView
      top
      className="flex-1 flex justify-center items-center bg-red-600"
    >
      <Text>{props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </SafeView>
  );
}

export default function Page() {
  const {
    data: challengesData,
    error,
    isLoading: isChallengesLoading,
  } = useChallenges();
  const { isLoading: isDailyProgressDataLoading } = useDailyProgress();
  const { data: dailyProgressData } = useDailyProgress();

  if (isChallengesLoading || isDailyProgressDataLoading)
    return <Text>Challenges data is loading...</Text>;

  if (!challengesData || challengesData.length === 0)
    return <Redirect href={"/challenge-forms/create"} />;

  if (dailyProgressData == undefined) throw new Error();

  const challenge = challengesData![0];
  const gridData = createCalendarDates(challenge, dailyProgressData);

  return (
    <View className="flex-1" style={{ overflow: "scroll" }}>
      <View className="w-5/6 mx-auto gap-5">
        <ChallengeInfo challenge={challengesData[0]} gridData={gridData} />
        <Calendar gridData={gridData} />
      </View>
      <ScrollView className="w-full">
        <View className="w-5/6 mx-auto">
          <ImageList dailyProgressData={dailyProgressData} />
        </View>
      </ScrollView>
    </View>
  );
}

function ImageList({
  dailyProgressData,
}: {
  dailyProgressData: DailyProgress[];
}) {
  return (
    <View className="flex flex-col gap-5">
      <Text className="font-bold text-xl text-center">Progress Images</Text>
      <View className="gap-5 flex flex-col-reverse">
        {dailyProgressData.map((item, index) => (
          <ImageListItem key={index} url={item.imageUrl} date={item.date} />
        ))}
      </View>
    </View>
  );
}

function ImageListItem({ date, url }: { date: Date; url: string }) {
  if (!url) return null;
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    Image.getSize(url, (width, height) => {
      setAspectRatio(width / height);
    });
  }, [url]);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const imageContainerWidth = screenWidth * (5 / 6); // 5/6 of screen width
  const calculatedHeight = imageContainerWidth / aspectRatio;
  const maxHeight = screenHeight / 4; // Maximum height as 1/4 of the screen height

  // Clamp the image height to the maximum value
  const imageHeight = Math.min(calculatedHeight, maxHeight);

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-center text-md">{date.toLocaleDateString()}</Text>
      <Image
        source={{ uri: url }}
        style={{
          width: imageContainerWidth, // Keep the defined width
          height: imageHeight,
          alignSelf: "flex-start", // Ensure the image is aligned to the left
        }}
        resizeMode="contain"
      />
    </View>
  );
}
