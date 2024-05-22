import { addDays, eachDayOfInterval, getDay, subDays } from "date-fns";
import { ChallengeSchema } from "@30-day-challenge/prisma-schema";
import { z } from "zod";
import { ChallengeIncludingDailyProgressSchema } from "../hooks/react-query";

export type gridData = {
  dateValue: Date;
  isPadding: boolean;
}[];
export const createCalendarDates = (
  challenge: z.infer<typeof ChallengeIncludingDailyProgressSchema>
) => {
  const dates = eachDayOfInterval({
    start: challenge.startDate,
    end: challenge.endDate,
  });

  const paddingBefore = getDay(challenge.startDate);
  const weekCount = Math.ceil((dates.length + paddingBefore) / 7);
  const paddingAfter = weekCount * 7 - (dates.length + paddingBefore);

  const gridData = [];

  // Add padding before dates
  for (let i = 0; i < paddingBefore; i++) {
    const date = subDays(challenge.startDate, paddingBefore - i);
    gridData.push({
      dateValue: date,
      isPadding: true,
    });
  }

  // Add actual dates
  dates.forEach((date) => {
    gridData.push({
      dateValue: date,
      isPadding: false,
    });
  });

  // Add padding after dates
  for (let i = 0; i < paddingAfter; i++) {
    const date = addDays(challenge.endDate, i + 1);
    gridData.push({
      dateValue: date,
      isPadding: true,
    });
  }

  return gridData;
};
