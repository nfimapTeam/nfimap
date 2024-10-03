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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { concertsData } from "../datas/concerts";
import { globalConcerts } from "../datas/globalConcerts";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toggleState } from "../atom/toggleState";
import Card from "../components/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RiCalendar2Line } from "@remixicon/react";
import theme from "../util/theme";
import "../style/custom.css";
import { Helmet } from "react-helmet-async";

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

const Home = () => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentTime, setCurrentTime] = useState(moment());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [toggle, setToggle] = useRecoilState(toggleState);
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allConcerts, setAllConcerts] = useState<Concert[]>([]);

  const handleDateChange = (date: any) => {
    if (Array.isArray(date)) {
      setSelectedDate(date[0] as Date); // 배열일 경우 첫 번째 날짜 선택 (Date 타입으로 변환)
    } else if (date instanceof Date) {
      setSelectedDate(date); // 단일 날짜 처리
    } else {
      setSelectedDate(null); // null 처리
    }
    onClose(); // 날짜 선택 후 모달 닫기
  };

  useEffect(() => {
    const combinedConcerts = [...concertsData, ...globalConcerts];
    setAllConcerts(combinedConcerts);
  }, [concertsData, globalConcerts]);

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

    const sortFunction = (a: Concert, b: Concert) => {
      if (sortOrder === "최신순") {
        const dateA = moment(a.date[0].split("(")[0], "YYYY-MM-DD");
        const dateB = moment(b.date[0].split("(")[0], "YYYY-MM-DD");
        return dateA.diff(dateB); // 오름차순 정렬 (미래 날짜가 뒤로)
      } else if (sortOrder === "이름순") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    };

    upcomingConcerts.sort(sortFunction);
    pastConcerts.sort((a, b) => {
      if (sortOrder === "최신순") {
        const dateA = moment(a.date[0].split("(")[0], "YYYY-MM-DD");
        const dateB = moment(b.date[0].split("(")[0], "YYYY-MM-DD");
        return dateB.diff(dateA); // 내림차순 정렬 (과거 날짜가 앞으로)
      }
      return sortFunction(a, b); // 이름순은 동일하게 처리
    });

    return [...upcomingConcerts, ...pastConcerts];
  };

  const filteredAndSortedConcerts = sortConcerts(
    allConcerts.filter((concert) => {
      const matchesSearch =
        concert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concert.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "" || concert.type === selectedType;

      if (toggle) {
        // 토글이 true면 지난 공연만 필터링
        const isPastEvent = concert.date.every((date) => {
          const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
          return concertDate.isBefore(currentTime, "day");
        });
        return matchesSearch && isPastEvent && matchesType;
      } else {
        // 토글이 false면 공연 예정만 필터링
        const isFutureOrToday = concert.date.some((date) => {
          const concertDate = moment(date.split("(")[0], "YYYY-MM-DD");
          return concertDate.isSameOrAfter(currentTime, "day");
        });
        return matchesSearch && isFutureOrToday && matchesType;
      }
    })
  );

  return (
    <Box
      h="calc(100vh - 120px)"
      width="100%"
      maxWidth="1200px"
      mx="auto"
      p="16px 16px 100px 16px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Helmet>
        <title>N.Fimap - 엔플라잉 콘서트 정보를 확인하세요!</title>
        <meta name="description" content="N.Fimap은 팬덤 N.Fia의 덕질을 응원합니다." />
        <meta property="og:image" content="https://nfimap.co.kr/image/nfimap.png" />
        <meta property="og:url" content="https://nfimap.co.kr" />
      </Helmet>
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

        <Flex width="100%" justifyContent="space-between" gap={4}>
          <Select
            value={selectedType}
            onChange={(value) => setSelectedType(value)}
            style={{ width: 200, height: 40 }}
            dropdownStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#4BA4F2",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            placeholder="콘서트 타입 선택"
          >
            <Option value="">전체</Option>
            <Option value="콘서트">콘서트</Option>
            <Option value="페스티벌">페스티벌</Option>
            <Option value="행사">행사</Option>
          </Select>
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

          {/* <Button
            onClick={onOpen}
            colorScheme={theme.colors.sub2}
          >
            <RiCalendar2Line />
          </Button> */}

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>날짜 선택</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Calendar onChange={handleDateChange} value={selectedDate} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>
      <SimpleGrid columns={columns} spacing={6}>
        {filteredAndSortedConcerts.map((concert, index) => {
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

export default Home;
