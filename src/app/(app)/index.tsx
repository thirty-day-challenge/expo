import Calendar from "@/components/Calendar";
import ChallengeInfo from "@/components/ChallengeInfo";
import SafeView from "@/components/SafeView";
import {
  useChallenges,
  useDailyProgress,
} from "@/lib/hooks/react-query/queries";
import { createCalendarDates } from "@/lib/util/dates";
import { DailyProgress } from "@30-day-challenge/prisma-zod";
import { ErrorBoundaryProps, Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
const tempstring =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, in temporibus numquam rem illum, distinctio vel nemo earum tempore eveniet perspiciatis quibusdam, provident sed officia. Ratione quae iure dolor, consectetur odit quos voluptatem sapiente tempore voluptatum neque praesentium? Odio ratione quaerat repellat a, eos consequuntur at facilis, soluta minima totam quia. Beatae optio nostrum necessitatibus ab veritatis facere sed vitae, excepturi eveniet quidem commodi ipsum voluptatem asperiores harum. Error voluptatum ducimus autem ab quae minus iusto perspiciatis, culpa tenetur? Libero sequi architecto unde quibusdam facilis tempora, vitae animi placeat, aliquid earum distinctio modi repellat aut accusamus voluptatem error, nostrum pariatur. Repellat quasi officia veritatis autem totam nesciunt voluptatum consectetur! Corrupti, cum aut. Ipsum quas officiis natus veritatis? Quos libero eos, at inventore voluptas vel sunt doloremque blanditiis quae. Incidunt vel dolorum ex ea officia ratione! Maxime molestias nisi eius aut voluptas, accusamus error maiores delectus reprehenderit possimus suscipit, beatae ut enim impedit cum? Magnam perspiciatis aliquam mollitia ipsam suscipit non repellendus nam sed. Illum vero fugit aspernatur deserunt expedita itaque error exercitationem ea iure! Assumenda asperiores doloremque corrupti, eaque itaque aliquam perferendis! A at quos illum dolorum laborum repudiandae nihil quasi reprehenderit, enim magnam ipsam, similique error libero dignissimos dolore nostrum voluptatum quam? Ea deserunt fugit quibusdam soluta magni tenetur, maiores delectus. Fugiat quisquam obcaecati deserunt, culpa, eum reprehenderit officiis itaque dignissimos similique ex natus cumque totam qui? Asperiores, sint unde maiores tenetur expedita placeat in, ipsa nihil hic suscipit aut repellat quidem. Ad, explicabo! Veritatis, fugit! Excepturi error exercitationem, assumenda temporibus, ducimus quasi natus cumque esse, corporis vel accusantium! Dicta, atque, asperiores natus, exercitationem minima modi illum labore doloremque eos soluta expedita. Nesciunt, iure, ullam maxime pariatur a doloribus voluptatem nam nemo vitae dolor adipisci commodi molestiae doloremque, sequi libero soluta reprehenderit sunt repellat aliquid eius animi neque blanditiis natus. Nemo, debitis adipisci. Praesentium magni, veritatis molestias quaerat alias omnis, quas nihil dolore officiis repudiandae, molestiae dignissimos dolorem ipsum quia nulla? Deserunt odit vitae ducimus facilis? Laborum consequatur voluptatum magni iusto cum, vel, voluptates at, odio harum minima voluptatibus corporis quasi velit enim molestiae! Vel veritatis quo ut facere illo impedit dolores pariatur eius exercitationem earum totam adipisci nobis laudantium, sed, consectetur nemo repellendus corrupti? Beatae, blanditiis? Quibusdam eum quas eius, perspiciatis ut aperiam cumque ipsum inventore doloremque! Earum ad harum eius deserunt accusamus autem repellat, architecto dignissimos natus odit reprehenderit pariatur error tenetur ratione nesciunt, ab incidunt laudantium ipsum minus. Illum ducimus est, voluptate omnis tempora nobis. Unde magnam voluptates eos molestiae. Enim illum, corrupti mollitia et, eum culpa itaque ratione provident voluptatibus nesciunt eos iusto praesentium accusamus sit deleniti labore quae minus. Id sed velit exercitationem, neque, libero, ducimus voluptates odit dolorem obcaecati soluta aliquam fuga cupiditate eligendi earum! Porro totam ex explicabo deserunt sunt numquam molestiae veniam, pariatur odio ipsa ipsum quod repellat quae excepturi distinctio quos deleniti odit sequi assumenda perspiciatis quas possimus saepe corporis voluptates. Amet dolor expedita ratione veniam incidunt. Fugiat tempore accusamus sequi aliquam hic consequuntur, ab officiis architecto ipsa dolorum esse.";

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <SafeView
      top
      className="flex-1 flex justify-center items-center bg-red-600"
    >
      <Text>{props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </SafeView>
  );
}

export default function Page() {
  const {
    data: challengesData,
    error,
    isLoading: isChallengesLoading,
  } = useChallenges();
  const { isLoading: isDailyProgressDataLoading } = useDailyProgress();
  const { data: dailyProgressData } = useDailyProgress();

  if (isChallengesLoading || isDailyProgressDataLoading)
    return <Text>Challenges data is loading...</Text>;

  if (!challengesData || challengesData.length === 0)
    return <Redirect href={"/challenge-forms/create"} />;

  if (dailyProgressData == undefined) throw new Error();

  const challenge = challengesData![0];
  const gridData = createCalendarDates(challenge, dailyProgressData);

  return (
    <View className="flex-1" style={{ overflow: "scroll" }}>
      <View className="w-5/6 mx-auto gap-5">
        <ChallengeInfo challenge={challengesData[0]} gridData={gridData} />
        <Calendar gridData={gridData} />
      </View>
      <ScrollView className="w-full">
        <View className="w-5/6 mx-auto">
          <ImageList dailyProgressData={dailyProgressData} />
        </View>
      </ScrollView>
    </View>
  );
}

function ImageList({
  dailyProgressData,
}: {
  dailyProgressData: DailyProgress[];
}) {
  return (
    <View className="flex flex-col gap-5">
      <Text className="font-bold text-xl text-center">Progress Images</Text>
      <View className="gap-5 flex flex-col-reverse">
        {dailyProgressData.map((item, index) => (
          <ImageListItem key={index} url={item.imageUrl} date={item.date} />
        ))}
      </View>
    </View>
  );
}

function ImageListItem({ date, url }: { date: Date; url: string }) {
  if (!url) return null;
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    Image.getSize(url, (width, height) => {
      setAspectRatio(width / height);
    });
  }, [url]);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const imageContainerWidth = screenWidth * (5 / 6); // 5/6 of screen width
  const calculatedHeight = imageContainerWidth / aspectRatio;
  const maxHeight = screenHeight / 4; // Maximum height as 1/4 of the screen height

  // Clamp the image height to the maximum value
  const imageHeight = Math.min(calculatedHeight, maxHeight);

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-center text-md">{date.toLocaleDateString()}</Text>
      <Image
        source={{ uri: url }}
        style={{
          width: imageContainerWidth, // Keep the defined width
          height: imageHeight,
          alignSelf: "flex-start", // Ensure the image is aligned to the left
        }}
        resizeMode="contain"
      />
    </View>
  );
}
