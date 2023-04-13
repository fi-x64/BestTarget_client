import Login from '../containers/Auth/Login'
// import Login from '../features/login'

import HomePage from '../containers/HomePage/HomePage'
import nguoiDungRoutes from './nguoiDungRoutes'
import tinDangRoutes from './tinDangRoutes'
import trangQuanLyRoutes from './trangQuanLyRoutes'
import authRoutes from './authRoutes'
import thanhToanRoutes from './thanhToanRoutes'
import hoaDonRoutes from './hoaDonRoutes'

const routes = [
    { path: '/', component: HomePage, layout: null },
    ...authRoutes,
    ...nguoiDungRoutes,
    ...tinDangRoutes,
    ...trangQuanLyRoutes,
    ...thanhToanRoutes,
    ...hoaDonRoutes
]

export default routes
