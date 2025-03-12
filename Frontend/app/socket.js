
import { io } from "socket.io-client";

const socket = io("https://sozial-server.onrender.com", { withCredentials: true,
    transports: ["websocket"],
    reconnectionAttempts: 51,
    reconnectionDelay: 2000,
 });
export default socket;
