import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorPage from './pages/ErrorPage'
import ChatPage, { action as chatAction, loader as chatLoader } from './pages/ChatPage'
import Dashboard, { action as dashboardAction } from './components/Dashboard'
import WelcomePage from './pages/WelcomePage'
import { StreamProvider } from './context/StreamContext'
import { SettingsProvider } from './context/SettingsContext'

const router = createBrowserRouter([
  {
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        // index: true,
        element: <ChatPage />,
        action: chatAction,
        loader: chatLoader,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
        action: dashboardAction,
      },
    ]
  },
  {
    element: <WelcomePage />,
    path: '/welcome',
    errorElement: <ErrorPage />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <StreamProvider>
        <RouterProvider router={router} />
      </StreamProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
