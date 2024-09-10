import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import MapPage from "./page/MapPage";
import Layout from "./components/Layout"

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Layout>
  );
};

export default App;
