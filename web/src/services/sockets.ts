import { Socket, io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:3009/message";

const socket = io(URL, { autoConnect: true });

export default socket;
