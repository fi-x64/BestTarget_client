import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import routes from './routes'
import DefaultLayout from './layouts/DefaultLayout'
import React from 'react'

function App() {
  return (
    <div className="App">
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
                <Component></Component>
              </Layout>
              // </ProtectedRoute>
            )
            return <Route key={index} path={r.path} element={Content} />
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App
