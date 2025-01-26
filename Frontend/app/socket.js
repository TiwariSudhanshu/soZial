
import { io } from "socket.io-client";

const socket = io("https://sozial-server.onrender.com", { withCredentials: true });
export default socket;
