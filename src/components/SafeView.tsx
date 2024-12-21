import { cn } from "@/lib/util/util";
import React from "react";
import { Dimensions, View } from "react-native";
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

  return (
    <View
      style={{
        paddingTop: top ? topPadding : 0,
        paddingRight: right ? rightPadding : 0,
        paddingBottom: bottom ? bottomPadding : 0,
        paddingLeft: left ? leftPadding : 0,
        maxHeight: windowHeight,
      }}
      className={cn("flex-1 relative", className)}
    >
      {children}
    </View>
  );
}
