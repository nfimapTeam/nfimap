import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Box
      p="10px"
      bg="white"
      borderBottom="1px solid black"
      height="70px"
      display="flex"
      alignItems="center"
    >
      <Flex
        alignItems="center"
        ml="auto"
        mr="auto"
        gap="10px"
      >
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
    </Box>
  );
};

export default Header;
