import Login from '../containers/Auth/Login'
// import Login from '../features/login'

import HomePage from '../containers/HomePage/HomePage'
import nguoiDungRoutes from './nguoiDungRoutes'

const routes = [
    { path: '/login', component: Login, layout: null },
    { path: '/', component: HomePage, layout: null },
    ...nguoiDungRoutes
]

export default routes
