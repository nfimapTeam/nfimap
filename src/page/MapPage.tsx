import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;

    if (mapContainer && (window as any).naver) {
      const naverMaps = (window as any).naver.maps;
      const map = new naverMaps.Map(mapContainer, {
        center: new naverMaps.LatLng(37.5665, 126.978),
        zoom: 10,
      });
      new naverMaps.Marker({
        position: new naverMaps.LatLng(37.5665, 126.978),
        map: map,
      });
    }
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default Map;
