import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.15 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <style jsx>{`
        @keyframes navGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <motion.nav
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 12,
          duration: 1.4,
          ease: "easeOut",
          delay: 0.3,
        }}
        className="fixed left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] z-50 transition-all duration-300"
        style={{ top: "1rem" }}
      >
        {/* Gradient border container */}
        <div className="relative group">
          {/* Animated gradient border */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              scrolled
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm"
                : "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-15 blur-sm"
            } bg-[length:200%_200%] animate-[navGradient_6s_ease_infinite]`}
          />

          {/* Main navbar */}
          <div
            className={`relative transition-all duration-300 rounded-full ${
              scrolled
                ? "bg-white/90 backdrop-blur-xl shadow-2xl border border-white/60"
                : "bg-white/70 backdrop-blur-xl shadow-xl border border-white/40"
            } m-0.5`}
          >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
              {/* Enhanced Logo */}
              <Link
                to="/"
                className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                AiRec
              </Link>

              {/* Enhanced Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <Link
                  to="/features"
                  className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-300 relative group"
                >
                  Features
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>

                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-300 relative group"
                >
                  Pricing
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>

                <Link
                  to="/about"
                  className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-300 relative group"
                >
                  About Us
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>

                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-300 relative group"
                >
                  Contact
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </div>

              {/* Enhanced Auth Buttons */}
              <div className="hidden md:flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-indigo-600 font-semibold cursor-pointer transition-colors duration-300"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold cursor-pointer transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </motion.button>
              </div>

              {/* Enhanced Mobile Menu Button */}
              <div className="md:hidden">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="relative w-8 h-8 flex flex-col justify-center items-center rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors duration-300"
                >
                  <motion.span
                    animate={
                      mobileOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }
                    }
                    className="block h-0.5 w-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="block h-0.5 w-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded mt-1"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    animate={
                      mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 4 }
                    }
                    className="block h-0.5 w-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded mt-1"
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Mobile menu content */}
            <motion.div
              className="fixed top-25 left-4 right-4 z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {/* Gradient border for mobile menu */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm rounded-3xl" />

                <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 m-0.5">
                  <div className="flex flex-col space-y-4">
                    {/* Links */}
                    <motion.div variants={itemVariants}>
                      <a
                        href="#features"
                        className="block text-gray-700 hover:text-indigo-600 text-lg font-semibold py-2 transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        Features
                      </a>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <a
                        href="#pricing"
                        className="block text-gray-700 hover:text-indigo-600 text-lg font-semibold py-2 transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        Pricing
                      </a>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <a
                        href="#about"
                        className="block text-gray-700 hover:text-indigo-600 text-lg font-semibold py-2 transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        About Us
                      </a>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <a
                        href="#contact"
                        className="block text-gray-700 hover:text-indigo-600 text-lg font-semibold py-2 transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        Contact
                      </a>
                    </motion.div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent my-4" />

                    {/* Auth buttons */}
                    <div className="flex flex-col gap-3">
                      <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-gray-700 hover:text-indigo-600 text-lg font-semibold py-3 transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign In
                      </motion.button>

                      <motion.button
                        variants={itemVariants}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign Up
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
