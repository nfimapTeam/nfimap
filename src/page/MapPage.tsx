import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Sidebar from "../components/SideBar";
import { concertsData } from "../datas/concerts";
import NaverMap from "../components/NaverMap";
import { nfiloadData } from "../datas/nfiload";

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

const MapPage = () => {
  const [concertState, setConcertState] = useState<Concert[]>(concertsData);
  const [nfiLoadState, setNfiLoadState] = useState<Nfiload[]>(nfiloadData);
  const [query, setQuery] = useState<string>("");
  const [showPastConcerts, setShowPastConcerts] = useState<boolean>(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [selectedNfiLoad, setSelectedNfiLoad] = useState<Nfiload | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];

    const filteredConcerts = concertsData.filter((concert) => {
      const matchesQuery =
        concert.name.toLowerCase().includes(query.toLowerCase()) ||
        concert.location.toLowerCase().includes(query.toLowerCase());

      const isUpcomingOrToday = concert.date.some((date) => {
        const concertDate = date.split("(")[0];
        return concertDate >= currentDate;
      });

      const isPast = concert.date.some((date) => {
        const concertDate = date.split("(")[0];
        return concertDate < currentDate;
      });

      return matchesQuery && (showPastConcerts ? isPast || isUpcomingOrToday : isUpcomingOrToday);
    });

    setConcertState(filteredConcerts);
  }, [query, showPastConcerts]);

  useEffect(() => {
    // Filter NFI load data based on query if needed
    const filteredNfiLoad = nfiloadData.filter((load) =>
      load.name.toLowerCase().includes(query.toLowerCase()) ||
      load.location.toLowerCase().includes(query.toLowerCase())
    );
    setNfiLoadState(filteredNfiLoad);
  }, [query]);

  return (
    <Box display={{ base: "block", md: "flex" }}>
      <Box display={{ base: "none", md: "block" }} width="340px">
        <Sidebar
          concerts={concertState}
          nfiload={nfiLoadState}
          query={query}
          setQuery={setQuery}
          showPastConcerts={showPastConcerts}
          setShowPastConcerts={setShowPastConcerts}
          selectedConcert={selectedConcert}
          setSelectedConcert={setSelectedConcert}
          selectedNfiLoad={selectedNfiLoad}
          setSelectedNfiLoad={setSelectedNfiLoad}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
        />
      </Box>
      <Box flex="1">
        <NaverMap
          concerts={concertState}
          nfiLoad={nfiLoadState}
          setShowPastConcerts={setShowPastConcerts}
          selectedConcert={selectedConcert}
          setSelectedConcert={setSelectedConcert}
          selectedNfiLoad={selectedNfiLoad}
          setSelectedNfiLoad={setSelectedNfiLoad}
          activeTabIndex={activeTabIndex}
        />
      </Box>
    </Box>
  );
};

export default MapPage;