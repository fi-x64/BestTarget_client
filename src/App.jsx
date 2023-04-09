import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import DefaultLayout from './layouts/DefaultLayout'
import React, { useEffect, useState } from 'react'
import HomeHeader from './containers/HomePage/HomeHeader'
import HomeFooter from './containers/HomePage/HomeFooter'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';
import BackToTopButton from './components/atom/BackToTopButton/BackToTopButton'
import socketIoClient from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './services/nguoiDung'
import { updateUser } from './actions/auth'

// const socket = io('http://localhost:3000');

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const socket = socketIoClient.io('http://localhost:3001');

  useEffect(() => {
    socket.on('goiTinDang_updated', (message) => {
      if (isLoggedIn && message.status == 'sucess') {
        socket.emit("currentUserId", user.data._id);
      }
      socket.on('cuurentUserData', async (data) => {
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
                        <div className='max-w-[936px] mx-auto'>
                          <Component></Component>
                        </div>
                      </div>
                      <HomeFooter />
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
          {/* Same as */}
          <ToastContainer />
        </Router>
      </QueryClientProvider>
    </div>
  )
}

export default App
