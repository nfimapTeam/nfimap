import React from "react";
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import ConcertInfo from "./ConcertInfo";
import NfiLoad from "./NfiLoad";

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
  ticketOpen?: any;
};

type Nfiload = {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
};

type SidebarProps = {
  concerts: Concert[];
  nfiload: Nfiload[];
  query: string;
  setQuery: (query: string) => void;
  showPastConcerts: boolean;
  setShowPastConcerts: (show: boolean) => void;
  setSelectedConcert: (concert: Concert) => void;
  selectedConcert: Concert | null;
  setSelectedNfiLoad: (nfiload: Nfiload) => void;
  selectedNfiLoad: Nfiload | null;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
};

const Sidebar = ({
  concerts,
  nfiload,
  query,
  setQuery,
  showPastConcerts,
  setShowPastConcerts,
  setSelectedConcert,
  selectedConcert,
  setSelectedNfiLoad,
  selectedNfiLoad,
  activeTabIndex,
  setActiveTabIndex,
}: SidebarProps) => {
  return (
    <Box
      w="340px"
      bg="#fff"
      p="20px"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
      h="calc(100vh - 120px)"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      borderRight="1px solid #ddd"
    >
      <Tabs index={activeTabIndex} onChange={setActiveTabIndex}>
        <TabList>
          <Tab
            fontSize="18px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
          >
            공연 정보
          </Tab>
          <Tab
            fontSize="18px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
          >
            엔피로드
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ConcertInfo
              concerts={concerts}
              query={query}
              setQuery={setQuery}
              showPastConcerts={showPastConcerts}
              setShowPastConcerts={setShowPastConcerts}
              setSelectedConcert={setSelectedConcert}
            />
          </TabPanel>
          <TabPanel>
            <NfiLoad 
              nfiload={nfiload}
              setSelectedNfiLoad={setSelectedNfiLoad}
              selectedNfiLoad={selectedNfiLoad}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Sidebar;