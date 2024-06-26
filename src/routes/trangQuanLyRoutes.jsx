import { useSelector } from "react-redux";
import ManagerHomePage from "../containers/ManagerPage/ManagerHomePage";

const trangQuanLyRoutes = [
    {
        path: "/managerPage",
        component: ManagerHomePage,
        permission: true,
        layout: null
    },
    {
        path: "/managerPage/:key",
        component: ManagerHomePage,
        permission: true,
        layout: null
    },
];

export default trangQuanLyRoutes;