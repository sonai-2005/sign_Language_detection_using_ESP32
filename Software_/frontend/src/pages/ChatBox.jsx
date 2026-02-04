import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../api/chat";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessage(newMessages);
      setMessages([...newMessages, reply]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col flex-1">

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm 
              ${m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "mr-auto bg-gray-200 text-gray-900"}`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-gray-200 px-4 py-2 rounded-lg text-sm">
            typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
        />

        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 active:scale-95 transition"
        >
          Send
        </button>
      </div>

    </div>
  );
}
