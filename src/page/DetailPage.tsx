import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Image,
  Button,
  Badge,
  VStack,
  HStack,
  Flex,
  Link,
  Icon,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  CalendarIcon,
  TimerIcon,
  MapPinIcon,
} from "lucide-react";
import { concertsData } from "../datas/concerts";
import NotFound from "../components/NotFound";
import Card from "../components/Card";
import moment from "moment";
import { globalConcerts } from "../datas/globalConcerts";

interface Concert {
  id: number;
  name: string;
  location: string;
  type: string; // 콘서트 | 페스티벌 | 행사
  performanceType: string; // 단독 | 합동 | 출연
  durationMinutes: number;
  date: string[];
  startTime: string;
  artists: string[];
  ticketLink: string;
  poster: string;
  lat: string;
  lng: string;
  ticketOpen: {
    date: string;
    time: string;
  };
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cardBgColor = useColorModeValue("white", "gray.800");
  const currentTime = moment();
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);

  useEffect(() => {
    const combinedConcerts = [...concertsData, ...globalConcerts];
    setAllConcerts(combinedConcerts);
  }, []);

  if (!id) {
    return <NotFound content="정보가 없습니다." />;
  }

  const concert = allConcerts.find((concert) => concert.id === parseInt(id));

  if (!concert) {
    return <NotFound content="정보가 없습니다." />;
  }

  const isEventTodayOrFuture = (dates: string[]): boolean => {
    return dates.some((date) => {
      const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
      return concertDate.isSameOrAfter(currentTime, "day");
    });
  };

  const calculateTimeRemaining = (openDate: string, openTime: string): TimeRemaining | null => {
    const ticketOpenMoment = moment(
      `${openDate} ${openTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const diffDuration = moment.duration(ticketOpenMoment.diff(currentTime));
    const days = Math.floor(diffDuration.asDays());
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();

    if (days < 0 || hours < 0) {
      return null;
    }

    return { days, hours, minutes };
  };

  const getButtonText = (
    concert: Concert,
    isPastEvent: boolean,
    timeRemaining: TimeRemaining | null
  ): string => {
    if (isPastEvent || concert.type === "행사") {
      return "공연 정보";
    } else if (concert.ticketOpen.date === "0000-00-00") {
      return "예매 일정 대기 중";
    } else if (concert.ticketLink === "") {
      return timeRemaining
        ? `${timeRemaining.days}일 ${timeRemaining.hours}시간 ${timeRemaining.minutes}분 후`
        : "예매 정보 대기 중";
    } else {
      return "티켓 예매";
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    concert: Concert,
    isPastEvent: boolean
  ): void => {
    e.stopPropagation();
    if (isPastEvent) {
      navigate(`/${concert.id}`);
    }
  };

  // Helper function to shuffle the array
  const shuffleArray = (array: Concert[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Filter upcoming concerts
  const upcomingConcerts = allConcerts.filter(
    (c) => isEventTodayOrFuture(c.date) && c.id !== parseInt(id)
  );

  // Shuffle and take the first 3 concerts
  const randomUpcomingConcerts = shuffleArray(upcomingConcerts).slice(0, 3);

  return (
    <Box height="calc(100vh - 120px)" overflowY="auto" p={4}>
      <Flex direction={{ base: "column", md: "row" }} gap={8} align="stretch">
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Box maxW={{ base: "100%", md: "400px" }} w="100%">
            <Image
              src={concert.poster}
              alt={concert.name}
              w="100%"
              h="auto"
              p={4}
              maxH={{ base: "400px", md: "600px" }}
              objectFit="contain"
              borderRadius="lg"
              fallbackSrc="/image/nfimap.png"
            />
          </Box>
        </Flex>

        <VStack align="stretch" spacing={6} flex={1}>
          <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
            <Badge colorScheme="red" fontSize="md" mb={2}>
              {concert.type}
            </Badge>
            <Text fontSize="3xl" fontWeight="bold" mb={4}>
              {concert.name}
            </Text>

            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={MapPinIcon} color="gray.500" />
                <Text fontSize="lg">{concert.location}</Text>
              </HStack>
              <HStack>
                <Icon as={CalendarIcon} color="gray.500" />
                <Text fontSize="lg">{concert.date.join(" - ")}</Text>
              </HStack>
              <HStack>
                <Icon as={TimerIcon} color="gray.500" />
                <Text fontSize="lg">
                  {concert.startTime} (약 {concert.durationMinutes}분)
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              출연 아티스트
            </Text>
            <Flex wrap="wrap" gap={2}>
              {concert.artists.map((artist, index) => (
                <Badge key={index} colorScheme="purple" fontSize="md">
                  {artist}
                </Badge>
              ))}
            </Flex>
          </Box>

          <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
            <Text fontSize="xl" fontWeight="semibold" mb={3}>
              티켓 정보
            </Text>
            <Text mb={2}>
              티켓 오픈: {concert.ticketOpen.date} {concert.ticketOpen.time}
            </Text>
            <Button
              as={Link}
              href={concert.ticketLink}
              isExternal
              colorScheme="blue"
            >
              티켓 예매하기
            </Button>
          </Box>
        </VStack>
      </Flex>

      <Text fontSize="2xl" fontWeight="bold" mt={8} mb={4}>
        추천 콘서트
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
        {randomUpcomingConcerts.map((concert, index) => {
          const isFutureOrToday = isEventTodayOrFuture(concert.date);
          const isPastEvent = !isFutureOrToday;
          const isTodayEvent = concert.date.some((date) => {
            const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
            return concertDate.isSame(currentTime, "day");
          });

          const timeRemaining = calculateTimeRemaining(
            concert.ticketOpen.date,
            concert.ticketOpen.time
          );

          return (
            <Card
              key={index}
              concert={concert}
              isTodayEvent={isTodayEvent}
              isPastEvent={isPastEvent}
              timeRemaining={timeRemaining}
              getButtonText={getButtonText}
              handleButtonClick={handleButtonClick}
            />
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default DetailPage;
