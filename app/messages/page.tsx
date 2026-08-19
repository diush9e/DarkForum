"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
};

type ChatMessage = {
  id: string;
  content: string;
  isOwn: boolean;
};

export default function MessagesPage() {
  const { data: session, status } = useSession();

  const [conversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    // سنربط الإرسال الحقيقي بقاعدة البيانات لاحقًا.
    setNewMessage("");
  }

  if (status === "loading") {
    return (
      <div className="text-center py-20 text-gray-400">
        جاري تحميل الرسائل...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto glass rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">🔒</div>

        <h1 className="text-2xl font-bold mb-3">
          يجب تسجيل الدخول
        </h1>

        <p className="text-gray-400 mb-6">
          سجّل الدخول أولًا حتى تستطيع رؤية الرسائل الخاصة.
        </p>

        <Link
          href="/auth/login"
          className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
      {/* قائمة المحادثات */}
      <aside className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-dark-400">
          <h1 className="text-2xl font-bold">الرسائل</h1>

          <p className="text-sm text-gray-400 mt-1">
            محادثاتك الخاصة
          </p>
        </div>

        <div className="divide-y divide-dark-400">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <div className="text-3xl mb-3">💬</div>

              <p>لا توجد محادثات بعد.</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setSelectedChat(conversation.id)}
                className={`w-full text-right p-4 hover:bg-dark-300 transition ${
                  selectedChat === conversation.id ? "bg-dark-300" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {conversation.name[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold truncate">
                      {conversation.name}
                    </h2>

                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* نافذة المحادثة */}
      <section className="lg:col-span-2 glass rounded-2xl overflow-hidden flex flex-col min-h-[600px]">
        {selectedChat ? (
          <>
            <div className="p-6 border-b border-dark-400">
              <h2 className="text-xl font-bold">
                المحادثة
              </h2>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  لا توجد رسائل في هذه المحادثة بعد.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isOwn ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.isOwn
                          ? "bg-primary text-white"
                          : "bg-dark-300 text-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-dark-400"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-dark-300 border border-dark-400 rounded-lg px-4 py-3 outline-none focus:border-primary transition"
                />

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  إرسال
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="text-6xl mb-5">💬</div>

            <h2 className="text-2xl font-bold mb-2">
              اختر محادثة
            </h2>

            <p className="text-gray-400">
              اختر محادثة من القائمة حتى تبدأ المراسلة.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}