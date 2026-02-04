import React from "react";
import ChatBox from "./ChatBox";

function ChatPage() {
  return (
    <div className="h-[50vh] w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl flex flex-col overflow-hidden">
        
        <div className="text-center font-semibold py-3 border-b">
          AI Assistant
        </div>

        <ChatBox />

      </div>
    </div>
  );
}

export default ChatPage;
