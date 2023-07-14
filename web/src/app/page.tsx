"use client";

import Image from "next/image";
import React from "react";
import { Socket, io } from "socket.io-client";
import Button from "../../components/Button";
import { randomUUID } from "crypto";

interface Message {
  id: string;
  text: string;
  clientId: string;
  to: string;
}

export default function Home() {
  const [connected, setConnnected] = React.useState(false);
  const [connectedSocket, setConnnectedSocket] = React.useState(false);
  let connSocket = React.useRef<Socket>();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [msg, setMsg] = React.useState<string>();

  const URL =
    process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:3009/message";

  const socket = io(URL, { autoConnect: false });

  React.useEffect(() => {
    if (!connected) {
      setConnnected(true);
      const so = socket.connect();
      so
      connSocket.current = so;
    }
  }, [connected, socket]);

  React.useEffect(() => {
    connSocket.current?.on("joinRoom", (message: Message) => {
      console.log(message);

      setMessages((prev) => [...prev, message]);
    });

    return () => connSocket.current?.off("joinRoom");
  }, []);

  React.useEffect(() => {
    connSocket.current?.on("message", (message) => {
      console.log(message);

      setMessages((prev) => [...prev, message]);
    });

    return () => connSocket.current?.off("message");
  }, []);

  function generateRandomNumber() {
    const min = 10000000000;
    const max = 100000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const joinRoom = React.useCallback(() => {
    connSocket.current?.emit("joinRoom", "Sala 1");
    setConnnectedSocket(true);
  }, []);

  const sendMessage = React.useCallback(() => {
    if (msg && connSocket.current) {
      let message: Message = {
        clientId: connSocket.current.id,
        id: generateRandomNumber().toString(),
        text: msg,
        to: "Sala 1",
      };
      connSocket.current?.emit("message", message);
    }
  }, [msg]);

  const onChangeText = (value: string) => {
    setMsg(value);
  };

  const getStyle = (clientId: string) => {
    let style;

    switch (clientId) {
      case "system":
        style = { color: "#d13333" };
      default:
        style = { color: "#ffffff" };
    }

    return style;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div className="ml-3">
          {messages.map((message, idx) => (
            <p
              key={`${message}-${idx}`}
              className="text-sm font-medium text-white-900"
              style={getStyle(message.clientId)}
            >
              {message.clientId} - {message.text}
            </p>
          ))}
        </div>
        {!connectedSocket ? (
          <Button onClick={joinRoom} label="Conectar" />
        ) : (
          <div className="flex column">
            <input
              defaultValue={msg}
              value={msg}
              onChange={(e) => onChangeText(e.target.value)}
            />
            <Button onClick={sendMessage} label="Enviar" />
          </div>
        )}
      </div>
    </main>
  );
}
