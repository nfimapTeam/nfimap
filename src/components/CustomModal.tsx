import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Flex,
  Box,
  VStack,
  HStack,
  Divider,
  Button,
} from "@chakra-ui/react";

interface CustomModalProps {
  concert: any;
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal = ({ concert, isOpen, onClose }: CustomModalProps) => {
  if (!concert) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader borderBottom="1px" borderColor="gray.200" py={2}>
          <Text fontSize="lg" fontWeight="bold">
            {concert.name}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="20px">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={{ base: 4, md: 0 }}
          >
            <Box
              width={{ base: "100%", md: "40%" }}
              p={4}
              mb={{ base: 4, md: 0 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                width="100%"
                height="0"
                paddingBottom="140%" // 5:7 aspect ratio
                position="relative"
                overflow="hidden"
              >
                <Image
                  src={concert.poster}
                  alt={concert.name}
                  objectFit="cover"
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                />
              </Box>
              <Button colorScheme="red" width="100%" mt={4} display="block">
                예매하기
              </Button>
            </Box>
            <Box width={{ base: "100%", md: "60%" }} p={4}>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" width="30%">
                    장소
                  </Text>
                  <Text width="70%">{concert.location}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text fontWeight="bold" width="30%">
                    공연기간
                  </Text>
                  <Text width="70%">{concert.date.join(" ~ ")}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text fontWeight="bold" width="30%">
                    공연시간
                  </Text>
                  <Text width="70%">{concert.durationMinutes}분</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text fontWeight="bold" width="30%">
                    시작시간
                  </Text>
                  <Text width="70%">{concert.startTime}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text fontWeight="bold" width="30%">
                    아티스트
                  </Text>
                  <Text width="70%">{concert.artists.join(", ")}</Text>
                </HStack>
                <Divider />
              </VStack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
