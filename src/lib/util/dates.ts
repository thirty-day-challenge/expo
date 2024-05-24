import {
  addDays,
  eachDayOfInterval,
  endOfDay,
  getDay,
  isSameDay,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";
import {
  ChallengeSchema,
  DailyProgress,
  DailyProgressSchema,
} from "@30-day-challenge/prisma-zod";
import { z } from "zod";

export type gridData = {
  dateValue: Date;
  isPadding: boolean;
  dailyProgress: DailyProgress | undefined;
}[];

export const createCalendarDates = (
  challenge: z.infer<typeof ChallengeSchema>,
  dailyProgressData: z.infer<typeof DailyProgressSchema>[]
) => {
  const dates = eachDayOfInterval({
    start: challenge.startDate,
    end: challenge.endDate,
  });

  const paddingBefore = getDay(challenge.startDate);
  const weekCount = Math.ceil((dates.length + paddingBefore) / 7);
  const paddingAfter = weekCount * 7 - (dates.length + paddingBefore);

  const gridData: gridData = [];

  // Add padding before dates
  for (let i = 0; i < paddingBefore; i++) {
    const date = subDays(challenge.startDate, paddingBefore - i);
    gridData.push({
      dateValue: date,
      isPadding: true,
      dailyProgress: undefined,
    });
  }

  // Add actual dates
  dates.forEach((date) => {
    let dailyProgress = undefined;

    dailyProgressData.forEach((dailyProgressDay) => {
      if (isSameDay(date, dailyProgressDay.date))
        dailyProgress = dailyProgressDay;
    });

    gridData.push({
      dateValue: date,
      isPadding: false,
      dailyProgress,
    });
  });

  // Add padding after dates
  for (let i = 0; i < paddingAfter; i++) {
    const date = addDays(challenge.endDate, i + 1);
    gridData.push({
      dateValue: date,
      isPadding: true,
      dailyProgress: undefined,
    });
  }

  return gridData;
};

export const isDateValid = (dateToCheck: Date, startDate: Date) => {
  return isWithinInterval(dateToCheck, {
    start: startOfDay(startDate),
    end: endOfDay(new Date()),
  });
};
