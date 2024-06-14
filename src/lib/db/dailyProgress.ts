import { DailyProgressSchema } from "@30-day-challenge/prisma-zod";
import { queryApiPost } from "../util/util";

export const getDailyProgress = async (userId: string) => {
  const res = await queryApiPost(
    "/api/daily-progress/get-by-challenge",
    { clerkId: userId },
    DailyProgressSchema.array()
  );

  return res;
};
