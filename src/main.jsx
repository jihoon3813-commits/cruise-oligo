import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from './App'
import './style.css'
import { ConfigProvider } from './context/ConfigContext'

const convexUrl = import.meta.env.VITE_CONVEX_URL || "";
if (!convexUrl) {
  console.error("VITE_CONVEX_URL is missing! Please run 'npx convex dev' and ensure .env.local is created.");
}
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <ConfigProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ConvexProvider>
  </React.StrictMode>,
)
