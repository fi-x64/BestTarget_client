import Profile from "../containers/User/Profile";
import EditProfile from "../containers/User/EditProfile";
import EditPassword from "../containers/User/EditPassword";
import Follow from "../containers/User/Follow";
import WishList from "../containers/Post/Wishlist";

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
];

export default nguoiDungRoutes;