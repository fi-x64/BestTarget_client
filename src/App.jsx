import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import DefaultLayout from './layouts/DefaultLayout'
import React, { useCallback, useEffect, useState } from 'react'
import HomeHeader from './containers/HomePage/HomeHeader'
import HomeFooter from './containers/HomePage/HomeFooter'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';
import BackToTopButton from './components/atom/BackToTopButton/BackToTopButton'
import socketIoClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux'
import { logout, updateUser } from './actions/auth'
import AuthVerify from './utils/AuthVerify'

import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'

// const socket = io('http://localhost:3000');

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socket = socketIoClient.io('http://localhost:3001');

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    socket.on('goiTinDang_updated', (message) => {
      if (isLoggedIn && message.status == 'sucess') {
        socket.emit("currentUserId", user.data._id);
      }
      socket.on(`cuurentUserData_${user.data._id}`, async (data) => {
        const userData = { ...user };
        userData.data = data.userData;
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(updateUser(userData));
      })
    });
  });
  // });

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {routes.map((r, index) => {
              let Component = r.component
              let Layout = DefaultLayout
              if (r.layout) Layout = r.layout
              if (r.layout === null) Layout = React.Fragment
              let Content = (
                // <ProtectedRoute role={r?.role}>
                <Layout>
                  {r.permission ?
                    <div>
                      <div className='mx-auto'>
                        <Component></Component>
                      </div>
                    </div> :
                    <>
                      <HomeHeader />
                      <div className='bg-[#f4f4f4]'>
                        <div className='max-w-[960px] min-h-[75vh] h-auto mx-auto'>
                          <Component></Component>
                        </div>
                        <HomeFooter />
                      </div>
                    </>
                  }
                  <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                  <ToastContainer />
                  <BackToTopButton />
                </Layout>
                // </ProtectedRoute>
              )
              return <Route key={index} path={r.path} element={Content} />
            })}

          </Routes>
          <AuthVerify logOut={logOut} />
          {/* Same as */}
          <ToastContainer />
        </Router>
      </QueryClientProvider>
    </div>
  )
}

export default App
