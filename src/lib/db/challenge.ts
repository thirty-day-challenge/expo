import {
  Challenge,
  ChallengeOptionalDefaults,
  ChallengeSchema,
} from "@30-day-challenge/prisma-zod";
import { postApi, putApi } from "../util/util";
import { z } from "zod";

export const getChallenges = async (userId: string) => {
  const Schema = z.object({
    message: z.string(),
    data: ChallengeSchema.array(),
  });
  type Schema = z.infer<typeof Schema>;

  const res: Schema = await postApi(
    "/api/challenge/get",
    { clerkId: userId },
    Schema
  );

  return res.data;
};

export type ChallengeInput = Omit<
  ChallengeOptionalDefaults,
  "userId" | "startDate" | "endDate" | "id"
> & { clerkId?: string; id?: string };
export const upsertChallenge = async (challengeInput: ChallengeInput) => {
  const ResponseSchema = z.object({
    message: z.string(),
    data: ChallengeSchema,
  });
  type ResponseSchema = z.infer<typeof ResponseSchema>;

  const response: ResponseSchema = await putApi(
    `/api/challenge/${challengeInput.id ? "update" : "create"}`,
    challengeInput,
    ResponseSchema
  );

  return response.data;
};
