import { ClerkProvider } from "@clerk/clerk-expo";
import "@/global.css";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <Slot />
    </ClerkProvider>
  );
}
