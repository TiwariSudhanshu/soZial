import React, { useEffect, useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { serverLink } from "../../constants";

const Bookmark = () => {
  const darkMode = useSelector((state) => state.user.darkMode);
  const [posts, setPosts] = useState([]);

  // Bookmark api
  const bookmark = async (postId) => {
    try {
      const response = await fetch(`${serverLink}/api/v1/post/bookmark`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({
          postId,
        }),
        credentials: "include",
      });
      if (response.ok) {
        // toast.success("UnBookmarked")
      } else {
        toast.error("Failed to bookmark");
      }
    } catch (error) {
      console.log("Error in bookmarking :", error);
      toast.error("Error in bookmarking");
    }
  };
  const getBookMarks = async () => {
    try {
      const response = await fetch(`${serverLink}/api/v1/post/getAllBookmarks`, {
        method: "get",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.data);
      } else {
        toast.error("Error in Fetching BookMarks");
      }
    } catch (error) {
      console.log(" Error", error);
      toast.error("Error in Fetching BookMarks");
    }
  };

  useEffect(() => {
    getBookMarks();
  }, []);

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-white min-h-screen"
          : "bg-gray-100 text-black min-h-screen"
      }
    >
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
      </header>
      <main className="p-6">
        {posts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((post) => (
            <div key={post._id} className="mb-6 pb-6 border-b ">
              <div className="flex items-center space-x-4 mb-2 ">
                <img
                  src={post.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="text-lg font-bold">{post.name}</h4>
                  <p>@{post.username}</p>
                </div>
                <button
                  className="absolute top-0 right-0 p-2"
                  onClick={() => {
                    bookmark(post.id);
                  }}
                >
                  <BookmarkIcon />
                </button>
              </div>
              {post.content && (
                <p className="mb-3">
                  {post.content.split(" ").map((word, index) =>
                    word.startsWith("#") ? (
                      <span key={index} style={{ color: "skyblue" }}>
                        {word}{" "}
                      </span>
                    ) : (
                      word + " "
                    )
                  )}
                </p>
              )}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full rounded-lg mb-3"
                />
              )}
              <div className="flex justify-between space-x-4">
                <div className="flex space-x-4">
                  <button></button>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
};

export default Bookmark;
