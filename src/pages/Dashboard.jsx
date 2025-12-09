import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Mock Material-UI icons with simple replacements
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const MicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
  </svg>
);

const PhotoCameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2l3.07-1.87L12 9.8 8.93 13.33 12 15.2zM21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const AccountCircleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

const MusicNoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
);

const PlayArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/>
  </svg>
);

const ShuffleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
  </svg>
);

export default function Hero() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSidebarOpen(window.innerWidth >= 768);
    }
  }, []);

  // Keep your original backend logic
  const fetchRecommendations = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, k: 5 }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          category: data?.category,
          items: data?.recommendations || [],
        },
      ]);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setMessages((prev) => [
        ...prev,
        { type: "ai", items: [{ title: "😢Something went wrong." }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");
    setLoading(true);
    setTimeout(fetchRecommendations, 600);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggest = (text) => {
    setInput(text);
  };

  // Mock trending data
  const trendingAlbums = [
    { id: 1, title: "Midnights", artist: "Taylor Swift", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", plays: "2.1M" },
    { id: 2, title: "Renaissance", artist: "Beyoncé", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", plays: "1.8M" },
    { id: 3, title: "Dawn FM", artist: "The Weeknd", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop", plays: "1.5M" },
    { id: 4, title: "Sour", artist: "Olivia Rodrigo", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop", plays: "1.3M" },
    { id: 5, title: "Certified Lover Boy", artist: "Drake", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop", plays: "2.5M" },
  ];

  const suggestedPlaylists = [
    { id: 1, title: "Chill Vibes", desc: "Perfect for relaxing", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop" },
    { id: 2, title: "Workout Mix", desc: "High energy beats", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop" },
    { id: 3, title: "Focus Mode", desc: "Instrumental focus", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop" },
    { id: 4, title: "Late Night", desc: "Moody and atmospheric", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-indigo-500/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-72 h-72 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <div>
              <p className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MusicRec
              </p>
              <p className="text-sm text-gray-600 font-medium">
                Your personal music discovery
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => {
                setMessages([]);
                setInput("");
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className="relative group overflow-hidden bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 text-sm font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors duration-300">New Discovery</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60 rounded-full"></div>
            </motion.button>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <AccountCircleIcon />
            </div>
          </div>
        </div>
      </header>

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 bg-black/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static left-0 top-0 z-30 h-full md:h-auto
            w-72 transform transition-transform duration-300
            bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/60 backdrop-blur-xl border-r border-white/50 shadow-xl
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:flex md:flex-col md:gap-4 md:p-4
          `}
        >
          <div className="p-4 space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <MusicNoteIcon />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Music Library</h3>
              <p className="text-sm text-gray-600">Explore your taste</p>
            </div>
            
            <nav className="space-y-2">
              {["Discover", "My Library", "Recently Played", "Favorites", "Playlists"].map((item, index) => (
                <motion.button
                  key={item}
                  className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-white/50 to-transparent backdrop-blur-sm border border-white/30 hover:border-indigo-200 text-gray-700 hover:text-indigo-700 font-medium transition-all duration-300 group"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:scale-125 transition-transform duration-300"></div>
                    {item}
                  </div>
                </motion.button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {messages.length === 0 ? (
              <div className="space-y-12">
                {/* Hero Section */}
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-semibold text-sm mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
                    AI-Powered Music Discovery
                  </motion.div>
                  
                  <h1 className="text-5xl md:text-6xl font-black mb-6">
                    <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                      Discover Your
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Perfect Sound
                    </span>
                  </h1>
                  
                  <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6" />
                  
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                    Tell me what you're feeling, and I'll create the perfect playlist for your mood, activity, or moment.
                  </p>
                </motion.div>

                {/* Trending Section */}
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
                    <button className="text-indigo-600 hover:text-purple-600 font-semibold transition-colors duration-300">
                      View All
                    </button>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {trendingAlbums.map((album, index) => (
                      <motion.div
                        key={album.id}
                        className="relative group min-w-[200px] cursor-pointer"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => suggest(`Play ${album.title} by ${album.artist}`)}
                      >
                        <div className="relative bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                          {/* Gloss effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60 rounded-2xl"></div>
                          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/20 rounded-2xl blur-sm"></div>
                          
                          <div className="relative z-10">
                            <div className="relative mb-4">
                              <img
                                src={album.cover}
                                alt={album.title}
                                className="w-full h-40 object-cover rounded-xl shadow-md"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                                  <PlayArrowIcon />
                                </div>
                              </div>
                            </div>
                            <h3 className="font-bold text-gray-900 truncate">{album.title}</h3>
                            <p className="text-gray-600 text-sm truncate">{album.artist}</p>
                            <p className="text-indigo-600 text-xs font-semibold mt-1">{album.plays} plays</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Suggested For You */}
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Suggested For You</h2>
                    <button className="text-indigo-600 hover:text-purple-600 font-semibold transition-colors duration-300">
                      Refresh
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {suggestedPlaylists.map((playlist, index) => (
                      <motion.div
                        key={playlist.id}
                        className="relative group cursor-pointer"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                        onClick={() => suggest(`Create a playlist like ${playlist.title}`)}
                      >
                        <div className="relative bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                          {/* Gloss effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60 rounded-2xl"></div>
                          
                          <div className="relative z-10">
                            <img
                              src={playlist.cover}
                              alt={playlist.title}
                              className="w-full h-32 object-cover rounded-xl mb-3 shadow-md"
                            />
                            <h3 className="font-bold text-gray-900 mb-1">{playlist.title}</h3>
                            <p className="text-gray-600 text-sm">{playlist.desc}</p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <button className="text-indigo-600 hover:text-purple-600 transition-colors duration-300">
                                <HeartIcon />
                              </button>
                              <button className="text-indigo-600 hover:text-purple-600 transition-colors duration-300">
                                <ShuffleIcon />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <Message key={index} msg={msg} />
                ))}
                {loading && <TypingBubble />}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Music Input Composer */}
      <footer className="sticky bottom-0 backdrop-blur-xl bg-white/80 border-t border-white/50 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <motion.div
            className="flex items-end gap-3 bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-xl rounded-4xl px-4 py-3 border border-white/50 shadow-lg hover:shadow-xl focus-within:shadow-2xl transition-all duration-300 overflow-hidden"
            whileFocusWithin={{ scale: 1.02 }}
          >
            {/* Gloss effect on input */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-60 rounded-2xl pointer-events-none"></div>
            
            <button
              type="button"
              className="relative z-10 p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-500"
              aria-label="Attach image"
            >
              <PhotoCameraIcon />
            </button>

            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask for music by mood, genre, artist, or activity"
              className="relative z-10 flex-1 bg-transparent outline-none resize-none text-base leading-7 placeholder:text-gray-500 px-2 py-2 max-h-36 font-medium"
            />

            <button
              type="button"
              className="relative z-10 p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-500"
              aria-label="Voice input"
            >
              <MicIcon />
            </button>

            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="relative z-10 inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button gloss */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 rounded-full"></div>
              
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              ) : (
                <SendIcon />
              )}
            </motion.button>
          </motion.div>

          <p className="text-center text-xs text-gray-500 mt-3 font-medium">
            AI-powered music recommendations • Discover your next favorite song
          </p>
        </div>
      </footer>
    </div>
  );
}

// Keep your original components but with music styling
function Message({ msg }) {
  const isUser = msg.type === "user";

  return (
    <motion.div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser 
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
            : "bg-gradient-to-r from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 text-indigo-600"
        }`}
      >
        {isUser ? <AccountCircleIcon /> : <MusicNoteIcon />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl shadow-lg backdrop-blur-sm ${
          isUser
            ? "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100"
            : "bg-gradient-to-br from-white/90 to-indigo-50/60 border border-white/50"
        }`}
      >
        {msg.items ? (
          <AIResultBlock category={msg.category} items={msg.items} />
        ) : (
          <p className="px-4 py-3 text-sm leading-relaxed font-medium text-gray-800">{msg.text}</p>
        )}
      </div>
    </motion.div>
  );
}

function AIResultBlock({ category, items }) {
  const hasCards = Array.isArray(items) && items.length > 0;

  if (!hasCards) {
    return (
      <p className="px-4 py-3 text-sm text-gray-600 font-medium">😢 No music found. Try a different search!</p>
    );
  }

  return (
    <div className="px-4 py-4">
      {category && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 px-3 py-1.5 rounded-full">
            <MusicNoteIcon />
            {String(category).charAt(0).toUpperCase() + String(category).slice(1)} Recommendations
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <MusicCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}

function MusicCard({ item }) {
  const title = item?.title || item?.track_name || "Untitled Track";
  const artist = item?.artist || item?.desc || "Unknown Artist";
  const img = item?.img || item?.poster || item?.image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop";

  return (
    <motion.div 
      className="group relative bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gloss effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60 rounded-2xl"></div>
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/20 rounded-2xl blur-sm"></div>

      <div className="relative z-10 flex items-center p-4 gap-4">
        <div className="relative">
          <img
            src={img}
            alt={title}
            className="w-16 h-16 object-cover rounded-xl shadow-md"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 backdrop-blur-sm rounded-full p-2">
              <PlayArrowIcon />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate text-sm">{title}</h3>
          <p className="text-gray-600 text-xs truncate mt-1">{artist}</p>
          
          <div className="flex items-center gap-3 mt-2">
            <button className="text-indigo-600 hover:text-purple-600 transition-colors duration-300">
              <HeartIcon />
            </button>
            <button className="text-indigo-600 hover:text-purple-600 transition-colors duration-300">
              <ShuffleIcon />
            </button>
            {item?.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:text-purple-600 font-semibold hover:underline transition-colors duration-300"
              >
                Listen
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div 
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 text-indigo-600 flex items-center justify-center shadow-lg">
        <MusicNoteIcon />
      </div>
      <div className="bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm border border-white/50 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 relative overflow-hidden">
        {/* Gloss effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60 rounded-2xl"></div>
        
        <span className="relative z-10 w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
        <span className="relative z-10 w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:120ms]"></span>
        <span className="relative z-10 w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:240ms]"></span>
        <span className="relative z-10 ml-2 text-sm font-medium text-gray-600">Finding perfect tracks...</span>
      </div>
    </motion.div>
  );
}