"use client";
import React from "react";
import Button from "@/components/Button";
import socket from "@/services/sockets";
import { useSession, signOut } from "next-auth/react";
import { syncSocket } from "@/services/user";
import RoomsList from "@/components/RoomsList";
import RoomModal from "@/components/RoomModal";
import { Room } from "@/@types";

interface Message {
  id: string;
  text: string;
  clientId: string;
  to: string;
}

interface CreateRoom {
  name: string;
  privacy: boolean;
  password?: string;
}

export default function Rooms() {
  const [connected, setConnnected] = React.useState(false);
  const [connectedSocket, setConnnectedSocket] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [msg, setMsg] = React.useState<string>();
  const { data: session, status } = useSession();
  const [room, setRoom] = React.useState<CreateRoom>({
    name: "",
    privacy: false,
  });
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [showModal, setShowModal] = React.useState(false);

  const handleJoinRoom = () => {
    socket.on("joinRoom", (message: Message) => {
      console.log(message);

      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("joinRoom");
  };

  const handleMessages = () => {
    socket.on("message", (message) => {
      console.log(message);

      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("message");
  };

  const handleRooms = () => {
    socket.on("rooms", (rooms: Room[]) => {
      console.log(rooms);

      setRooms(rooms);
    });
  };

  const fetchRooms = () => {
    socket.emit("rooms");
  };

  const handleCreateRoom = () => {
    socket.on("createdRoom", (room: Room) => {
      setRoom(room);
      setConnnectedSocket(true);
    });
  };

  function generateRandomNumber() {
    const min = 10000000000;
    const max = 100000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const joinRoom = React.useCallback((roomId: string) => {
    socket.emit("joinRoom", roomId);
    setConnnectedSocket(true);
  }, []);

  const sendMessage = React.useCallback(() => {
    if (msg && socket) {
      let message: Message = {
        clientId: socket.id,
        id: generateRandomNumber().toString(),
        text: msg,
        to: "Sala 1",
      };
      socket.emit("message", message);
    }
  }, [msg]);

  const onChangeText = (value: string) => {
    setMsg(value);
  };

  const onChangeValue = (value: string) => {
    setRoom((prev) => ({ ...prev, name: value }));
  };

  const onCreateRoom = React.useCallback(() => {
    socket.emit("createRoom", room);
    setShowModal(false);
  }, [room]);

  const onCloseModal = React.useCallback(() => {
    setShowModal(false);
  }, []);

  const onShowModal = React.useCallback(() => {
    setShowModal(true);
  }, []);

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

  React.useEffect(() => {
    handleJoinRoom();
    handleRooms();
    handleCreateRoom();
    handleMessages();
    fetchRooms();
  }, []);

  React.useEffect(() => {
    console.log(session);
    if ((!session && status !== "loading") || status === "unauthenticated") {
      signOut({ callbackUrl: "/", redirect: true });
    }

    if (!connected && session) {
      setConnnected(true);
      console.log(session);
      syncSocket(session.user.id, socket.id, session.user.apiToken);
    }
  }, [connected, session, status]);

  return (
    <main className="flex min-h-screen flex-col items-center p-20 relative">
      {!connectedSocket ? (
        <>
          <div>
            <h1 className="text-lg">Salas</h1>
          </div>
          <div className="full-width left-20 p-10">
            <RoomModal
              onShowModal={onShowModal}
              onSuccess={onCreateRoom}
              onCancel={onCloseModal}
              onChangeValue={onChangeValue}
              showModal={showModal}
            />
          </div>
          <RoomsList rooms={rooms} joinRoom={joinRoom} />
        </>
      ) : (
        <>
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

          <div className="flex column">
            <input
              defaultValue={msg}
              value={msg}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => onChangeText(e.target.value)}
            />
            <Button onClick={sendMessage} label="Enviar" />
          </div>
        </>
      )}
    </main>
  );
}
