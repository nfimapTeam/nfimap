import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import CustomModal from "../components/CustomModal";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirm = () => {
    onClose();
  };
  return (
    <div>
      dd
    </div>
  );
};

export default Home;
