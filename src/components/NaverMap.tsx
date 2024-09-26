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

type Nfiload = {
  id: number;
  name: string;
  location: string;
  category: string;
  lat: string;
  lng: string;
};

interface NaverMapProps {
  concerts: Concert[];
  nfiLoad: Nfiload[];
  setShowPastConcerts: (show: boolean) => void;
  selectedConcert: Concert | null;
  setSelectedConcert: (concert: Concert) => void;
  selectedNfiLoad: Nfiload | null;
  setSelectedNfiLoad: (nfiLoad: Nfiload) => void;
  activeTabIndex: number;
}

const NaverMap = ({
  concerts,
  nfiLoad,
  setShowPastConcerts,
  selectedConcert,
  setSelectedConcert,
  selectedNfiLoad,
  setSelectedNfiLoad,
  activeTabIndex,
}: NaverMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ZOOM_LEVEL = 14;

  const getCategoryImage = (category: string): string => {
    switch (category.toLowerCase()) {
      case "카페":
        return "/image/cafe.png";
      case "장소":
        return "/image/location.png";
      case "맛집":
        return "/image/matzip.png";
      default:
        return "/image/nfiload.png";
    }
  };

  useEffect(() => {
    const mapContainer = mapContainerRef.current;

    if (mapContainer && (window as any).naver && !mapRef.current) {
      const naverMaps = (window as any).naver.maps;
      const map = new naverMaps.Map(mapContainer, {
        center: new naverMaps.LatLng(37.5665, 126.978),
        zoom: 10,
      });

      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !(window as any).naver) return;

    const naverMaps = (window as any).naver.maps;
    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const dataToDisplay = activeTabIndex === 0 ? concerts : nfiLoad;

    dataToDisplay.forEach((item) => {
      const location = new naverMaps.LatLng(item.lat, item.lng);

      let markerImage =
        activeTabIndex === 0
          ? "/image/nfimap.png"
          : getCategoryImage((item as Nfiload).category);
      let markerStyle = "";

      if (activeTabIndex === 0) {
        const today = new Date();
        let isToday = false;
        let isPast = false;

        (item as Concert).date.forEach((dateString) => {
          const concertDate = new Date(dateString.split("(")[0]);
          if (concertDate.toDateString() === today.toDateString()) {
            isToday = true;
          } else if (concertDate < today) {
            isPast = true;
          }
        });

        if (isToday) {
          markerImage = "/image/heart.png";
          markerStyle = "animation: heartbeat 0.8s ease-in-out infinite;";
        } else if (isPast) {
          markerStyle = "filter: grayscale(100%) brightness(40%);";
        }
      }
      console.log(markerImage)
      const marker = new naverMaps.Marker({
        position: location,
        map: map,
        title: item.name,
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

      const getPosterImage = (item: Concert | Nfiload): string => {
        if ("poster" in item) {
          return item.poster;
        } else {
          return getCategoryImage(item.category);
        }
      };

      const infoWindowContent = `
        <div style="width: 300px; font-family: Arial, sans-serif; padding: 10px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 4px;">
          <div style="display: flex; align-items: center;">
            <div style="width: 70px; height: 70px; margin-right: 15px; border-radius: 4px; overflow: hidden;">
              <img src="${getPosterImage(item)}" alt="${item.name}" 
                   style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
            </div>
            <div style="flex-grow: 1;">
              <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">${item.name}</h3>
              <p style="margin: 5px 0 0; font-size: 14px; color: #666;">${item.location}</p>
            </div>
          </div>
           <button class="detailBtn" style="margin-top: 5px; padding: 4px 8px; width: 100%; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; background-color: #fff; color: #333; cursor: pointer; transition: background-color 0.3s, color 0.3s;">
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

        if (activeTabIndex === 0) {
          setSelectedConcert(item as Concert);
        } else {
          setSelectedNfiLoad(item as Nfiload);
        }

        map.setCenter(location);
        map.setZoom(ZOOM_LEVEL);

        setTimeout(() => {
          const button = document.querySelector(".detailBtn");
          if (button) {
            button.addEventListener("click", () => {
              onOpen();
            });
          }
        }, 100);
      });

      markersRef.current.push(marker);
    });

    naverMaps.Event.addListener(map, "click", () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
        setCurrentInfoWindow(null);
      }
    });
  }, [concerts, nfiLoad, activeTabIndex]);

  useEffect(() => {
    if ((!selectedConcert && !selectedNfiLoad) || !mapRef.current) return;

    const selectedItem =
      activeTabIndex === 0 ? selectedConcert : selectedNfiLoad;
    const marker = markersRef.current.find(
      (marker) => marker.getTitle() === selectedItem?.name
    );

    if (marker) {
      (window as any).naver.maps.Event.trigger(marker, "click");
    }
  }, [selectedConcert, selectedNfiLoad, activeTabIndex]);

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
          align-items: center;
          gap: 10px;
          z-index: 10;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          border-radius: 50%;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #007BFF;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        item={activeTabIndex === 0 ? selectedConcert : selectedNfiLoad}
        // type={activeTabIndex === 0 ? "concert" : "nfiload"}
      />
    </div>
  );
};

export default NaverMap;
