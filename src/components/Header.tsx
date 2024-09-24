import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { musicData } from "../datas/music";
import { RiMusic2Line } from "react-icons/ri";
import theme from "../util/theme";

const Header = () => {
  const dayOfWeek = new Date().getDay();
  const recommendedSong = musicData[dayOfWeek % musicData.length];

  return (
    <Box
      p="10px"
      bg="white"
      borderBottom="1px solid black"
      height="70px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex justifyContent="center" flex="1">
        <Link to="/">
          <Image
            src="/image/nfimap.png"
            alt="MyApp Logo"
            boxSize="50px"
            transition="transform 0.5s ease"
            _hover={{
              transform: "rotate(360deg)",
            }}
          />
        </Link>
      </Flex>

      <Flex
        alignItems="center"
        position="absolute"
        top="20px"
        right="50px"
        gap="5px"
      >
        <RiMusic2Line color="#3b82f6" size="20px" />
        <Text fontSize="sm" fontWeight="bold">
          추천곡 :
        </Text>
        <Text
          fontSize="sm"
          fontWeight="bold"
          color={theme.colors.sub}
          animation="glow 2s infinite"
        >
          {recommendedSong.name}
        </Text>
      </Flex>

      <style>
        {`
          @keyframes glow {
            0% { text-shadow: 0 0 2px blue; }
            50% { text-shadow: 0 0 6px blue; }
            100% { text-shadow: 0 0 2px blue; }
          }
        `}
      </style>
    </Box>
  );
};

export default Header;
