import React from 'react'
import ReactDOM from 'react-dom/client'
import Err from "./Error.jsx"
import LogIn from "./Login.jsx"
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/planner" element={<App />} />
        <Route path="/*" element={<Err />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
