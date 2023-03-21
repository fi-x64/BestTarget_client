import Login from "../containers/Auth/Login";
import Register from "../containers/Auth/Register";

const authRoutes = [
    {
        path: "/login",
        component: Login,
        layout: null
    },
    {
        path: "/register",
        component: Register,
        layout: null
    }
];

export default authRoutes;