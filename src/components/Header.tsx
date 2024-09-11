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
    >
      <Flex justifyContent="center" alignItems="center">
        <Link to="/">
          <Image 
            src="/image/nfimap.png" 
            alt="MyApp Logo" 
            boxSize="50px" 
            transition="transform 0.5s ease"
            _hover={{ 
              transform: "rotate(360deg)"
            }}
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Header;
