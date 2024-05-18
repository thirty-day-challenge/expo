import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

export default function Page() {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: top }}
      className="flex flex-1 w-2/3 mx-auto items-center justify-center"
    >
      <View className="flex w-full gap-4">
        <Text className="font-bold text-lg">Sign Up</Text>
        <Form />
        <View className="flex flex-row">
          <Text>Already have an account? </Text>
          <Link href={"/sign-in"} className="text-blue-700 font-bold">
            Sign in
          </Link>
        </View>
      </View>
    </View>
  );
}

type SignUpFormData = {
  emailAddress: string;
  username: string;
  password: string;
};

function Form() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();
  const { signUp, setActive } = useSignUp();

  const handleSignUp = async (data) => {
    const { emailAddress, username, password } = data;

    try {
      const completedSignUp = await signUp.create({
        emailAddress,
        username,
        password,
      });

      await setActive({ session: completedSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <View className="gap-3">
        <View className="gap-0.5">
          <Text>Email address</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="border border-black rounded-lg px-2">
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
            name="emailAddress"
          />
          {errors.emailAddress ? (
            <Text className="text-red-500 text-sm">This is required.</Text>
          ) : null}
        </View>
        <View className="gap-0.5">
          <Text>Username</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="border border-black rounded-lg px-2">
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
            name="username"
          />
          {errors.username ? (
            <Text className="text-red-500 text-sm">This is required.</Text>
          ) : null}
        </View>
        <View className="gap-0.5">
          <Text>Password</Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="border border-black rounded-lg px-2">
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
            name="password"
          />
          {errors.password ? (
            <Text className="text-red-500 text-sm">This is required.</Text>
          ) : null}
        </View>
      </View>
      <Pressable
        className="px-3 py-2 bg-blue-500 mr-auto rounded-lg"
        onPress={handleSubmit(handleSignUp)}
      >
        <Text className="text-white">Submit</Text>
      </Pressable>
    </>
  );
}
