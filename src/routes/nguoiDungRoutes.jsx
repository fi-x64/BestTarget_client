import Profile from "../containers/User/Profile";
import EditProfile from "../containers/User/EditProfile";
import EditPassword from "../containers/User/EditPassword";

const nguoiDungRoutes = [
    {
        path: "/users/profile",
        component: Profile,
        layout: null
    },
    {
        path: "/users/editProfile",
        component: EditProfile,
        layout: null
    },
    {
        path: "/users/editPassword",
        component: EditPassword,
        layout: null
    },
];

export default nguoiDungRoutes;