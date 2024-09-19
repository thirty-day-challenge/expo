import { imageAtom } from "@/lib/db/atoms";
import { DailyProgressInput, uploadImage } from "@/lib/db/dailyProgress";
import { useDailyProgressMutation } from "@/lib/hooks/react-query/mutations";
import {
  useChallenges,
  useDailyProgress,
} from "@/lib/hooks/react-query/queries";
import { convertToBase64 } from "@/lib/util/util";
import { useAuth } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";
import { ArrowLeftFromLine } from "lucide-react-native";
import React, { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { z } from "zod";

export type ViewDaySearchParams = {
  date: string;
  id: string;
};

const dateSchema = z.string().refine(
  (dateString) => {
    // Check if the date string can be parsed into a valid Date object
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  },
  {
    message: "Invalid date format",
  }
);

const useImagePicker = () => {
  const [image, setImage] = useAtom(imageAtom);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return { image, setImage, pickImage, removeImage };
};

const DailyImage = () => {
  const { image, pickImage, removeImage } = useImagePicker();

  return (
    <View className="flex items-center w-full gap-5">
      <View
        className={`w-full flex flex-row ${
          image ? "justify-between" : "justify-center"
        }`}
      >
        <Pressable
          className="px-3 py-2 bg-blue-500 rounded-lg"
          onPress={pickImage}
        >
          <Text className="text-white">
            {!image ? "Pick Image" : "Change Image"}
          </Text>
        </Pressable>
        {image ? (
          <Pressable
            className="px-3 py-2 bg-red-500 rounded-lg"
            onPress={removeImage}
          >
            <Text className="text-white">Remove</Text>
          </Pressable>
        ) : null}
      </View>
      <View className="w-full flex items-center">
        {image && (
          <Image
            source={{ uri: image }}
            className="h-64 w-full"
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
};

const ViewDay = () => {
  const searchParams = useLocalSearchParams<ViewDaySearchParams>();

  const { userId } = useAuth();
  const { mutate } = useDailyProgressMutation();
  const { data: dailyProgressData } = useDailyProgress();
  const { image, setImage } = useImagePicker();
  const {
    data: challengesData,
    error,
    isLoading: isChallengesLoading,
  } = useChallenges();

  if (
    !searchParams.date ||
    !dateSchema.safeParse(searchParams.date).success ||
    error ||
    (!challengesData && !isChallengesLoading)
  ) {
    return <Redirect href={"/"} />;
  }

  const date = new Date(searchParams.date);

  const dailyProgress = dailyProgressData?.find(
    (dp) => dp.id === searchParams.id
  );

  useEffect(() => {
    if (dailyProgress) setImage(dailyProgress.imageUrl);
  }, []);

  const saveChanges = async () => {
    if (isChallengesLoading) {
      return;
    }

    let url;
    if (image && (!dailyProgress || image !== dailyProgress.imageUrl)) {
      const base64 = await convertToBase64(image!);

      if (!base64) return;

      url = await uploadImage(base64);
    }

    const mutationInput: DailyProgressInput = {
      id: searchParams.id,
      imageUrl: url,
      challengeId: challengesData![0].id,
      date: date,
      completed: dailyProgress?.completed || false,
      clerkId: userId!,
    };

    if (dailyProgress?.imageUrl === mutationInput.imageUrl) {
      console.log("no changes have been made");
    }

    mutate(mutationInput);

    router.back();
  };

  return (
    <>
      <Link href={"/"} asChild>
        <Pressable className="bg-black rounded-md p-2 absolute top-14 left-10">
          <ArrowLeftFromLine size={20} color="white" />
        </Pressable>
      </Link>
      <View className="flex items-center justify-center flex-1 px-10 gap-8">
        <Text className="text-xl font-bold">
          Date: {date.toLocaleDateString()}
        </Text>
        <DailyImage />
        <Pressable
          className="px-3 py-2 bg-black rounded-lg"
          onPress={saveChanges}
        >
          <Text className="text-white">Save Changes</Text>
        </Pressable>
      </View>
    </>
  );
};

export default ViewDay;
