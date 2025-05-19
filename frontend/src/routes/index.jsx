import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import NotFound from '../pages/NotFound';
import Status from '../pages/Status';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: "status",
        index: true,
        element: <Status />,
      },
      {
        path: "",
        index: true,
        element: <Home />
      },
      {
        path: "login",
        index: true,
        element: <Login />
      },
      {
        path: "dashboard",
        index: true,
        element: <Dashboard />
      },
      {
        path: "logout",
        index: true,
        element: <Logout />
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]); 