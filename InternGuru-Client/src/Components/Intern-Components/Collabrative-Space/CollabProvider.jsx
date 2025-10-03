import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useGetKanbanTasksQuery } from "../../../Store/app-api-slice";

const CollabContext = createContext();

export const CollabProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("connect", () => {
        console.log("✅ Connected with ID:", socketRef.current.id);
        setSocket(socketRef.current);
      });
      socketRef.current.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
    console.log(onlineUsers)

    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🧹 Socket connection cleaned up");
      }
    };
  }, []);

  console.log(socket);
  return (
    <CollabContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </CollabContext.Provider>
  );
};

export const useCollab = () => useContext(CollabContext);

