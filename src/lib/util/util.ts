import { ClassValue, clsx } from "clsx";
import ky from "ky";
import { twMerge } from "tailwind-merge";
import { ZodType } from "zod";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const queryApiPost = async (
  route: string,
  json: any,
  schema: ZodType
) => {
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
