import React from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
} from "@chakra-ui/react";
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
  globalConcerts: Concert[];
  nfiload: Nfiload[];
  query: string;
  setQuery: (query: string) => void;
  globalQuery: string;
  setGlobalQuery: (query: string) => void;
  showPastConcerts: boolean;
  setShowPastConcerts: (show: boolean) => void;
  setSelectedConcert: (concert: Concert) => void;
  selectedConcert: Concert | null;
  setSelectedNfiLoad: (nfiload: Nfiload) => void;
  selectedNfiLoad: Nfiload | null;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedGlobalType: string;
  setSelectedGlobalType: (type: string) => void;
  showPastConcertsGlobal: boolean;
  setShowPastConcertsGlobal: (show: boolean) => void;
  setSelectedGlobalConcert: (concert: Concert) => void;
  selectedGlobalConcert: Concert | null;
};

const Sidebar = ({
  concerts,
  nfiload,
  globalConcerts,
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
  selectedType, // 추가
  setSelectedType, // 추가
  showPastConcertsGlobal,
  setShowPastConcertsGlobal,
  setSelectedGlobalConcert,
  selectedGlobalConcert,
  globalQuery,
  setGlobalQuery,
  selectedGlobalType,
  setSelectedGlobalType,
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
            fontSize="17px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
            whiteSpace="nowrap"
          >
            국내 공연
          </Tab>
          <Tab
            fontSize="17px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
            whiteSpace="nowrap"
          >
            엔피로드
          </Tab>
          <Tab
            fontSize="17px"
            fontWeight="600"
            textAlign="center"
            _selected={{ borderBottom: "2px solid #0597F2", color: "blue.500" }}
            _focus={{ boxShadow: "none" }}
            flex="1"
            whiteSpace="nowrap"
          >
            해외 공연
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
              selectedType={selectedType} // 추가
              setSelectedType={setSelectedType}
            />
          </TabPanel>
          <TabPanel>
            <NfiLoad
              nfiload={nfiload}
              setSelectedNfiLoad={setSelectedNfiLoad}
              selectedNfiLoad={selectedNfiLoad}
            />
          </TabPanel>
          <TabPanel>
            <ConcertInfo
              concerts={globalConcerts}
              query={globalQuery}
              setQuery={setGlobalQuery}
              showPastConcerts={showPastConcertsGlobal}
              setShowPastConcerts={setShowPastConcertsGlobal}
              setSelectedConcert={setSelectedGlobalConcert}
              selectedType={selectedGlobalType} // 추가
              setSelectedType={setSelectedGlobalType}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Sidebar;
