"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useStream } from "@langchain/react";
import ReactMarkdown from "react-markdown";
import { Sparkles, ShoppingCart, Square, MoreVertical, X, Send } from "lucide-react";

import { ChatProductCard } from "./chat-product-card";
import { extractProducts } from "./chat-products";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stream = useStream({
    apiUrl: "http://localhost:2024",
    assistantId: "chat",
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stream.messages]);

  const toolCalls = useMemo(() => stream.toolCalls ?? [], [stream.toolCalls]);
  const products = useMemo(() => extractProducts(toolCalls), [toolCalls]);

  const handleSubmit = (text: string) => {
    const token = localStorage.getItem("zyro-token") || undefined;
    stream.submit(
      { messages: [{ type: "human", content: text }] },
      { context: { token } } as any
    );
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <div className="bg-[#1a1a1a] text-white text-sm px-4 py-2 rounded-full shadow-lg">
            Pick up where you left off
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-[#1a1a1a] pl-2 pr-4 py-2 rounded-full shadow-lg hover:bg-[#222] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black animate-spin-slow" />
            </div>
            <span className="text-white text-sm font-medium">Shop Best Sellers</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[600px] bg-[#1a1a1a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="text-white font-semibold text-sm">Zyor Assistant</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <ShoppingCart className="w-4 h-4" />
              <Square className="w-4 h-4" />
              <MoreVertical className="w-4 h-4" />
              <button onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {stream.messages
              .filter((msg) => {
                const type = msg.type || msg.getType?.();
                return type === "human" || type === "ai";
              })
              .map((msg, i) => {
                const isHuman = msg.type === "human" || msg.getType?.() === "human";
                const content = typeof msg.content === "string"
                  ? msg.content
                  : Array.isArray(msg.content)
                    ? msg.content.map((b: any) => b.text ?? "").join("")
                    : "";

                return (
                  <div
                    key={i}
                    className={`flex ${isHuman ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${isHuman
                          ? "bg-[#2a2a2a] text-white rounded-br-md"
                          : "text-white/90"
                        }`}
                    >
                      {isHuman ? (
                        content
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_li]:mb-1 [&_strong]:text-white [&_a]:text-blue-400">
                          <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            {stream.isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 px-4 py-3">
                  <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}

            {products.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {products.map((product) => (
                  <ChatProductCard key={product.slug || product.id} product={product} />
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const text = (e.target as HTMLFormElement).elements.namedItem("msg") as HTMLInputElement;
              if (text.value.trim()) {
                handleSubmit(text.value.trim());
                text.value = "";
              }
            }}
            className="p-3 border-t border-white/10"
          >
            <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-full px-4 py-2">
              <input
                name="msg"
                placeholder="Message Zainab Chottani AI"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={stream.isLoading}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center disabled:opacity-40"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
