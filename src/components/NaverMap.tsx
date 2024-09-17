import React, { useEffect, useRef, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import CustomModal from "./CustomModal";

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

interface NaverMapProps {
  concerts: Concert[];
  setShowPastConcerts: (show: boolean) => void;
}

const NaverMap = ({ concerts, setShowPastConcerts }: NaverMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConcert, setSelectedConcert] = useState<any>(null);
  const [showPastConcerts, setShowPastConcertsState] = useState<boolean>(false);
  const [trafficLayer, setTrafficLayer] = useState<any>(null);
  const [showTraffic, setShowTraffic] = useState<boolean>(false);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;

    if (mapContainer && (window as any).naver && !mapRef.current) {
      const naverMaps = (window as any).naver.maps;
      const map = new naverMaps.Map(mapContainer, {
        center: new naverMaps.LatLng(37.5665, 126.978),
        zoom: 10,
      });

      mapRef.current = map;

      // Initialize traffic layer
      const traffic = new naverMaps.TrafficLayer();
      setTrafficLayer(traffic);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !(window as any).naver) return;

    const naverMaps = (window as any).naver.maps;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    concerts.forEach((concert) => {
      const concertLocation = new naverMaps.LatLng(concert.lat, concert.lng);

      const today = new Date();
      let isToday = false;
      let isPast = false;

      concert.date.forEach((dateString) => {
        const concertDate = new Date(dateString.split("(")[0]);

        if (concertDate.toDateString() === today.toDateString()) {
          isToday = true;
        } else if (concertDate < today) {
          isPast = true;
        }
      });

      if (!showPastConcerts && isPast) return;

      let markerImage = "/image/nfimap.png";
      let markerStyle = "";

      if (isToday) {
        markerImage = "/image/heart.png";
        markerStyle = "animation: heartbeat 0.8s ease-in-out infinite;";
      } else if (isPast) {
        markerStyle = "filter: grayscale(100%) brightness(40%);";
      }

      const marker = new naverMaps.Marker({
        position: concertLocation,
        map: map,
        title: concert.name,
        icon: {
          content: `
            <div style="position: relative;">
              <img src="${markerImage}" 
                   style="width: 30px; height: 30px; ${markerStyle}" 
                   class="marker-image">
            </div>
          `,
        },
      });

      const infoWindowContent = `
<div style="width: 300px; font-family: Arial, sans-serif; padding: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 4px;">
  <div style="display: flex; align-items: center;">
    <div style="width: 70px; height: 70px; margin-right: 15px; border-radius: 4px; overflow: hidden;">
      <img src="${concert.poster || "/api/placeholder/150/150"}" alt="${
        concert.name
      }" 
           style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
    </div>
    <div style="flex-grow: 1;">
      <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${
        concert.name
      }</h3>
      <p style="margin: 5px 0 0; font-size: 14px; color: #666;">${
        concert.location
      }</p>
    </div>
  </div>
   <button class="concertDetailBtn" style="margin-top: 5px; padding: 4px 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; background-color: #fff; color: #333; cursor: pointer; transition: background-color 0.3s, color 0.3s;">
    상세보기
  </button>
</div>
`;

      const infoWindow = new naverMaps.InfoWindow({
        content: infoWindowContent,
      });

      naverMaps.Event.addListener(marker, "click", () => {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infoWindow.open(map, marker);
        setCurrentInfoWindow(infoWindow);
        setSelectedConcert(concert);

        // InfoWindow가 열린 후에 버튼에 이벤트 리스너를 추가
        setTimeout(() => {
          const button = document.querySelector(".concertDetailBtn");
          if (button) {
            button.addEventListener("click", () => {
              onOpen();
            });
          }
        }, 100);
      });

      markersRef.current.push(marker);
    });

    // 기존 맵을 클릭하면 현재 열려 있는 infoWindow를 닫음
    naverMaps.Event.addListener(map, "click", () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
        setCurrentInfoWindow(null);
      }
    });

  }, [concerts, currentInfoWindow, onOpen, showPastConcerts]);

  useEffect(() => {
    // 맵 외부를 클릭할 경우 infoWindow를 닫는 기능
    const handleClickOutside = (event: MouseEvent) => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
        setCurrentInfoWindow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentInfoWindow]);

  const handleTogglePastConcerts = () => {
    const newState = !showPastConcerts;
    setShowPastConcertsState(newState);
    setShowPastConcerts(newState);
  };

  const handleToggleTraffic = () => {
    if (trafficLayer) {
      if (showTraffic) {
        trafficLayer.setMap(null);
      } else {
        trafficLayer.setMap(mapRef.current);
      }
      setShowTraffic(!showTraffic);
    }
  };

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 120px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .marker-image:hover {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        .heartbeat {
          animation: heartbeat 0.8s ease-in-out infinite;
        }

        .control-buttons {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .control-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        .past-concerts-button {
          background-color: #007BFF;
        }

        .past-concerts-button:hover {
          background-color: #0056b3;
        }

        .traffic-button {
          background-color: #28a745;
        }

        .traffic-button:hover {
          background-color: #218838;
        }
      `}</style>
      <div className="control-buttons">
        <button
          onClick={handleTogglePastConcerts}
          className="control-button past-concerts-button"
        >
          {showPastConcerts ? "지난공연 숨기기" : "지난공연 보기"}
        </button>
        <button
          onClick={handleToggleTraffic}
          className="control-button traffic-button"
        >
          {showTraffic ? "교통상황 숨기기" : "교통상황 보기"}
        </button>
      </div>
      <CustomModal
        concert={selectedConcert}
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default NaverMap;
