import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  InputGroup,
  InputRightElement,
  Icon,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Link,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { concertsData } from "../datas/concerts";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toggleState } from "../atom/toggleState";
import Card from "../components/Card";

const Home = () => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const [currentTime, setCurrentTime] = useState(moment());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card"); // View mode 관리
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [sortOrder, setSortOrder] = useState("최신순");
  const [toggle, setToggle] = useRecoilState(toggleState);
  const navigate = useNavigate();

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (toggle) {
      setSortOrder("최신순");
    }
  }, [toggle]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const getButtonText = (
    concert: Concert,
    isPastEvent: boolean,
    timeRemaining: { days: number; hours: number; minutes: number } | null
  ) => {
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
  ) => {
    e.stopPropagation();
    if (isPastEvent) {
      navigate(`/${concert.id}`);
    }
  };

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

  const sortConcerts = (concerts: Concert[]) => {
    const now = moment();
    const upcomingConcerts = concerts.filter((concert) =>
      concert.date.some((date) =>
        moment(date.split("(")[0], "YYYY-MM-DD").isSameOrAfter(now, "day")
      )
    );
    const pastConcerts = concerts.filter((concert) =>
      concert.date.every((date) =>
        moment(date.split("(")[0], "YYYY-MM-DD").isBefore(now, "day")
      )
    );

    upcomingConcerts.sort((a, b) => {
      const dateA = moment(a.date[0].split("(")[0], "YYYY-MM-DD");
      const dateB = moment(b.date[0].split("(")[0], "YYYY-MM-DD");
      return dateA.diff(dateB);
    });

    pastConcerts.sort((a, b) => {
      const dateA = moment(a.date[0].split("(")[0], "YYYY-MM-DD");
      const dateB = moment(b.date[0].split("(")[0], "YYYY-MM-DD");
      return dateB.diff(dateA);
    });

    return [...upcomingConcerts, ...pastConcerts];
  };

  const filteredConcerts = concertsData.filter((concert) => {
    const matchesSearch =
      concert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concert.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (toggle) {
      // 토글이 true면 지난 공연만 필터링
      const isPastEvent = concert.date.every((date) => {
        const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
        return concertDate.isBefore(currentTime, "day");
      });
      return matchesSearch && isPastEvent;
    } else {
      // 토글이 false면 공연 예정만 필터링
      const isFutureOrToday = concert.date.some((date) => {
        const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
        return concertDate.isSameOrAfter(currentTime, "day");
      });
      return matchesSearch && isFutureOrToday;
    }
  });

  return (
    <Box
      h="calc(100vh - 120px)"
      width="100%"
      maxWidth="1200px"
      mx="auto"
      p="16px 16px 150px 16px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      {/* 검색 및 정렬 섹션 */}
      <Box mb={4}>
        <InputGroup size="lg">
          <Input
            placeholder="공연명 또는 공연장을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mb={4}
            focusBorderColor="#4BA4F2"
            bg="whiteAlpha.900"
            _hover={{ borderColor: "#79AEF2" }}
            _placeholder={{ color: "gray.400" }}
            size="lg"
            borderRadius="md"
            boxShadow="md"
          />
          <InputRightElement width="4.5rem">
            {searchQuery ? (
              <Icon
                as={CloseIcon}
                color="gray.500"
                cursor="pointer"
                onClick={clearSearch}
                boxSize="12px"
              />
            ) : (
              <Icon as={SearchIcon} color="gray.500" cursor="pointer" />
            )}
          </InputRightElement>
        </InputGroup>

        <Flex width="100%" justifyContent="space-between" gap={8} mt={4}>
          <Select
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
            style={{ width: 200, height: 40 }}
            dropdownStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#4BA4F2",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            optionLabelProp="label"
            onSelect={(value) => setSortOrder(value)}
          >
            <Option value="최신순">최신순</Option>
            <Option value="이름순">이름순</Option>
          </Select>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="show-past-events" mb="0">
              지난 공연 보기
            </FormLabel>
            <Switch
              id="show-past-events"
              isChecked={toggle}
              onChange={() => setToggle(!toggle)}
            />
          </FormControl>

          {/* View mode 선택 버튼 */}
          <Flex gap={2}>
            <Button
              onClick={() => setViewMode("card")}
              bg={viewMode === "card" ? "blue.500" : "gray.200"}
              color="white"
              _hover={{ bg: "blue.400" }}
            >
              카드형
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              bg={viewMode === "list" ? "blue.500" : "gray.200"}
              color="white"
              _hover={{ bg: "blue.400" }}
            >
              리스트형
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* 카드형 / 리스트형 레이아웃 분기 처리 */}
      {viewMode === "card" ? (
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
      ) : (
        <VStack spacing={4} align="stretch">
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
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                bg="white"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
              >
                <HStack alignItems="flex-start" spacing={4}>
                  <Box
                    w="100px"
                    h="130px"
                    overflow="hidden"
                    borderRadius="md"
                    flexShrink={0}
                    filter={isPastEvent ? "grayscale(100%)" : "none"}
                    opacity={isPastEvent ? 0.9 : 1}
                    transition="all 0.3s ease"
                  >
                    <Image
                      src={concert.poster}
                      alt={concert.name}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                    />
                  </Box>
                  <VStack align="start" spacing={2} flex="1">
                    <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
                      {concert.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500" noOfLines={1}>
                      {concert.location}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {concert.date.join(", ")}
                    </Text>

                    <HStack spacing={2}>
                      <Badge
                        colorScheme={isPastEvent ? "gray" : "green"}
                        p="4px 8px"
                        borderRadius="md"
                      >
                        {isPastEvent ? "공연 종료" : "공연 예정"}
                      </Badge>
                      <Badge colorScheme="blue">{concert.type}</Badge>
                    </HStack>

                    <Link href={concert.ticketLink} isExternal>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={(e) =>
                          handleButtonClick(e, concert, isPastEvent)
                        }
                      >
                        {getButtonText(concert, isPastEvent, timeRemaining)}
                      </Button>
                    </Link>
                  </VStack>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default Home;
