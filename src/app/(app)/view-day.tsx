import { View, Text, Pressable } from "react-native";
import React from "react";
import { ArrowLeftFromLine } from "lucide-react-native";
import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import { z } from "zod";

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

  const date = new Date(searchParams.date);

  return (
    <>
      <Link href={"/"} asChild>
        <Pressable className="bg-black rounded-md p-2 absolute top-14 left-10">
          <ArrowLeftFromLine size={20} color="white" />
        </Pressable>
      </Link>
      <View className="flex items-center justify-center flex-1">
        <Text className="text-xl font-bold">
          Date: {date.toLocaleDateString()}
        </Text>
      </View>
    </>
  );
};

export default ViewDay;
