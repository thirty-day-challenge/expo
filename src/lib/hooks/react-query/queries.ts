import {
  Challenge,
  ChallengeSchema,
  DailyProgress,
  DailyProgressSchema,
} from "@30-day-challenge/prisma-zod";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { queryApiPost } from "../../util/util";
import { getChallenges } from "../../db/challenge";
import { getDailyProgress } from "../../db/dailyProgress";

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
