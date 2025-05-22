import Kanban from "../models/kanban_model.js";

export function setupSocketHandlers(io) {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("📡 New client connected:", socket.id);

    // Online Users Handling
    socket.on("online", () => {
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });

    socket.on("join", async (username,photoURL) => {
      onlineUsers.set(socket.id,{username,photoURL});
      io.emit("onlineUsers", Array.from(onlineUsers.values()));

      // Send all tasks from DB
      const tasks = await Kanban.find({});
      socket.emit("task:list", tasks);
    });

    socket.on("notify",(username,action) => {
      io.emit("notification",username,action);
    });

    socket.on("leave", () => {
      const username = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);
      console.log(`${username || "User"} disconnected.`);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });

    // Task Create
    socket.on("task:create", async (taskData) => {
      console.log("emited");
      const created = await Kanban.create(taskData);
      const allTasks = await Kanban.find({});
      io.emit("task:list", allTasks);
    });

    // Task Delete
    socket.on("task:delete", async (id) => {
      await Kanban.findByIdAndDelete(id);
      const allTasks = await Kanban.find({});
      io.emit("task:list", allTasks);
    });

    socket.on("disconnect", () => {
      const username = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);
      console.log(`${username || "User"} disconnected.`);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });
  });
}
