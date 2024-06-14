import { ChallengeSchema } from "@30-day-challenge/prisma-zod";
import { queryApiPost } from "../util/util";
import { z } from "zod";

export const getChallenges = async (userId: string) => {
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
