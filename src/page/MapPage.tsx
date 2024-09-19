import React, { useState, useEffect } from "react";
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
  ticketOpen?: any;
};

const MapPage = () => {
  const [concertState, setConcertState] = useState<Concert[]>(concertsData);
  const [query, setQuery] = useState<string>("");
  const [showPastConcerts, setShowPastConcerts] = useState<boolean>(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  useEffect(() => {
    console.log(concertState);
  }, [concertState]);

  useEffect(() => {
    const currentDate = new Date();

    const filteredConcerts = concertsData.filter((concert) => {
      const matchesQuery =
        concert.name.toLowerCase().includes(query.toLowerCase()) ||
        concert.location.toLowerCase().includes(query.toLowerCase());

      const isUpcoming = concert.date.some((date) => {
        const concertDate = new Date(date.split("(")[0]);
        return concertDate >= currentDate;
      });

      return matchesQuery && (showPastConcerts || isUpcoming);
    });

    setConcertState(filteredConcerts);
  }, [query, showPastConcerts]);

  return (
     <Box display={{ base: "block", md: "flex" }}>
      <Box display={{ base: "none", md: "block" }} width="340px">
        <Sidebar
          concerts={concertState}
          query={query}
          setQuery={setQuery}
          showPastConcerts={showPastConcerts}
          setShowPastConcerts={setShowPastConcerts}
          selectedConcert={selectedConcert}
          setSelectedConcert={setSelectedConcert}
        />
      </Box>
      <Box flex="1">
        <NaverMap
          concerts={concertState}
          setShowPastConcerts={setShowPastConcerts}
          selectedConcert={selectedConcert}
          setSelectedConcert={setSelectedConcert}
        />
      </Box>
    </Box>
  );
};

export default MapPage;