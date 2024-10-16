import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
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
      justifyContent="space-between"
      position="relative"
    >
      <Flex justifyContent="center" flex="1">
        <Link to="/">
          <Image
            src="/image/logo/logo.svg"
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
