import {
  DailyProgressOptionalDefaults,
  DailyProgressSchema,
} from "@30-day-challenge/prisma-zod";
import { postApi, putApi } from "../util/util";
import { z } from "zod";

export const getDailyProgress = async (userId: string) => {
  const Schema = DailyProgressSchema.array();
  type Schema = z.infer<typeof Schema>;

  const res: Schema = await postApi(
    "/api/daily-progress/get-by-challenge",
    { clerkId: userId },
    Schema
  );

  return res;
};

export type DailyProgressInput = Omit<
  DailyProgressOptionalDefaults,
  "userId"
> & {
  clerkId: string;
};
export const upsertDailyProgress = async (reqBody: DailyProgressInput) => {
  const ResponseSchema = z.object({
    message: z.string(),
    data: DailyProgressSchema,
  });
  type ResponseSchema = z.infer<typeof ResponseSchema>;

  const response: ResponseSchema = await putApi(
    "/api/daily-progress/modify",
    reqBody,
    ResponseSchema
  );

  return response;
};
