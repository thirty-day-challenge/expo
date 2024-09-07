import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { ArrowLeftFromLine, Camera } from "lucide-react-native";
import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { useAtom } from "jotai";
import { imageAtom } from "@/lib/atoms";

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

const ViewDay = () => {
  const searchParams = useLocalSearchParams<ViewDaySearchParams>();

  if (!searchParams.date || !dateSchema.safeParse(searchParams.date).success) {
    return <Redirect href={"/"} />;
  }

  const [image, setImage] = useAtom(imageAtom);

  const takeProgressPicture = () => {
    setImage(undefined);

    router.push("/progress-picture-camera");
  };

  return (
    <>
      <Link href={"/"} asChild>
        <Pressable className="bg-black rounded-md p-2 absolute top-14 left-10">
          <ArrowLeftFromLine size={20} color="white" />
        </Pressable>
      </Link>
      <View className="flex items-center justify-center flex-1">
        <Pressable
          className="rounded-md p-2 border-2"
          onPress={takeProgressPicture}
        >
          <Camera size={24} color="black" />
        </Pressable>
        {image ? (
          <View>
            <Image
              src={image.uri}
              alt="hi"
              style={{ width: image.width, height: 200 }}
            />
          </View>
        ) : null}
      </View>
    </>
  );
};

export default ViewDay;
