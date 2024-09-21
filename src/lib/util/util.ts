import { ClassValue, clsx } from "clsx";
import ky from "ky";
import RNFS from "react-native-fs";
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
    const parsedData = schema.safeParse(response);
    if (parsedData.error) throw new Error("Validation failed, route: " + route);
    const validatedData = parsedData.data;
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

export const convertToBase64 = async (imageUri: string) => {
  try {
    // Determine the MIME type based on the file extension
    let mimeType = "";

    if (imageUri.endsWith(".jpg") || imageUri.endsWith(".jpeg")) {
      mimeType = "image/jpeg";
    } else if (imageUri.endsWith(".png")) {
      mimeType = "image/png";
    } else if (imageUri.endsWith(".gif")) {
      mimeType = "image/gif";
    } else if (imageUri.endsWith(".bmp")) {
      mimeType = "image/bmp";
    } else if (imageUri.endsWith(".webp")) {
      mimeType = "image/webp";
    } else {
      throw new Error("Unsupported image type");
    }

    // Read the image file and convert it to a Base64 string
    const base64String = await RNFS.readFile(imageUri, "base64");

    // Create the full Base64 image string with the appropriate data URI prefix
    const base64Image = `data:${mimeType};base64,${base64String}`;

    // Return the complete Base64 image string
    return base64Image;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error; // Re-throw the error if you need to handle it elsewhere
  }
};
