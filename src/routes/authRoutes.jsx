import ForgotPassword from "../containers/Auth/ForgotPassword";
import Login from "../containers/Auth/Login";
import Register from "../containers/Auth/Register";
import ResetPassword from "../containers/Auth/resetPassword";

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
    },
    {
        path: "/resetPassword",
        component: ResetPassword,
        layout: null
    },
    {
        path: "/forgotPassword",
        component: ForgotPassword,
        layout: null
    },
];

export default authRoutes;