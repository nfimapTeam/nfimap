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
          <Flex>
            <Box width="40%" p={4}>
              <Image
                src={concert.poster}
                alt={concert.name}
                borderRadius="md"
              />
              <Button
                colorScheme="red"
                width="70%"
                mt={4}
                display="block"
                mx="auto"
              >
                예매하기
              </Button>
            </Box>
            <Box width="60%" p={4}>
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
                  <Text width="70%">
                    {concert.artists.join(", ")}
                  </Text>
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
