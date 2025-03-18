
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import JWT
const mongoose = require("mongoose");
const http = require('http');
const { Server } = require('socket.io');
const adminRoutes = require('./routes/admin'); 
const eventRoutes = require('./routes/event');
const userRoutes = require('./routes/user');
const financeRoutes = require('./routes/finance');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
  

app.use(express.json());
app.use(cors());


app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/finance", financeRoutes);
app.use("/chat", chatRoutes(io)); // Pass io to chat routes

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
