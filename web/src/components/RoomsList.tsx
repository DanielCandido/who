import { Room } from "@/@types";
import React from "react";

interface Props {
  rooms: Room[];
  joinRoom: (id: string) => void;
}

const RoomsList: React.FC<Props> = ({ joinRoom, rooms }) => {
  return (
    <div className="relative overflow-x-auto">
      {rooms.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Room name
              </th>
              <th scope="col" className="px-6 py-3">
                Number players
              </th>
              <th scope="col" className="px-6 py-3">
                Private
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {room.name}
                </th>
                <td className="px-6 py-4">4/6</td>
                <td className="px-6 py-4">Yes</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => joinRoom(room.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Join
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <h1>Lista vazia</h1>
        </div>
      )}
    </div>
  );
};

export default RoomsList;
