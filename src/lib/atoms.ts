import { atom } from "jotai";
import { CameraCapturedPicture } from "expo-camera/legacy";

export const imageAtom = atom<CameraCapturedPicture | undefined>(undefined);
