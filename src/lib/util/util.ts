import { ClassValue, clsx } from "clsx";
import { router } from "expo-router";
import ky from "ky";
import { twMerge } from "tailwind-merge";
import { ZodType } from "zod";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const apiRequest = async (
  method: "post" | "put",
  route: string,
  json: any,
  schema: ZodType<any, any, any>
) => {
  const url = `${process.env.EXPO_PUBLIC_NEXTJS_URL}${route}`;

  const response = await ky[method](url, { json })
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

export const postApi = async (
  route: string,
  json: any,
  schema: ZodType<any, any, any>
) => {
  return apiRequest("post", route, json, schema);
};

export const putApi = async (
  route: string,
  json: any,
  schema: ZodType<any, any, any>
) => {
  return apiRequest("put", route, json, schema);
};
