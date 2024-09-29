import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import theme from "./util/theme";
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById("root") as HTMLElement;

if (container.hasChildNodes()) {
  // 서버사이드 렌더링(SSR)이 존재하는 경우 hydrateRoot를 사용해 초기화
  ReactDOM.hydrateRoot(
    container,
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          <HelmetProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </HelmetProvider>
        </RecoilRoot>
      </ChakraProvider>
    </React.StrictMode>
  );
} else {
  // 클라이언트에서 처음 로딩하는 경우 createRoot를 사용해 초기화
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          <HelmetProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </HelmetProvider>
        </RecoilRoot>
      </ChakraProvider>
    </React.StrictMode>
  );
}

// Web Vitals (성능 측정)
reportWebVitals();
