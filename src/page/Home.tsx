import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Link,
  Button,
  useBreakpointValue,
  Badge,
  Input,
  Select,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { concertsData } from "../datas/concerts";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const [currentTime, setCurrentTime] = useState(moment());
  const [searchQuery, setSearchQuery] = useState("");
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [sortOrder, setSortOrder] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateTimeRemaining = (openDate: string, openTime: string) => {
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

  const isEventTodayOrFuture = (dates: string[]) => {
    return dates.some((date) => {
      const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
      return concertDate.isSameOrAfter(currentTime, "day");
    });
  };

  const filteredConcerts = concertsData
    .filter((concert) => {
      const matchesSearch =
        concert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concert.location.toLowerCase().includes(searchQuery.toLowerCase());

      const isFutureOrToday = isEventTodayOrFuture(concert.date);

      if (showPastEvents) {
        return matchesSearch;
      } else {
        return matchesSearch && isFutureOrToday;
      }
    })
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "date") {
        return moment(b.date[0].split("(")[0], "YYYY-MM-DD").diff(
          moment(a.date[0].split("(")[0], "YYYY-MM-DD")
        );
      }
      return 0;
    });

  return (
    <Box p={4}>
      <Box mb={4}>
        <Input
          placeholder="공연명 또는 공연장을 검색하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={4}
        />

        <HStack width="100%" justifyContent="space-between">
          <Select
            width="200px"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="name">이름순</option>
            <option value="date">최신순</option>
          </Select>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="show-past-events" mb="0">
              지난 공연 보기
            </FormLabel>
            <Switch
              id="show-past-events"
              isChecked={showPastEvents}
              onChange={() => setShowPastEvents(!showPastEvents)}
            />
          </FormControl>
        </HStack>
      </Box>

      <SimpleGrid columns={columns} spacing={6}>
        {filteredConcerts.map((concert, index) => {
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
            <Box position="relative" key={index}>
              <HStack
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                bg="white"
                alignItems="flex-start"
                borderColor={isTodayEvent ? "blue.400" : "gray.200"}
                position="relative"
                zIndex={1}
                cursor="pointer"
                onClick={() => navigate(`/${concert.id}`)}
                _hover={{
                  boxShadow: "lg",
                  transform: "scale(1.02)",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Box>
                  <Box
                    w="150px"
                    h="200px"
                    overflow="hidden"
                    borderRadius="md"
                    flexShrink={0}
                  >
                    <Image
                      src={concert.poster}
                      alt={concert.name}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  </Box>
                  <Link href={concert.ticketLink} isExternal>
                    <Button
                      border="2px solid #eee"
                      bg="white"
                      width="100%"
                      marginTop="5px"
                      onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 방지
                    >
                      티켓 구매하기
                    </Button>
                  </Link>
                </Box>
                <VStack align="start" spacing={2}>
                  <Text fontSize="lg" fontWeight="bold">
                    {concert.name}
                  </Text>
                  <Text fontSize="md">{concert.location}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {concert.date.join(", ")} {concert.startTime}
                  </Text>
                  <Text fontSize="sm">{concert.type}</Text>

                  {timeRemaining ? (
                    <Badge colorScheme="green">
                      {timeRemaining.days}일 {timeRemaining.hours}시간{" "}
                      {timeRemaining.minutes}분 후 티켓 오픈
                    </Badge>
                  ) : isPastEvent ? null : (
                    <Badge colorScheme="red">티켓 오픈 완료</Badge>
                  )}
                </VStack>
              </HStack>

              {isPastEvent && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  bg="blackAlpha.600"
                  zIndex={2}
                  borderRadius="lg"
                />
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
