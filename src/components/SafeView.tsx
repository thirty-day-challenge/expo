import { View, Text } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/util/util";

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

  return (
    <View
      style={{
        paddingTop: top ? topPadding : 0,
        paddingRight: right ? rightPadding : 0,
        paddingBottom: bottom ? bottomPadding : 0,
        paddingLeft: left ? leftPadding : 0,
      }}
      className={cn("flex-1", className)}
    >
      {children}
    </View>
  );
}
