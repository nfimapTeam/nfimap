import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { Box } from "@chakra-ui/react";

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

const Sidebar = ({ concerts, onConcertSelect }: SidebarProps) => {
  const [query, setQuery] = useState<string>("");
  const [filteredConcerts, setFilteredConcerts] = useState<Concert[]>(concerts);
  const [toggle, setToggle] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleToggleChange = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  useEffect(() => {
    const currentDate = new Date();
  
    // Filter by date and include ongoing and upcoming concerts if toggle is disabled
    const toggleFiltered = toggle
      ? concerts
      : concerts.filter((concert) =>
          concert.date.some((date) => {
            const concertDate = new Date(date.split('(')[0]);
            return concertDate >= currentDate || (
              concertDate.getDate() === currentDate.getDate() &&
              concertDate.getMonth() === currentDate.getMonth() &&
              concertDate.getFullYear() === currentDate.getFullYear()
            );
          })
        );
  
    // Filter by search query
    const searchFiltered = toggleFiltered.filter((concert) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        concert.location.toLowerCase().includes(lowerCaseQuery) ||
        concert.name.toLowerCase().includes(lowerCaseQuery)
      );
    });
  
    setFilteredConcerts(searchFiltered);
  }, [toggle, query, concerts]);

  return (
    <SidebarContainer>
      <HeaderText>공연 정보</HeaderText>
      <SearchContainer>
        <StyledSearchInput
          ref={searchInputRef}
          placeholder="이름이나 장소로 검색하세요."
          value={query}
          onChange={handleInputChange}
        />
      </SearchContainer>
      <ToggleSwitchContainer>
        <span style={{ fontSize: "10px" }}>지난 공연 포함 </span>
        <ToggleSwitch>
          <input
            type="checkbox"
            id="toggle"
            checked={toggle}
            onChange={handleToggleChange}
          />
          <label htmlFor="toggle"></label>
        </ToggleSwitch>
      </ToggleSwitchContainer>
      <LocationList>
        {filteredConcerts.map((concert, index) => (
          <LocationItem key={index} onClick={() => onConcertSelect(concert)}>
            <ImageContainer>
              <LocationImage src={concert.poster} alt="location" />
            </ImageContainer>
            <LocationInfo>
              <h3>{concert.name}</h3>
              <p>{concert.location}</p>
            </LocationInfo>
          </LocationItem>
        ))}
      </LocationList>
    </SidebarContainer>
  );
};

// Styled components
const HeaderText = styled.h1`
  text-align: left;
  color: black;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const SidebarContainer = styled.div`
  width: 340px;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 120px);
`;

const StyledSearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;

  &:focus {
    border-color: #4d90fe;
    box-shadow: 0 2px 4px rgba(77, 144, 254, 0.5);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ToggleSwitchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  margin-left: 10px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  label {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    border-radius: 24px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: background-color 0.2s;
  }

  label:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background-color: white;
    top: 3px;
    left: 3px;
    transition: transform 0.2s;
  }

  input:checked + label {
    background-color: #4d90fe;
  }

  input:checked + label:before {
    transform: translateX(26px);
  }
`;

const LocationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LocationItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  margin-right: 15px;
  border-radius: 4px;
  overflow: hidden;
`;

const LocationImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LocationInfo = styled.div`
  flex-grow: 1;

  h3 {
    font-size: 16px;
    margin: 0;
    font-weight: bold;
  }

  p {
    font-size: 14px;
    color: #666;
    margin: 5px 0 0;
  }
`;

export default Sidebar;
