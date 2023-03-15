import ManagePost from "../containers/Post/ManagePost";
import NewPost from "../containers/Post/NewPost";

const tinDangRoutes = [
    {
        path: "/newPost",
        component: NewPost,
        layout: null
    },
    {
        path: "/managePost",
        component: ManagePost,
        layout: null
    },
];

export default tinDangRoutes;