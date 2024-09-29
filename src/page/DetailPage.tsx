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
  Link,
  StackDivider,
} from "@chakra-ui/react";
import { concertsData } from "../datas/concerts";
import NotFound from "../components/NotFound";

const DetailPage = () => {
  // URL에서 id 파라미터를 가져옴
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFound title="No" content="정보가 없습니다." />;
  }

  const concert = concertsData.find((concert) => concert.id === parseInt(id));

  if (!concert) {
    return <NotFound title="No" content="정보가 없습니다." />;
  }

  return (
    <Box maxW="4xl" mx="auto" p={4}>
      
      <HStack spacing={6} align="flex-start">
        <Image
          src={concert.poster}
          alt={concert.name}
          boxSize="300px"
          borderRadius="md"
          fallbackSrc="/image/nfimap.png"
        />

        {/* 공연 정보 */}
        <VStack align="start" spacing={4}>
          <Badge colorScheme="red" fontSize="lg" p="4px 8px">
            {concert.type}
          </Badge>
          <Text fontSize="2xl" fontWeight="bold">
            {concert.name}
          </Text>
          <Box>
            <Text fontSize="md">
              <strong>장소:</strong> {concert.location}
            </Text>
            <Text fontSize="md">
              <strong>기간:</strong> {concert.date.join(" - ")}
            </Text>
            <Text fontSize="md">
              <strong>관람시간:</strong> {concert.durationMinutes}분
            </Text>
            <Text fontSize="md">
              <strong>공연시간:</strong> {concert.startTime}분
            </Text>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};

export default DetailPage;
