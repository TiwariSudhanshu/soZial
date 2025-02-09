// api.js
import { serverLink } from "../../constants";
const API_BASE_URL = `${serverLink}/api/v1/user`;

export const fetchUser = async () => {
  const response = await fetch(`${API_BASE_URL}/edit`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};

export const editUserInfo = async (dataToSend) => {
  const response = await fetch(`${API_BASE_URL}/edit/change`, {
    method: "POST",
    headers:{
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: dataToSend,
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to edit user info");
  }
  return response.json();
};

export const changePassword = async (passData) => {
  const response = await fetch(`${API_BASE_URL}/edit/changePassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
    },
    body: JSON.stringify(passData),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to change password");
  }
  return response.json();
};
