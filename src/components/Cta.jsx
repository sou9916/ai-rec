"use client";
import { motion } from "framer-motion";

const Cta = () => {
  const handleGetStarted = () => {
    // Replace with your navigation logic
    console.log("Navigate to dashboard");
  };

  const handleLearnMore = () => {
    console.log("Navigate to learn more");
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-50/30 via-white to-indigo-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Main CTA Card */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          {/* Main card with gloss effect */}
          <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-indigo-50/60 backdrop-blur-xl border border-white/50 group-hover:border-white/70 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 p-12 text-center overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            
            {/* Gloss effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-40"></div>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl"></div>
            
            {/* Moving shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out"></div>
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-semibold text-sm mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
                Start Your Journey
              </motion.div>

              {/* Heading */}
              <motion.h2
                className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Ready to Make
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Smarter Decisions?
                </span>
              </motion.h2>

              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6" />

              {/* Description */}
              <motion.p
                className="text-xl text-gray-700 font-medium leading-relaxed mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Join thousands of users who trust AiRec for accurate, personalized recommendations that transform their decision-making process.
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8 "
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {/* Primary button with gloss */}
                <motion.button
                  onClick={handleGetStarted}
                  className="relative group/btn overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started Free</span>
                  {/* Button gloss effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/20 rounded-full blur-sm"></div>
                  {/* Button shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"></div>
                  </div>
                </motion.button>

                {/* Secondary button with gloss */}
                <motion.button
                  onClick={handleLearnMore}
                  className="relative group/btn overflow-hidden bg-gradient-to-br from-white/90 to-indigo-50/60 backdrop-blur-sm border-2 border-indigo-300 hover:border-purple-400 text-indigo-700 hover:text-purple-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Learn More</span>
                  {/* Secondary button gloss */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-60 rounded-full"></div>
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"></div>
                  </div>
                </motion.button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  No credit card required
                </div>
                <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Free 14-day trial
                </div>
                <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  500+ happy customers
                </div>
              </motion.div>
            </div>

            {/* Bottom reflection */}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white/10 to-transparent rounded-b-3xl"></div>
          </div>
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {[
            { number: "10K+", label: "Active Users", delay: 0.1 },
            { number: "94%", label: "Accuracy Rate", delay: 0.2 },
            { number: "<50ms", label: "Response Time", delay: 0.3 }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, duration: 0.6 }}
            >
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:from-indigo-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">
                {stat.number}
              </div>
              <div className="text-sm font-semibold text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-32 right-24 w-4 h-4 bg-indigo-400 rounded-full opacity-60"
        animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-16 w-3 h-3 bg-purple-400 rounded-full opacity-60"
        animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-12 w-2 h-2 bg-pink-400 rounded-full opacity-60"
        animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
    </section>
  );
};

export default Cta;