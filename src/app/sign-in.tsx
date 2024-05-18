import { View, Text, TextInput, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useAuth, useSession, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";

export default function Page() {
  const { top } = useSafeAreaInsets();
  const { isSignedIn } = useSession();
  const router = useRouter();

  if (isSignedIn) return <Redirect href={"/"} />;

  return (
    <View
      style={{ paddingTop: top }}
      className="flex flex-1 w-2/3 mx-auto items-center justify-center"
    >
      <View className="flex w-full gap-4">
        <Text className="font-bold text-lg">Sign In</Text>
        <Form />
        <View className="flex flex-row">
          <Text>No account? </Text>
          <Link href={"/sign-up"} className="text-blue-700 font-bold">
            Sign up
          </Link>
        </View>
      </View>
    </View>
  );
}

type SignInFormData = {
  emailAddress: string;
  password: string;
};

function Form() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();
  const { signIn, setActive, isLoaded } = useSignIn();

  const handleSignIn = async (data) => {
    const { emailAddress, password } = data;

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (e: any) {
      console.error(e);
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
          <Text>Password</Text>
          <Controller
            control={control}
            rules={{
              required: true,
              minLength: 8,
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
        onPress={handleSubmit(handleSignIn)}
      >
        <Text className="text-white">Submit</Text>
      </Pressable>
    </>
  );
}
