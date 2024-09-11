import { Box } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import { concertsData } from "../datas/concerts";
import NaverMap from "../components/NaverMap";
type Concert = {
  name: string;
  location: string;
  type: string;
  durationMinutes: number;
  date: string[];
  startTime: string;
  artists: string[];
  ticketLink: string;
  poster: string;
  lat: string;
  lng: string;
};

type SidebarProps = {
  concerts: Concert[];
  onConcertSelect: (concert: Concert) => void;
};
const MapPage: React.FC = () => {
  const handleConcertSelect = (concert: Concert) => {
    console.log(concert);
  };

  return (
    <Box display={{ base: "block", md: "flex" }}>
      <Box display={{ base: "none", md: "block" }} width="340px">
        <Sidebar
          concerts={concertsData}
          onConcertSelect={handleConcertSelect}
        />
      </Box>
      <Box flex="1">
        <NaverMap />
      </Box>
    </Box>
  );
};

export default MapPage;
