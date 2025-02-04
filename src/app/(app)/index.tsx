import { challenges, useChallenges } from "@/lib/hooks/react-query/queries";
import { Link } from "expo-router";
import { FlatList, ListRenderItemInfo, Text, View } from "react-native";

const Item = ({ item }: ListRenderItemInfo<challenges[number] | "CREATE">) => {
  if (item === null) {
    return <View style={{ flex: 1, width: "48%", padding: 8 }} />;
  }

  return (
    <View className="w-[48%] p-2">
      <Link
        href={
          item === "CREATE"
            ? "challenge-forms/create"
            : {
                pathname: "view-challenge/[challengeId]",
                params: { challengeId: item.id },
              }
        }
        className="flex-1 h-full"
      >
        <View className="flex-1">
          <View className="aspect-square w-full bg-neutral-200 rounded-lg justify-center items-center">
            {item === "CREATE" ? (
              <Text
                className="text-[60px]"
                style={{ lineHeight: 120, includeFontPadding: false }}
              >
                ➕
              </Text>
            ) : (
              <Text
                className="text-[60px]"
                style={{ lineHeight: 120, includeFontPadding: false }}
              >
                {item.icon}
              </Text>
            )}
          </View>
          <Text className="text-center mt-2">
            {item === "CREATE" ? "Create Challenge" : item.title}
          </Text>
        </View>
      </Link>
    </View>
  );
};

export default function Index() {
  const { data: challengeData } = useChallenges();

  return (
    <View className="flex-1 px-4 py-2 gap-5">
      <Text className="text-3xl font-bold">Your Challenges:</Text>
      <FlatList
        data={["CREATE", ...(challengeData?.reverse() || [])]}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ gap: 20 }}
        renderItem={Item}
        keyExtractor={(item) => (item === "CREATE" ? "CREATE" : item.id)}
      />
    </View>
  );
}
