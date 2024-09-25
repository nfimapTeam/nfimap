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
  const [selectedType, setSelectedType] = useState<string>(""); // 추가: 선택된 유형 상태

  useEffect(() => {
    const currentDate = new Date();

    const filteredConcerts = concertsData.filter((concert) => {
      const matchesQuery =
        concert.name.toLowerCase().includes(query.toLowerCase()) ||
        concert.location.toLowerCase().includes(query.toLowerCase());

      const concertDates = concert.date.map(
        (date) => new Date(date.split("(")[0])
      );
      const latestDate = new Date(
        Math.max(...concertDates.map((date) => date.getTime()))
      );

      const isPast = latestDate < currentDate;
      const isUpcomingOrToday = latestDate >= currentDate;

      const matchesType = selectedType ? concert.type === selectedType : true;

      return (
        matchesQuery &&
        (showPastConcerts ? true : isUpcomingOrToday) &&
        matchesType
      );
    });

    // 날짜 기준으로 정렬
    filteredConcerts.sort((a, b) => {
      const dateA = Math.max(
        ...a.date.map((date) => new Date(date.split("(")[0]).getTime())
      );
      const dateB = Math.max(
        ...b.date.map((date) => new Date(date.split("(")[0]).getTime())
      );
      return dateA - dateB;
    });

    setConcertState(filteredConcerts);
  }, [query, showPastConcerts, selectedType]); // 추가: selectedType 의존성 추가

  useEffect(() => {
    const filteredNfiLoad = nfiloadData.filter(
      (load) =>
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
          selectedType={selectedType} // 추가
          setSelectedType={setSelectedType} // 추가
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
