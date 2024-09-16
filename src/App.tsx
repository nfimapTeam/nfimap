import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import MapPage from "./page/MapPage";
import Layout from "./components/Layout";
import DetailPage from "./page/DetailPage";
import NotFound from "./components/NotFound";
import 'antd/dist/reset.css';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/:id" element={<DetailPage />} />
        <Route
          path="*"
          element={
            <NotFound title="404" content="찾을 수 없는 페이지입니다!!!" />
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;
