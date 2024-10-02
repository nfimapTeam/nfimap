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
  Badge,
} from "@chakra-ui/react";
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon } from "lucide-react";

interface CustomModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

const CustomModal = ({ item, isOpen, onClose }: CustomModalProps) => {
  if (!item) return null;

  const getCategoryImage = (category: string): string => {
    switch (category.toLowerCase()) {
      case "카페":
        return "/image/cafe.svg";
      case "장소":
        return "/image/flag.svg";
      case "맛집":
        return "/image/restaurant.svg";
      default:
        return "/image/nfiload.png";
    }
  };

  const isNfiLoad = !("poster" in item);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="900px" boxShadow="xl">
        <ModalHeader borderBottom="1px" borderColor="gray.200" py={4} bg="gray.50">
          <Text fontSize="xl" fontWeight="bold" color="blue.600">
            {item.name}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="30px" bg="gray.50">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            gap={{ base: 6, md: 8 }}
          >{ !isNfiLoad &&   
            <Box
              width={{ base: "100%", md: "40%" }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                width="100%"
                height="0"
                paddingBottom="140%"
                position="relative"
                overflow="hidden"
                borderRadius="lg"
                boxShadow="md"
              >
                <Image
                  src={item.poster}
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
                <Button
                  bg="blue.500"
                  color="white"
                  width="100%"
                  mt={6}
                  display="block"
                  _hover={{ bg: "blue.600" }}
                  boxShadow="md"
                >
                  예매하기
                </Button>
              )}
            </Box>
            }
            <Box width={{ base: "100%", md: isNfiLoad ? "100%" : "60%" }} bg="white" p={6} borderRadius="lg" boxShadow="md">
              <VStack align="stretch" spacing={5}>
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={2}>
                    {item.name}
                  </Text>
                  <Badge colorScheme={isNfiLoad ? "green" : "purple"}>
                    {isNfiLoad ? item.category : "공연"}
                  </Badge>
                </Box>
                <Divider />
                <HStack spacing={4}>
                  <MapPinIcon size={20} color="#3182CE" />
                  <Text fontWeight="medium">{item.location}</Text>
                </HStack>
                {isNfiLoad ? (
                  <></>
                ) : (
                  <>
                    <HStack spacing={4}>
                      <CalendarIcon size={20} color="#3182CE" />
                      <Text fontWeight="medium">{item.date.join(" ~ ")}</Text>
                    </HStack>
                    <HStack spacing={4}>
                      <ClockIcon size={20} color="#3182CE" />
                      <Text fontWeight="medium">
                        {item.startTime} (총 {item.durationMinutes}분)
                      </Text>
                    </HStack>
                    <HStack spacing={4} alignItems="flex-start">
                      <UserIcon size={20} color="#3182CE" />
                      <Text fontWeight="medium">{item.artists.join(", ")}</Text>
                    </HStack>
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