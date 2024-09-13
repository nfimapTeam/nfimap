import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Input,
  Flex,
  Switch,
  Image,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import CustomModal from "./CustomModal";

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
};

type SidebarProps = {
  concerts: Concert[];
  onConcertSelect: (concert: Concert) => void;
};

const Sidebar = ({ concerts, onConcertSelect }: SidebarProps) => {
  const [query, setQuery] = useState<string>("");
  const [filteredConcerts, setFilteredConcerts] = useState<Concert[]>(concerts);
  const [toggle, setToggle] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConcert, setSelectedConcert] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleToggleChange = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const handleOpenModal = (concert: Concert) => {
    onOpen();
    setSelectedConcert(concert);
  };

  useEffect(() => {
    const currentDate = new Date();

    const toggleFiltered = toggle
      ? concerts
      : concerts.filter((concert) =>
          concert.date.some((date) => {
            const concertDate = new Date(date.split("(")[0]);
            return (
              concertDate >= currentDate ||
              (concertDate.getDate() === currentDate.getDate() &&
                concertDate.getMonth() === currentDate.getMonth() &&
                concertDate.getFullYear() === currentDate.getFullYear())
            );
          })
        );

    const searchFiltered = toggleFiltered.filter((concert) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        concert.location.toLowerCase().includes(lowerCaseQuery) ||
        concert.name.toLowerCase().includes(lowerCaseQuery)
      );
    });

    setFilteredConcerts(searchFiltered);
  }, [toggle, query, concerts]);

  return (
    <Box
      w="340px"
      bg="#fff"
      p="20px"
      overflowY="auto"
      h="calc(100vh - 120px)"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      borderRight="1px solid #ddd"
    >
      <Text fontSize="24px" fontWeight="bold" mb="20px" textAlign="left">
        공연 정보
      </Text>
      <VStack spacing={4} mb="20px">
        <Input
          ref={searchInputRef}
          placeholder="이름이나 장소로 검색하세요."
          value={query}
          onChange={handleInputChange}
          size="md"
        />
        <Flex justify="flex-end" align="center">
          <Text fontSize="10px">지난 공연 포함</Text>
          <Switch
            id="toggle"
            isChecked={toggle}
            onChange={handleToggleChange}
            ml="10px"
          />
        </Flex>
      </VStack>
      <VStack spacing={4} align="start">
        {filteredConcerts.map((concert, index) => (
          <Flex
            key={index}
            onClick={() => handleOpenModal(concert)}
            cursor="pointer"
            p="10px"
            border="1px solid #eee"
            borderRadius="4px"
            w="100%"
            _hover={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
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
        ))}
      </VStack>
      <CustomModal
        concert={selectedConcert}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};

export default Sidebar;
