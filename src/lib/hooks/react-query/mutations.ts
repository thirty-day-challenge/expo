import { ChallengeInput, upsertChallenge } from "@/lib/db/challenge";
import { queryClient } from "@/lib/util/react-query";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { challenges, daily_progress } from "./queries";
import { EditChallengeSearchParams } from "@/app/(app)/challenge-forms/edit";
import { upsertDailyProgress } from "@/lib/db/dailyProgress";

export const useChallengeMutation = (id: string | undefined) => {
  return useMutation({
    mutationFn: async (challengeInput: ChallengeInput) => {
      return await upsertChallenge(challengeInput);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["challenges"], (oldData: challenges) => {
        if (id)
          return oldData.map((challenge) => {
            if (challenge.id === id) {
              return data;
            }
            return challenge;
          });

        return [...oldData, data];
      });
      router.push("/");
    },
  });
};

export const useDailyProgressMutation = () => {
  return useMutation({
    mutationFn: upsertDailyProgress,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["daily-progress"] });
      const previousDailyProgress = queryClient.getQueryData([
        "daily-progress",
      ]);
      queryClient.setQueryData(
        ["daily-progress"],
        (oldData: daily_progress) => [...oldData, data]
      );

      return { previousDailyProgress };
    },
    onError: (err, data, context) => {
      queryClient.setQueryData(
        ["daily-progress"],
        context?.previousDailyProgress
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-progress"] });
    },
  });
};
