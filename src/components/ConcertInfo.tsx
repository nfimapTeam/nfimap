import React, { useEffect, useRef } from "react";
import {
  Box,
  Input,
  Flex,
  Switch,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

type Concert = {
  name: string;
  location: string;
  type: string;
  durationMinutes: number;
  date: string[];
  startTime: string;
  artists: string[];
  ticketLink: string;
  poster: string;
  lat: string;
  lng: string;
  ticketOpen?: any;
};

type ConcertInfoProps = {
  concerts: Concert[];
  query: string;
  setQuery: (query: string) => void;
  showPastConcerts: boolean;
  setShowPastConcerts: (show: boolean) => void;
  setSelectedConcert: (concert: Concert) => void;
};

const ConcertInfo = ({
  concerts,
  query,
  setQuery,
  showPastConcerts,
  setShowPastConcerts,
  setSelectedConcert,
}: ConcertInfoProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleOpenModal = (concert: Concert) => {
    setSelectedConcert(concert);
  };

  const isConcertPast = (concert: Concert) => {
    const currentDate = new Date();
    return concert.date.every((dateString) => {
      // 날짜 문자열에서 "(요일)" 부분을 제거
      const datePart = dateString.split("(")[0];
      const concertDate = new Date(datePart);
      // 시간을 00:00:00으로 설정하여 날짜만 비교
      concertDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      return concertDate < currentDate;
    });
  };

  useEffect(() => {
    console.log(concerts)
  }, [concerts])

  return (
    <VStack spacing={4} align="start">
      <Input
        ref={searchInputRef}
        placeholder="이름이나 장소로 검색하세요."
        value={query}
        onChange={handleInputChange}
        size="md"
      />
      <Flex width="100%" align="center" justifyContent="flex-end">
        <Text fontSize="10px">지난 공연 포함</Text>
        <Switch
          id="toggle"
          isChecked={showPastConcerts}
          onChange={() => setShowPastConcerts(!showPastConcerts)}
          ml="10px"
        />
      </Flex>
      {concerts.map((concert, index) => {
        const past = isConcertPast(concert);

        return (
          <Flex
            key={index}
            onClick={() => handleOpenModal(concert)}
            cursor="pointer"
            p="10px"
            border="1px solid #eee"
            borderRadius="4px"
            w="100%"
            _hover={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
            position="relative"
            bg={past ? "rgba(0, 0, 0, 0.35)" : "#fff"}
          >
            <Box
              width="70px"
              height="70px"
              minWidth="70px"
              minHeight="70px"
              mr="15px"
              position="relative"
              overflow="hidden"
              borderRadius="4px"
            >
              <Image
                src={concert.poster}
                alt={concert.name}
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                objectFit="cover"
              />
              {past && (
                <Text
                  position="absolute"
                  fontSize="12px"
                  fontWeight="bold"
                  color="#fff"
                  bg="rgba(0, 0, 0, 0.7)"
                  borderRadius="4px"
                  p="4px 12px"
                  textAlign="center"
                  left="50%"
                  top="50%"
                  transform="translate(-50%, -50%)"
                  w="100%"
                >
                  공연종료
                </Text>
              )}
            </Box>
            <Box flexGrow={1}>
              <Text fontSize="16px" fontWeight="bold" mb="5px">
                {concert.name}
              </Text>
              <Text fontSize="14px" color="#666">
                {concert.location}
              </Text>
            </Box>
          </Flex>
        );
      })}
    </VStack>
  );
};

export default ConcertInfo;
