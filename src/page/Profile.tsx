import React from "react";
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Grid,
  Stack,
  Link,
  Icon,
  Button,
} from "@chakra-ui/react";
import {
  RiTeamLine,
  RiHeart2Line,
  RiMusic2Line,
  RiLightbulbLine,
} from "@remixicon/react";
import { profileData } from "../datas/profile";

const Profile = () => {
  return (
    <Box height="calc(100vh - 120px)" overflowY="auto">
      <Box width="100%" maxWidth="1200px" mx="auto" p="4">
        <Box mb="8">
          <Image
            src={profileData.cover_image_url}
            alt={`${profileData.name} Cover`}
            w="100%"
            h={{ base: "300px", md: "700px" }}
            objectFit="cover"
            borderRadius="md"
            boxShadow="md"
          />
        </Box>

        {/* Group Information */}
        <Stack mb="8" align="center" spacing="4">
          <Heading as="h1" size="2xl">
            <Image src={"/image/nfLogo.png"} alt="NF Logo" />
          </Heading>

          <Flex gap="4" my="6" w="100%">
            {/* Debut Date */}
            <Flex
              flex="1"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
            >
              <Icon as={RiLightbulbLine} w="6" h="6" color="blue.500" mr="3" />
              <Box>
                <Text fontWeight="bold" fontSize="lg" color="blue.700">
                  데뷔
                </Text>
                <Text fontSize="lg" color="gray.600">
                  {profileData.debut_date}
                </Text>
              </Box>
            </Flex>

            {/* Debut Song */}
            <Flex
              flex="1"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
            >
              <Icon as={RiMusic2Line} w="6" h="6" color="green.500" mr="3" />
              <Box>
                <Text fontWeight="bold" fontSize="lg" color="green.700">
                  데뷔곡
                </Text>
                <Text fontSize="lg" color="gray.600">
                  {profileData.debut_song}
                </Text>
              </Box>
            </Flex>

            {/* Fandom */}
            <Flex
              flex="1"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
            >
              <Icon as={RiHeart2Line} w="6" h="6" color="red.500" mr="3" />
              <Box>
                <Text fontWeight="bold" fontSize="lg" color="red.700">
                  팬덤
                </Text>
                <Text fontSize="lg" color="gray.600">
                  {profileData.fandom_name}
                </Text>
              </Box>
            </Flex>

            {/* Light Stick */}
            <Flex
              flex="1"
              align="center"
              justifyContent="center"
              p="4"
              borderRadius="md"
              boxShadow="md"
              gap="4"
              border="2px solid #eee"
            >
              <Icon as={RiTeamLine} w="6" h="6" color="purple.500" mr="3" />
              <Box>
                <Text fontWeight="bold" fontSize="lg" color="purple.700">
                  응원봉
                </Text>
                <Text fontSize="lg" color="gray.600">
                  {profileData.light_stick}
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Stack>

        {/* Members */}
        <Heading as="h2" size="xl" mb="4">
          멤버
        </Heading>
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(5, 1fr)" }}
          gap="6"
        >
          {profileData.members.map((member) => (
            <Box
              key={member.name}
              textAlign="center"
              p="4"
              boxShadow="lg"
              borderRadius="md"
              bg="white"
              border="2px solid #eee"
            >
              <Image
                src={member.imageUrl}
                alt={member.name}
                borderRadius="md"
                boxSize="150px"
                mx="auto"
                objectFit="cover"
                boxShadow="md"
              />
              <Text fontWeight="bold" mt="4">
                {member.name}
              </Text>

              {/* Position Labels */}
              <Flex justifyContent="center" wrap="wrap" gap="2" mt="2">
                {member.position.map((pos, index) => (
                  <Box
                    key={index}
                    bg="teal.100"
                    color="teal.900"
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="sm"
                    boxShadow="md"
                  >
                    {pos}
                  </Box>
                ))}
              </Flex>

              {/* AKA Labels */}
              <Flex justifyContent="center" wrap="wrap" gap="2" mt="2">
                {member.aka.map((akaName, index) => (
                  <Box
                    key={index}
                    bg="blue.100"
                    color="blue.700"
                    px="2"
                    py="1"
                    borderRadius="md"
                    fontSize="sm"
                    boxShadow="md"
                  >
                    {akaName}
                  </Box>
                ))}
              </Flex>

              <Flex justifyContent="center" mt="2">
                <Box
                  bg="purple.100"
                  color="purple.700"
                  px="3"
                  py="1"
                  borderRadius="md"
                  fontSize="sm"
                  boxShadow="md"
                >
                  {member.birthdate}
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>

        <Heading as="h2" size="xl" mt="8" mb="4">
          SNS
        </Heading>
        <Flex justifyContent="center" gap="4" align="center">
          <Link href={profileData.official_sites.x} isExternal>
            <Image src="/image/x.png" w="40px" />
          </Link>

          <Link href={profileData.official_sites.facebook} isExternal>
            <Image
              borderRadius="4px"
              src="/image/facebook.jpg"
              w="40px"
            />
          </Link>

          <Link href={profileData.official_sites.instagram} isExternal>
            <Image
              borderRadius="4px"
              src="/image/instagram.jpg"
              w="40px"
            />
          </Link>

          <Link href={profileData.official_sites.youtube} isExternal>
            <Image
              borderRadius="4px"
              src="/image/youtube.png"
              w="40px"
            />
          </Link>

          <Link href={profileData.official_sites.daumcafe} isExternal>
            <Image src="/image/daumcafe.png" w="40px" />
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};

export default Profile;
