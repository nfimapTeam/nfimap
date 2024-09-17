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
  Switch,
  FormControl,
  FormLabel,
  Flex,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { keyframes } from "@chakra-ui/react";
import { Select } from 'antd';
import { Option } from "antd/es/mentions";
import { concertsData } from "../datas/concerts";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toggleState } from "../atom/toggleState";

const borderGlow = keyframes`
  0% {
    border-color: rgba(121, 174, 242, 0.5);
    box-shadow: 0 0 8px rgba(121, 174, 242, 0.5);
  }
  50% {
    border-color: rgba(121, 174, 242, 0.7);
    box-shadow: 0 0 12px rgba(121, 174, 242, 0.7);
  }
  100% {
    border-color: rgba(121, 174, 242, 0.5);
    box-shadow: 0 0 8px rgba(121, 174, 242, 0.5);
  }
`;

const Home = () => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const [currentTime, setCurrentTime] = useState(moment());
  const [searchQuery, setSearchQuery] = useState("");
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [sortOrder, setSortOrder] = useState("최신순");
  const [toggle, setToggle] = useRecoilState(toggleState);
  const navigate = useNavigate();

  interface Concert {
    id: number;
    name: string;
    location: string;
    type: string; // 콘서트 | 페스티벌
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
    if(toggle) {
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
    if(isPastEvent) {
      return "공연 정보";
    } else if(concert.ticketOpen.date === "0000-00-00") {
      return "예매 일정 대기 중";
    } else if(concert.ticketLink === "") {
      return timeRemaining
        ? `${timeRemaining.days}일 ${timeRemaining.hours}시간 ${timeRemaining.minutes}분 후`
          : "예매 정보 대기 중"
    } else {
      return "예매 사이트 이동";
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>, 
    concert: Concert, 
    isPastEvent: boolean
  ) => {
    e.stopPropagation();
    if(isPastEvent) {
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

  const filteredConcerts = concertsData
    .filter((concert) => {
      const matchesSearch =
        concert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concert.location.toLowerCase().includes(searchQuery.toLowerCase());

      const isFutureOrToday = isEventTodayOrFuture(concert.date);

      if (toggle) {
        return matchesSearch;
      } else {
        return matchesSearch && isFutureOrToday;
      }
    })
    .sort((a, b) => {
      if (sortOrder === "이름순") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "최신순") {
        return moment(b.date[0].split("(")[0], "YYYY-MM-DD").diff(
          moment(a.date[0].split("(")[0], "YYYY-MM-DD")
        );
      }
      return 0;
    });

  return (
    <Box h="calc(100vh - 120px)" p="16px 16px 50px 16px" overflow="auto">
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
              <Icon
                as={SearchIcon}
                color="gray.500"
                cursor="pointer"
              />
            )}
          </InputRightElement>
        </InputGroup>

        <Flex width="100%" justifyContent="space-between" gap={4} mt={4}>
        <Select
          value={sortOrder}
          onChange={(value) => setSortOrder(value)}
          style={{ width: 200, height: 40 }}
          dropdownStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#4BA4F2',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          optionLabelProp="label"
          onSelect={(value) => setSortOrder(value)}
        >
          <Option value="최신순">최신순</Option>
          <Option value="이름순">이름순</Option>
        </Select>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="show-past-events" mb="0">
              지난 공연 포함
            </FormLabel>
            <Switch
              id="show-past-events"
              isChecked={toggle}
              onChange={() => setToggle(!toggle)}
            />
          </FormControl>
        </Flex>
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
                animation={isTodayEvent ? `${borderGlow} 1.5s ease-in-out infinite` : "none"}

                position="relative"
                zIndex={1}
                cursor="pointer"
                // onClick={() => navigate(`/${concert.id}`)} // 클릭 시 해당 공연의 디테일
                // _hover={{
                //   boxShadow: "lg",
                //   transform: "scale(1.02)",
                //   transition: "all 0.2s ease-in-out",
                // }}
              >
                <Box>
                  <Box
                    w="150px"
                    h="200px"
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
                  <Link href={concert.ticketLink} isExternal>
                    <Button
                      border="2px solid #eee"
                      bg="white"
                      width="100%"
                      marginTop="5px"
                      fontSize="13px"
                      onClick={(e) => handleButtonClick(e, concert, isPastEvent)}
                      isDisabled={concert.ticketLink === ""}
                    >
                      {getButtonText(concert, isPastEvent, timeRemaining)}
                    </Button>
                  </Link>
                </Box>
                <VStack align="start" spacing={2} >
                  {isPastEvent ? (
                    <Badge colorScheme="gray">공연 종료</Badge>
                  ) : (
                    <Badge colorScheme="green">공연 예정</Badge>
                  )}
                  
                  <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
                    {concert.name}
                  </Text>
                  <Text fontSize="md" noOfLines={1}>
                    {concert.location}
                  </Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {concert.date.join(", ")} 
                  </Text>

                  <HStack spacing={2}>
                    {concert.type === "콘서트" ? (
                      <Badge bg="pink.100" color="pink.600">
                        콘서트
                      </Badge>
                    ) : concert.type === '페스티벌' ? (
                      <Badge bg="blue.100" color="blue.600">
                        페스티벌
                      </Badge>
                    ) : null}

                    {concert.performanceType === "단독" ? (
                      <Badge bg="purple.100" color="purple.600">
                        단독
                      </Badge>
                    ) : concert.performanceType === "합동" ? (
                      <Badge bg="teal.100" color="teal.600"> 
                        합동
                      </Badge>
                    ) : concert.performanceType === "출연" ? (
                      <Badge bg="orange.100" color="orange.600">
                        출연
                      </Badge>
                    ) : null}
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Home;