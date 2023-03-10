import Profile from "../containers/User/Profile";
import EditProfile from "../containers/User/EditProfile";

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
];

export default nguoiDungRoutes;