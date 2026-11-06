"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Bubble percakapan Neo-Pop dengan tombol salin untuk pesan AI
export default function ChatBubble({
  role,
  content,
  streaming = false,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[92%] sm:max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={
            isUser
              ? "bg-[#141413] text-white border-2 border-[#141413] shadow-[3px_3px_0px_#B8F348] rounded-2xl rounded-br-md px-4 py-3"
              : "bg-white text-[#141413] border-2 border-[#141413] shadow-[3px_3px_0px_#141413] rounded-2xl rounded-bl-md px-4 py-3"
          }
        >
          <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
            {content}
            {streaming && <span className="inline-block w-2 h-4 ml-1 align-middle bg-[#FF5E4D] animate-pulse" />}
          </p>
        </div>
        {!isUser && content && !streaming && (
          <button
            type="button"
            onClick={copyText}
            className="text-[11px] font-bold text-[#52514E] hover:text-[#141413] underline underline-offset-2 decoration-2 px-1"
          >
            {copied ? "Disalin" : "Salin"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
