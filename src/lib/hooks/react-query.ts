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

const queryApiPost = async (route: string, json: any, schema: any) => {
  const response = await ky
    .post(`${process.env.EXPO_PUBLIC_NEXTJS_URL}${route}`, {
      json,
    })
    .json()
    .catch((e) => {
      console.error(e);
    });

  try {
    const validatedData = schema.parse(response);
    return validatedData;
  } catch (e) {
    console.error("Validation failed:", e);
    throw new Error("Validation failed");
  }
};

const getChallenges = async (userId: string) => {
  const res = await queryApiPost(
    "/api/challenge/get",
    { clerkId: userId },
    z.object({
      message: z.string(),
      data: ChallengeSchema.array(),
    })
  );

  return res.data;
};

/**
 * Custom hook for fetching challenges using React Query.
 * @returns {useQuery} The React Query hook for fetching challenges.
 */
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
export type challenges = Challenge[];

const getDailyProgress = async (userId: string) => {
  const res = await queryApiPost(
    "/api/daily-progress/get-by-challenge",
    { clerkId: userId },
    DailyProgressSchema.array()
  );

  return res;
};

/**
 * Custom hook for fetching daily progress using React Query.
 * @returns {useQuery} The React Query hook for fetching daily progress.
 */
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
export type daily_progress = DailyProgress[];
