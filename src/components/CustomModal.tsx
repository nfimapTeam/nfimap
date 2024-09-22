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
  item: any; // Updated to accept either concert or nfiload
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal = ({ item, isOpen, onClose }: CustomModalProps) => {
  if (!item) return null;

  const getCategoryImage = (category: string): string => {
    switch (category.toLowerCase()) {
      case "카페":
        return "/image/cafe.png";
      case "장소":
        return "/image/location.png";
      case "맛집":
        return "/image/matzip.png";
      default:
        return "/image/nfiload.png";
    }
  };

  const isNfiLoad = !("poster" in item); // Check if the item is an Nfiload

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader borderBottom="1px" borderColor="gray.200" py={2}>
          <Text fontSize="lg" fontWeight="bold">
            {item.name}
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
                  src={isNfiLoad ? getCategoryImage(item.category) : item.poster} // Use category image for Nfiload
                  alt={item.name}
                  objectFit="cover"
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                />
              </Box>
              {!isNfiLoad && (
                <Button colorScheme="red" width="100%" mt={4} display="block">
                  예매하기
                </Button>
              )}
            </Box>
            <Box width={{ base: "100%", md: "60%" }} p={4}>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" width="30%">
                    장소
                  </Text>
                  <Text width="70%">{item.location}</Text>
                </HStack>
                <Divider />
                {isNfiLoad ? (
                  <>
                    <HStack justify="space-between">
                      <Text fontWeight="bold" width="30%">
                        카테고리
                      </Text>
                      <Text width="70%">{item.category}</Text>
                    </HStack>
                    <Divider />
                  </>
                ) : (
                  <>
                    <HStack justify="space-between">
                      <Text fontWeight="bold" width="30%">
                        공연기간
                      </Text>
                      <Text width="70%">{item.date.join(" ~ ")}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontWeight="bold" width="30%">
                        공연시간
                      </Text>
                      <Text width="70%">{item.durationMinutes}분</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontWeight="bold" width="30%">
                        시작시간
                      </Text>
                      <Text width="70%">{item.startTime}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontWeight="bold" width="30%">
                        아티스트
                      </Text>
                      <Text width="70%">{item.artists.join(", ")}</Text>
                    </HStack>
                    <Divider />
                  </>
                )}
              </VStack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
