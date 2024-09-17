import { Box, Flex, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiListUnordered, RiMapPinLine, RiUser3Line, RiMusicLine } from "@remixicon/react";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getLinkColor = (path: string) => {
    return location.pathname === path ? "#BD0006" : "black";
  };

  return (
    <Flex
      direction="column"
      px={4}
      py={2}
      bg="white"
      borderTop="1px solid black"
      position="fixed"
      bottom="0"
      width="100%"
      height="50px" 
      zIndex="2"
    >
      <Flex justify="space-between">
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          <RiListUnordered color={getLinkColor("/")} />
          <Text fontSize="lg" color={getLinkColor("/")}>
            리스트
          </Text>
        </Flex>
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/map")}
        >
          <RiMapPinLine color={getLinkColor("/map")} />
          <Text fontSize="lg" color={getLinkColor("/map")}>
            맵
          </Text>
        </Flex>
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/profile")}
        >
          <RiUser3Line color={getLinkColor("/profile")} />
          <Text fontSize="lg" color={getLinkColor("/profile")}>
            소개
          </Text>
        </Flex>
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          cursor="pointer"
          onClick={() => navigate("/music")}
        >
          <RiMusicLine color={getLinkColor("/music")} />
          <Text fontSize="lg" color={getLinkColor("/music")}>
            노래
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
