"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaRobot, FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const genAI = new GoogleGenerativeAI("AIzaSyClL5p_4B0V71tjj85JqYEXNFM4FKrnxsM");

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 320, height: 400 });

  const SYSTEM_PROMPT = `
    You are an AI chatbot named TensAI, an assistant dedicated to technology-related discussions.
    - Keep responses short and limited to a single short paragraph.
    - Avoid long explanations.
    - If you don't know something, say so.
    - Always use a polite and conversational tone.
  `;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const wantsMoreInfo = /more info|more information|details|detailed|long explanation/i.test(input);

      const prompt = wantsMoreInfo
        ? input
        : `Give a short single-paragraph answer only.\n${input}`;

      const chatHistory = newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const result = await model.generateContent({
        contents: [...chatHistory, { role: "user", parts: [{ text: prompt }] }],
      });

      const botReply =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Error fetching response";

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [...prev, { text: "Error fetching response", sender: "bot" }]);
    }

    setInput("");
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setWindowSize({ width: window.innerWidth / 2, height: window.innerHeight / 2 });
    } else {
      setWindowSize({ width: 320, height: 400 });
    }
  };

  return (
    <div>
      <button
        className="fixed bottom-5 right-5 bg-primary text-primary-foreground p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-5 bg-card shadow-lg p-4 rounded-lg border"
            style={{
              width: windowSize.width,
              height: windowSize.height,
              zIndex: 9999,
            }}
          >
            <div className="absolute top-0 left-0 p-2">
              <button
                onClick={toggleMaximize}
                className="bg-gray-300 text-gray-700 p-2 rounded-full"
              >
                {isMaximized ? <FaCompress /> : <FaExpand />}
              </button>
            </div>

            <div className="h-64 overflow-y-auto mt-8">
              {messages.map((msg, index) => {
                const formattedText = msg.text
                  .replace(/\n/g, "<br>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<li>$1</li>");

                return (
                  <div
                    key={index}
                    className={`p-2 my-1 rounded ${msg.sender === "user" ? "bg-blue-200" : "bg-secondary"}`}
                    dangerouslySetInnerHTML={{
                      __html: msg.sender === "bot" ? formattedText : msg.text,
                    }}
                  />
                );
              })}
            </div>

            <div className="flex mt-2">
              <input
                type="text"
                className="flex-grow border p-2 rounded bg-input text-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Ask TensAI..."
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-primary text-primary-foreground p-2 rounded"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
