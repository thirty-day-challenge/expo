import {
  Challenge,
  ChallengeSchema,
  DailyProgress,
  DailyProgressSchema,
} from "@30-day-challenge/prisma-zod";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { z } from "zod";

const getChallenges = async (userId: string) => {
  const response = await ky
    .post(`${process.env.EXPO_PUBLIC_NEXTJS_URL}/api/get-challenges`, {
      json: { clerkId: userId },
    })
    .json()
    .catch((e) => {
      console.error(e);
    });

  const ResponseSchema = z.object({
    message: z.string(),
    data: ChallengeSchema.array(),
  });

  try {
    const validatedData = ResponseSchema.parse(response);
    return validatedData.data;
  } catch (e) {
    console.error("Validation failed:", e);
    throw new Error("Validation failed");
  }
};

export type challenges = Challenge[];

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

export type daily_progress = DailyProgress[];

const getDailyProgress = async (userId: string) => {
  const response = await ky
    .post(
      `${process.env.EXPO_PUBLIC_NEXTJS_URL}/api/view-progress-completion`,
      {
        json: { clerkId: userId },
        retry: 0,
      }
    )
    .json()
    .catch((e) => console.error(e));

  const ResponseSchema = DailyProgressSchema.array();

  try {
    const validatedData = ResponseSchema.parse(response);
    return validatedData;
  } catch (e) {
    console.error("Validation error:", e);
    throw new Error("Validation error!");
  }
};

export const useDailyProgress = () => {
  const { userId, isLoaded } = useAuth();

  const queryFn = () => {
    if (!isLoaded || !userId) {
      return Promise.resolve([]);
    }
    return getDailyProgress(userId);
  };

  return useQuery({
    queryKey: ["daily-progress"],
    queryFn,
    enabled: isLoaded && Boolean(userId),
    retry: false,
  });
};
