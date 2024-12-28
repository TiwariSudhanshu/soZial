import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import Info from './pages/Info';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import EditProfile from './pages/EditProfile';
import AddPost from './pages/AddPost';
import OtherProfile from './pages/otherProfile';
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/register",
    element: <Info />,
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/add",
    element: <AddPost/>
  },
  {
    path: "/:username",
    element: <OtherProfile/>
  },
  {
    path: "/edit",
    element: <EditProfile/>
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App
