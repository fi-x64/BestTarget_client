import Profile from "../containers/User/Profile";
import EditProfile from "../containers/User/EditProfile";
import EditPassword from "../containers/User/EditPassword";
import Follow from "../containers/User/Follow";
import WishList from "../containers/Post/Wishlist";
import Chat from "../containers/User/Chat";
import Map from "../components/atom/Map/Map";
import Statistics from "../containers/User/Statistics";

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
    {
        path: "/users/follow",
        component: Follow,
        layout: null
    },
    {
        path: "/users/wishList",
        component: WishList,
        layout: null
    },
    {
        path: "/users/statistics",
        component: Statistics,
        layout: null
    },
    {
        path: "/chat",
        component: Chat,
        layout: null
    },
    {
        path: "/chat/hoTro",
        component: Chat,
        layout: null
    },
    {
        path: "/map",
        component: Map,
        layout: null
    },
];

export default nguoiDungRoutes;