import React from 'react';
import { Box, Image, Text, VStack } from "@chakra-ui/react";

const NoData = () => {
  return (
    <VStack spacing={4} align="center" justify="center" height="100%">
      <Box position="relative" width="200px" height="200px">
        <Image
          src="/image/logo/logo.svg"
          alt="No Data"
          width="100%"
          height="100%"
          opacity={0.3}
          objectFit="contain"
        />
      </Box>
      <Text fontSize="lg" fontWeight="medium" color="gray.500">
        데이터가 없습니다.
      </Text>
    </VStack>
  );
};

export default NoData;