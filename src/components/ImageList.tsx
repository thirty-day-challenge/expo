import { DailyProgress } from "@30-day-challenge/prisma-zod";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";

export default function ImageList({
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
