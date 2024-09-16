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
  Flex,
  Input,
} from "@chakra-ui/react";
import { concertsData } from "../datas/concerts";
import NotFound from "../components/NotFound";

const DetailPage = () => {
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
        />

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

      <Flex border="1px solid black" justifyContent="center" alignItems="center" gap="16px" h="150px">
        <Box border="1px solid red"><Text>안뇽</Text></Box>
        <Box border="1px solid red"><Text>안뇽</Text></Box>
        <Box border="1px solid red"><Text>안뇽</Text></Box>
        <Box border="1px solid red"><Text>안뇽</Text></Box>
      </Flex>
      <Input value="ff" />
      <Button p="8px 8x">ddd</Button>
    </Box>
  );
};

export default DetailPage;
