import { View, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { ArrowLeftFromLine } from "lucide-react-native";
import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import RNFS from "react-native-fs";
import { uploadImage, upsertDailyProgress } from "@/lib/db/dailyProgress";

export type ViewDaySearchParams = {
  date: string;
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

const convertToBase64 = async (imageUri: string) => {
  try {
    // Determine the MIME type based on the file extension
    let mimeType = "";

    if (imageUri.endsWith(".jpg") || imageUri.endsWith(".jpeg")) {
      mimeType = "image/jpeg";
    } else if (imageUri.endsWith(".png")) {
      mimeType = "image/png";
    } else if (imageUri.endsWith(".gif")) {
      mimeType = "image/gif";
    } else if (imageUri.endsWith(".bmp")) {
      mimeType = "image/bmp";
    } else if (imageUri.endsWith(".webp")) {
      mimeType = "image/webp";
    } else {
      throw new Error("Unsupported image type");
    }

    // Read the image file and convert it to a Base64 string
    const base64String = await RNFS.readFile(imageUri, "base64");

    // Create the full Base64 image string with the appropriate data URI prefix
    const base64Image = `data:${mimeType};base64,${base64String}`;

    // Return the complete Base64 image string
    return base64Image;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error; // Re-throw the error if you need to handle it elsewhere
  }
};

const ViewDay = () => {
  const searchParams = useLocalSearchParams<ViewDaySearchParams>();

  if (!searchParams.date || !dateSchema.safeParse(searchParams.date).success) {
    return <Redirect href={"/"} />;
  }

  const date = new Date(searchParams.date);

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
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

  const saveChanges = async () => {
    if (!image) return;

    const base64 = await convertToBase64(image);

    if (!base64) return;

    const url = await uploadImage(base64);

    // await upsertDailyProgress({
    //   imageUrl: url,
    // })
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
