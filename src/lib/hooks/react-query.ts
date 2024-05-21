import { ChallengeSchema } from "@30-day-challenge/prisma-schema";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const getChallenges = async (userId: string) => {
  const { message, data } = await fetch(
    "http://192.168.68.74:3000/api/get-challenges",
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

  const schema = ChallengeSchema.extend({ dailyProgress: z.any() }).array();

  try {
    const validatedData = schema.parse(data);
    return validatedData;
  } catch (e) {
    console.error("Validation failed");
    throw new Error("Validation failed");
  }
};

export const useChallenges = () => {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ["challenges"],
    queryFn: () => getChallenges(userId),
    retry: false,
  });
};
