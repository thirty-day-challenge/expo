import NewChallenge from "@/components/index/NewChallenge";
import ViewChallenge from "@/components/index/ViewChallenge";
import { useChallenges } from "@/lib/hooks/react-query/queries";
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { Animated, TouchableOpacity, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) {
  return (
    <View className="flex-row py-2">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ backgroundColor: isFocused ? "#f0f0f0" : "#fff" }}
            className="flex-1 py-3 rounded-md"
            key={index}
          >
            <Animated.Text>
              {typeof label === "function"
                ? label({ focused: isFocused, color: "#000", children: "" })
                : label}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { data: challengesData } = useChallenges();

  const tabs = (() => {
    let tabs: {
      name: string;
      component: ({ route }: { route: any }) => JSX.Element;
      params?: {
        id: string;
      };
    }[] = [];

    challengesData?.forEach((challenge) => {
      tabs.push({
        name: challenge.title,
        component: ViewChallenge,
        params: {
          id: challenge.id,
        },
      });
    });

    tabs.push({
      name: "Create",
      component: NewChallenge,
    });

    return tabs;
  })();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarItemStyle: { width: 100 },
        tabBarStyle: { backgroundColor: "powderblue" },
      }}
      tabBar={(props) => {
        return <MyTabBar {...props} />;
      }}
    >
      {tabs.map((tab) => {
        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            initialParams={tab.params}
            options={{
              tabBarLabel: tab.name,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}
