import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import DefaultLayout from './layouts/DefaultLayout'
import React from 'react'
import HomeHeader from './containers/HomePage/HomeHeader'
import HomeFooter from './containers/HomePage/HomeFooter'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient()

function App() {
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
                  <HomeHeader />
                  <div className='bg-[#f4f4f4]'>
                    <div className='max-w-[936px] mx-auto'>
                      <Component></Component>
                    </div>
                  </div>
                  <HomeFooter />
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
