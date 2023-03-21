import Login from '../containers/Auth/Login'
// import Login from '../features/login'

import HomePage from '../containers/HomePage/HomePage'
import nguoiDungRoutes from './nguoiDungRoutes'
import tinDangRoutes from './tinDangRoutes'
import trangQuanLyRoutes from './trangQuanLyRoutes'
import authRoutes from './authRoutes'

const routes = [
    { path: '/', component: HomePage, layout: null },
    ...authRoutes,
    ...nguoiDungRoutes,
    ...tinDangRoutes,
    ...trangQuanLyRoutes
]

export default routes
