import React, { useEffect, useRef, useState } from "react";
import { concertsData } from "../datas/concerts";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;

    if (mapContainer && (window as any).naver && !mapRef.current) {
      const naverMaps = (window as any).naver.maps;
      const map = new naverMaps.Map(mapContainer, {
        center: new naverMaps.LatLng(37.5665, 126.978),
        zoom: 10,
      });

      mapRef.current = map;

      concertsData.forEach((concert) => {
        const concertLocation = new naverMaps.LatLng(concert.lat, concert.lng);

        const marker = new naverMaps.Marker({
          position: concertLocation,
          map: map,
          title: concert.name,
        });

        const infoWindowContent = `
          <div style="width: 300px; font-family: Arial, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h3 style="margin: 0;">${concert.name}</h3>
              <button id="closeInfoWindow" style="background: none; border: none; cursor: pointer; font-size: 20px; padding: 5px;">&times;</button>
            </div>
            <div style="display: flex;">
              <div style="flex: 1; margin-right: 10px;">
                <img src="${concert.poster || "/api/placeholder/150/150"}" alt="${concert.name}" style="width: 100%; max-width: 150px; height: auto;">
              </div>
              <div style="flex: 2;">
                <p><strong>Location:</strong> ${concert.location}</p>
                <p><strong>Date:</strong> ${concert.date}</p>
                <p><strong>Start Time:</strong> ${concert.startTime}</p>
                <p><strong>Duration:</strong> ${concert.durationMinutes} minutes</p>
                <p><strong>Artists:</strong> ${concert.artists.join(", ")}</p>
                <a href="${concert.ticketLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Get Tickets</a>
              </div>
            </div>
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

          // 닫기 버튼에 이벤트 리스너 추가
          setTimeout(() => {
            const closeButton = document.getElementById("closeInfoWindow");
            if (closeButton) {
              closeButton.addEventListener("click", () => {
                infoWindow.close();
                setCurrentInfoWindow(null);
              });
            }
          }, 100);
        });
      });
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "calc(100vh - 120px)",
        overflow: "hidden",
      }}
    ></div>
  );
};

export default Map;