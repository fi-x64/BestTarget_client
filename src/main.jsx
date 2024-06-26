import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store from './store'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config()
// import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_clientId}> */}
      <GoogleOAuthProvider clientId='762119092368-8t2col1rqp85uneukjrbd6d3qhlftaqg.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
)
