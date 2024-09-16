import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4BA4F2',
            colorLink: '#4BA4F2',
            colorLinkHover: '#3a8fd1',
          },
        }}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
