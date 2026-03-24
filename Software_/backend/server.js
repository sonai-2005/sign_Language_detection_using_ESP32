console.log(">>> SERVER FILE LOADED <<<");

import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import http from "http";
import { GoogleGenAI } from "@google/genai";


import dotenv from "dotenv";
import mongoose from "mongoose";
import { getAllData } from "./dataMongo.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
//database
mongoose.connect(process.env.MONGODB_KEY)
    .then(()=>console.log("yeah mongo listening !"))
    .catch(()=>console.log("shi$$y error as usual "));
const PORT = 5000;

//websocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on("connection", (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  console.log("Client connected from:", clientIP);

  ws.send(JSON.stringify({
    thumb: 0,
    index: 0,
    middle: 0,
    ring: 0,
    little: 0,
    gesture: " "
  }));

  ws.on("message", (message) => {
    const text = message.toString();
    console.log("From ESP32:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Bad JSON from ESP32:", text);
      return;
    }

    const safePayload = JSON.stringify({
      thumb: data.thumb ?? 0,
      index: data.index ?? 0,
      middle: data.middle ?? 0,
      ring: data.ring ?? 0,
      little: data.little ?? 0,
      gesture: data.gesture ?? "neutral"
    });

    // 👉 Broadcast ONLY to browsers, NOT back to ESP32
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(safePayload);
      }
    });
  });
});

//ai
console.log("Gemini key:", process.env.GEMINI_API_KEY);
async function correctWord(word) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Correct this possibly misspelled word in the sentence(basic words like hello how are you, what's your name this type basic so do efficiently) so. Return the corrected sentence with grammer. No explanation.::\n${word}`,
  });
  console.log(response.text);

  return response.text.trim();
}
//ai
app.post("/correct", async (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: "No word provided" });
  }

  try {
    const corrected = await correctWord(word);
    res.json({ corrected });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});
app.get("/data",async(req,res)=>{
    try{
        const data = await getAllData();
        res.json(data);
        console.log(data);
    }
    catch(err){
        res.status(500).json({error:err.message})
        console.log(err)
        }
})



server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


/*
webSocket.begin("YOUR_LAPTOP_IP", 5000, "/");


*/