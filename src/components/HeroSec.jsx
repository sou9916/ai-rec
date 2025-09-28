"use client";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Import your local images
import musicImg from "../assets/images/music.jpg";
import moviesImg from "../assets/images/movies.jpg";
import booksImg from "../assets/images/books.jpg";
import tvImg from "../assets/images/tv.jpg";
import ecommerceImg from "../assets/images/e-commerce.jpg";
import gamesImg from "../assets/images/games.jpg";
import foodImg from "../assets/images/food.jpg";

const categories = [
  {
    label: "Music",
    desc: "AI-powered playlist curation",
    img: musicImg,
    tech: "Neural Filtering",
  },
  {
    label: "Movies",
    desc: "Cinematic taste prediction",
    img: moviesImg,
    tech: "Deep Learning",
  },
  {
    label: "Books",
    desc: "Literary preference mapping",
    img: booksImg,
    tech: "NLP Analysis",
  },
  {
    label: "TV Shows",
    desc: "Binge-worthy series detection",
    img: tvImg,
    tech: "Behavioral AI",
  },
  {
    label: "E-commerce",
    desc: "Smart product suggestions",
    img: ecommerceImg,
    tech: "Collaborative Filtering",
  },
  {
    label: "Gaming",
    desc: "Next-gen game discovery",
    img: gamesImg,
    tech: "Player Profiling",
  },
  {
    label: "Cuisine",
    desc: "Flavor profile optimization",
    img: foodImg,
    tech: "Taste Analytics",
  },
];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9, rotate: 6 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 6,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15 },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const HeroSec = () => {
  const navigate = useNavigate();
  const mid = Math.ceil(categories.length / 2);
  const col1Items = categories.slice(0, mid);
  const col2Items = categories.slice(mid);

  const col1Ref = useRef(null);
  const col2Ref = useRef(null);

  useEffect(() => {
    // Simulate GSAP animations with CSS animations
    const animateColumn = (ref, direction) => {
      if (!ref.current) return;

      const element = ref.current;
      const height = element.scrollHeight / 2;

      element.style.animation = `scroll${direction} 15s linear infinite`;
      element.style.setProperty("--scroll-distance", `${height}px`);
    };

    animateColumn(col1Ref, "Down");
    animateColumn(col2Ref, "Up");

    // Add CSS keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes scrollDown {
        0% { transform: translateY(0); }
        100% { transform: translateY(var(--scroll-distance)); }
      }
      @keyframes scrollUp {
        0% { transform: translateY(0); }
        100% { transform: translateY(calc(-1 * var(--scroll-distance))); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const Card = ({ item }) => (
    <motion.div
      className="w-24 h-36 sm:w-32 sm:h-44 md:w-44 md:h-60 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-xl border border-gray-200/50 flex flex-col items-center text-center p-2 sm:p-4 -rotate-6 backdrop-blur-sm relative overflow-hidden group"
      whileHover={{
        scale: 1.08,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)",
        rotate: -3,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 w-full">
        <img
          src={item.img}
          alt={item.label}
          className="w-full h-12 sm:h-16 md:h-24 object-cover rounded-2xl mb-2 shadow-md"
        />

        <div className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-1">
          {item.label}
        </div>

        <div className="text-[8px] sm:text-[9px] md:text-xs text-indigo-600 font-dancing mb-1 uppercase tracking-wider">
          {item.tech}
        </div>

        <p className="text-[8px] sm:text-[9px] md:text-xs text-gray-600 leading-tight">
          {item.desc}
        </p>
      </div>
    </motion.div>
  );

  return (
    <section className="relative h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* LEFT SIDE */}
      <motion.div
        className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-6 z-10 relative"
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-medium text-xs sm:text-sm mb-6 self-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse font-dancing" />
          Advanced AI Framework
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-2"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
          style={{ fontFamily: "Outfit, Noto Sans, sans-serif" }}
        >
          <span className="bg-gradient-to-r from-blue-700 via-indigo-900 to-purple-900 bg-clip-text text-transparent ">
            Ai
          </span>
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Recommendation
          </span>
          <br />
          <span className="text-gray-800">Framework</span>
        </motion.h1>

        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.8, duration: 1 }}
        />

        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-xl leading-relaxed font-medium mb-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1.4, ease: "easeOut" }}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Revolutionizing decision-making across industries with{" "}
          <span className="text-indigo-600 font-bold">cutting-edge AI</span>,{" "}
          <span className="text-purple-600 font-bold">machine learning</span>,
          and{" "}
          <span className="text-pink-600 font-bold">predictive analytics</span>.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 text-base shadow-xl cursor-pointer flex items-center justify-center group"
          >
            <span>Access Framework</span>
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl font-bold transition-all duration-300 text-base shadow-lg cursor-pointer flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 015 0H17m-5-2.5v11"
              />
            </svg>
            View Documentation
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap gap-6 text-sm font-semibold text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <span>99.2% Accuracy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <span>7+ Industries</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
            <span>Real-time Processing</span>
          </div>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex justify-center items-center relative overflow-hidden py-6">
        {/* Enhanced fade overlays */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent z-20" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-20" />

        {/* Rotated container with motion */}
        <motion.div
          className="flex gap-4 md:gap-8 rotate-6 origin-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Column 1 */}
          <motion.div
            ref={col1Ref}
            className="flex flex-col gap-4 md:gap-8"
            variants={columnVariants}
          >
            {[...col1Items, ...col1Items].map((item, idx) => (
              <Card key={`col1-${idx}`} item={item} />
            ))}
          </motion.div>

          {/* Column 2 */}
          <motion.div
            ref={col2Ref}
            className="flex flex-col gap-4 md:gap-8"
            variants={columnVariants}
          >
            {[...col2Items, ...col2Items].map((item, idx) => (
              <Card key={`col2-${idx}`} item={item} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-20 w-4 h-4 bg-indigo-400 rounded-full opacity-60"
        animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-3 h-3 bg-purple-400 rounded-full opacity-60"
        animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </section>
  );
};

export default HeroSec;
