import "dotenv/config";

import { createServer } from "node:http";
import app from "./app.js";
import { Server } from "socket.io";
import { generateGeminiResponse, streamGeminiResponse } from "./gemini.js";

const port = Number(process.env.PORT) || 3000;

const server = createServer(app);

const io = new Server(server, {
    cors:{
        origin:process.env.FRONTEND_URL
    }
})

//listen to client connections
io.on('connection',(socket)=>{
    console.log("A client connected: ", socket.id);

    //listen for client disconnections
    socket.on('disconnect',()=>{
        console.log("A client disconnected: ", socket.id)
    })

    socket.on('send-message', async (data:{message?: unknown})=>{
      const message = data?.message;
      //validate incoming message;
      if(typeof message !=="string" || !message.trim()) {
        socket.emit("chat-error",{
            message:"Please provide a valid message"
        });
        return;
      }
      try{
        console.log("Message Received: ",message);
        //get response from gemini stream
        const responseStream = streamGeminiResponse(message);

        //receive and forward each chunk
        for await (const chunk of responseStream) {
            socket.emit('ai-response-chunk',{
                chunk
            })
        }

        //notify angular that streaming is complete
        socket.emit("ai-response-complete");

        console.log("Gemini response completed")

      }catch(error:unknown) {
        console.log("Gemini API Error: ",error);

        socket.emit("chat-error",{
            message:"Gemini is temporarily unavailable. please try again."
        });

      }
    }) 
})

server.listen(port,()=>{
    console.log(` Server is running on port ${port}`)
})