import { imageAtom } from "@/lib/atoms";
import { Camera, CameraType } from "expo-camera/legacy";
import { router } from "expo-router";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProgressPictureCamera() {
  const [type, setType] = useState(CameraType.back);
  const bottomPadding = useSafeAreaInsets().bottom;
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useAtom(imageAtom);
  const [camera, setCamera] = useState<Camera | null>(null);

  if (!permission) {
    return <View />;
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center gap-3">
        <Text className="text-center">
          We need your permission to show the camera
        </Text>
        <Pressable
          onPress={requestPermission}
          className="mx-auto bg-blue-500 px-3 py-2 rounded-lg"
        >
          <Text className="text-center text-white">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  async function takeImage() {
    camera?.takePictureAsync({}).then((image) => {
      console.log(image);
      setImage(image);
    });
  }

  function retakeImage() {
    if (!image) return;

    setImage(undefined);
  }

  function confirmImage() {
    if (!image) return;

    router.back();
  }

  return (
    <View className="flex-1 justify-center">
      {!image ? (
        <>
          <Camera
            ref={(ref) => setCamera(ref)}
            style={{ flex: 1 }}
            type={type}
            pictureSize="Photo"
          >
            <View>
              <Pressable onPress={toggleCameraType}>
                <Text>Flip Camera</Text>
              </Pressable>
            </View>
          </Camera>
          <View className="h-16 flex flex-row justify-center items-center absolute bottom-0 w-full">
            {!image ? (
              <Pressable
                className="bg-blue-500 px-3 py-2 rounded-lg"
                onPress={takeImage}
              >
                <Text className="text-center text-white">Take Picture</Text>
              </Pressable>
            ) : null}
            {image ? (
              <View className="flex flex-row gap-3">
                <Pressable
                  className="bg-red-500 px-3 py-2 rounded-lg"
                  onPress={retakeImage}
                >
                  <Text className="text-center text-white">Retake</Text>
                </Pressable>
                <Pressable
                  className="bg-blue-500 px-3 py-2 rounded-lg"
                  onPress={confirmImage}
                >
                  <Text className="text-center text-white">Confirm</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </>
      ) : null}
      {image ? (
        <View className="flex items-center flex-1">
          <View className="flex-1 w-full">
            <Image src={image.uri} alt="test" style={{ flex: 1 }} />
          </View>
          <View className="flex flex-row gap-3">
            <Pressable
              className="bg-red-500 px-3 py-2 rounded-lg"
              onPress={retakeImage}
            >
              <Text className="text-center text-white">Retake</Text>
            </Pressable>
            <Pressable
              className="bg-blue-500 px-3 py-2 rounded-lg"
              onPress={confirmImage}
            >
              <Text className="text-center text-white">Confirm</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
