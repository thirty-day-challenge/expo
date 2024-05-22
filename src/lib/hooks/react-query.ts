import { ChallengeSchema } from "@30-day-challenge/prisma-schema";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const ChallengeIncludingDailyProgressSchema = ChallengeSchema.merge(
  z.object({
    dailyProgress: z.any(),
  })
);
const ChallengesIncludingDailyProgressSchema =
  ChallengeIncludingDailyProgressSchema.array();

const getChallenges = async (userId: string) => {
  const { message, data } = await fetch(
    `${process.env.EXPO_PUBLIC_NEXTJS_URL}/api/get-challenges`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkId: userId }),
    }
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((e) => {
      console.error(e);
      throw new Error("Challenges failed to be fetched");
    });

  try {
    const validatedData = ChallengesIncludingDailyProgressSchema.parse(data);
    return validatedData;
  } catch (e) {
    console.error("Validation failed");
    throw new Error("Validation failed");
  }
};

export const useChallenges = () => {
  const { userId, isLoaded } = useAuth();

  const queryFn = () => {
    if (!isLoaded || !userId) {
      return Promise.resolve([]);
    }
    return getChallenges(userId);
  };

  return useQuery({
    queryKey: ["challenges"],
    queryFn,
    enabled: isLoaded && Boolean(userId),
    retry: false,
  });
};
