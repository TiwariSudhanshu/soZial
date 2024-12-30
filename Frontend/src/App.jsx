import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import Info from './pages/Info';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import EditProfile from './pages/EditProfile';
import AddPost from './pages/AddPost';
import OtherProfile from './pages/OtherProfile';
import ChatPage from './pages/ChatPage';
import BookmarkPage from './pages/BookmarkPage';
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
    path: "/bookmark",
    element: <BookmarkPage/>
  },
  {
    path: "/edit",
    element: <EditProfile/>
  },
  {
    path: "/chat",
    element: <ChatPage/>
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
