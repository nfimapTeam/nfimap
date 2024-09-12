import React from "react";
import {
  Box,
  Text,
  Button,
  Center,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  title: string;
  content: string;
}

const NotFound = ({ title, content }: NotFoundProps) => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Center h="calc(100vh - 120px)" bg="gray.50" p={4}>
      <Box
        textAlign="center"
        bg="white"
        borderRadius="md"
        p={8}
        shadow="lg"
        maxW="md"
        w="full"
      >
        <Text fontSize={isMobile ? "4xl" : "6xl"} fontWeight="bold" mb={4}>
          {title}
        </Text>
        <Image
          src="/image/nfimap.png"
          alt="MyApp Logo"
          boxSize="150px"
          transition="transform 0.5s ease"
          m={"20px auto"}
          _hover={{
            transform: "rotate(360deg)",
          }}
        />
        <Text fontSize="lg" mb={6} fontWeight="900">
          {content}
        </Text>
        <Button colorScheme="teal" onClick={handleGoHome}>
          엔피홈으로~
        </Button>
      </Box>
    </Center>
  );
};

export default NotFound;
