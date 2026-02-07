import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home"
import HomeInfo from "../pages/HomeInfo";
import DistrictTable from "../components/DistrictTable"

const Router = () => {
    return (
        <HashRouter >
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route index element={<HomeInfo />} />
                    <Route path=":id" element={<DistrictTable />} />
                </Route>
            </Routes>
        </HashRouter >
    );
};

export default Router;
