console.log(">>> SERVER FILE LOADED <<<");

import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import http from "http";
import { GoogleGenAI } from "@google/genai";



import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const PORT = 5000;

// Create HTTP server manually
const server = http.createServer(app);

// Attach WebSocket to the same server
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


/// chat support
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
console.log(process.env.GEMINI_API_KEY);
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // convert chat history → plain text prompt
    const prompt = messages
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // stable + cheap + fast
      contents: prompt
    });

    res.json({
      role: "assistant",
      content: response.text
    });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: err.message });
  }
});


server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


/*
webSocket.begin("YOUR_LAPTOP_IP", 5000, "/");


*/