import React from "react";
import { useParams } from "react-router-dom";
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
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  CalendarIcon,
  TimerIcon,
  MapPinIcon,
} from "lucide-react";
import { concertsData } from "../datas/concerts";
import NotFound from "../components/NotFound";

const DetailPage = () => {
  const { id } = useParams();
  const cardBgColor = useColorModeValue("white", "gray.800");

  if (!id) {
    return <NotFound content="정보가 없습니다." />;
  }

  const concert = concertsData.find((concert) => concert.id === parseInt(id));

  if (!concert) {
    return <NotFound content="정보가 없습니다." />;
  }

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
    </Box>
  );
};

export default DetailPage;
