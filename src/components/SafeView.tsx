import { cn } from "@/lib/util/util";
import React from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SafeViewProps = {
  top?: boolean;
  right?: boolean;
  left?: boolean;
  bottom?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export default function SafeView({
  top,
  right,
  left,
  bottom,
  children,
  className,
}: SafeViewProps) {
  const {
    top: topPadding,
    right: rightPadding,
    left: leftPadding,
    bottom: bottomPadding,
  } = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;

  return <SafeAreaView className="flex-1">{children}</SafeAreaView>;
}
