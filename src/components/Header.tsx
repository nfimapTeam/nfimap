import React from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Box 
      p="10px" 
      bg="white" 
      borderBottomRadius="15px" 
      borderBottom="1px solid black" 
      borderLeft="1px solid black" 
      borderRight="1px solid black"
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
