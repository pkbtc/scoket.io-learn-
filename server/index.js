import express from "express";
import { Server } from "socket.io";
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
const secretKey="secret";
const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
 const user=false;
 io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,(err)=>{
        if(err) return next(err);

        const token=socket.request.cookies.token;
        if(!token){
            return next(new Error("Authentication error"));

        }
        const decoed=jwt.verify(token,secretKey);
        next();

    })
   
 })
io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    // socket.on("join-room", (room) => {
    //     socket.join(room);
    //     console.log(`User ${socket.id} joined room ${room}`);
    // });
    socket.on("join-room",(room)=>{
        socket.join(room);
    })

    socket.on("message", (data) => {
        console.log(data);
        socket.to(data.room).emit("message-receive", data.message);
    });
});
app.get('/login',(req,res)=>{
    const token=jwt.sign({_id:"abc123"},secretKey);
        
    res.cookie("token",token,{
        httpOnly:true,secure:true,sameSite:"none"}).json({message:"logged in"});
})
app.get('/', (req, res) => {
    res.send("hello");
});


const port = 3000;
server.listen(port, () => console.log(`server is running on port ${port}`));
