import EditPost from "../containers/Post/EditPost";
import ManagePost from "../containers/Post/ManagePost";
import NewPost from "../containers/Post/NewPost";
import PostDetail from "../containers/Post/PostDetail";
import PostList from "../containers/Post/PostList";

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
    {
        path: "/postDetail",
        component: PostDetail,
        layout: null
    },
    {
        path: "/postEdit",
        component: EditPost,
        layout: null
    },
    {
        path: "/postList",
        component: PostList,
        layout: null
    }
];

export default tinDangRoutes;