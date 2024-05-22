import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useSession, useSignUp } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import SafeView from "@/components/SafeView";

export default function Page() {
  const { isSignedIn } = useSession();

  if (isSignedIn) return <Redirect href={"/"} />;

  return (
    <SafeView
      top
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
    </SafeView>
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

  const handleSignUp = async (data: SignUpFormData) => {
    const { emailAddress, username, password } = data;

    try {
      const completedSignUp = await signUp!.create({
        emailAddress,
        username,
        password,
      });

      await setActive!({ session: completedSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const validateUsername = async (username: string) => {
    return true;
  };

  return (
    <>
      <View className="gap-3">
        <View className="gap-0.5">
          <Text>Email address</Text>
          <Controller
            control={control}
            rules={{
              required: "Email address field is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address.",
              },
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
            <Text className="text-red-500 text-sm">
              {errors.emailAddress.message}
            </Text>
          ) : null}
        </View>
        <View className="gap-0.5">
          <Text>Username</Text>
          <Controller
            control={control}
            rules={{
              required: "Username field is required.",
              validate: (username) => true || "Username is already taken.",
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
            <Text className="text-red-500 text-sm">
              {errors.username.message}
            </Text>
          ) : null}
        </View>
        <View className="gap-0.5">
          <Text>Password</Text>
          <Controller
            control={control}
            rules={{
              required: "Password field is required.",
              minLength: {
                value: 8,
                message: "A minimum length of 8 characters is required.",
              },
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
            <Text className="text-red-500 text-sm">
              {errors.password.message}
            </Text>
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
