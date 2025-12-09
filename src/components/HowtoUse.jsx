"use client";
import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Sign Up",
    desc: "Create your free account in just a few clicks.",
  },
  {
    number: "2",
    title: "Customize", 
    desc: "Set your preferences so AiRec knows exactly what to recommend.",
  },
  {
    number: "3",
    title: "Get Insights",
    desc: "Receive tailored recommendations instantly and start making smarter decisions.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HowtoUse() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-semibold text-sm mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
            Getting Started Guide
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              How It
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent relative cursor-pointer hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300">
              Works
              {/* Subtle gloss overlay for the main heading */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full opacity-0 hover:translate-x-[-200%] hover:opacity-100 transition-all duration-1000 ease-out"></div>
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4" />

          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Getting started with AiRec is quick and effortless — here's the journey.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                y: -10,
                boxShadow: "0 25px 50px rgba(99, 102, 241, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative group cursor-pointer"
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

              {/* Main card with gloss effect */}
              <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-indigo-50/60 backdrop-blur-xl border border-white/50 group-hover:border-white/70 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 overflow-hidden">
                {/* Background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 via-purple-500/3 to-pink-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Gloss effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-40"></div>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
                
                {/* Moving shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>

                <div className="relative z-10 text-center">
                  {/* Step number with gloss */}
                  <div className="relative w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                    <span className="text-2xl font-bold text-white relative z-10">
                      {step.number}
                    </span>
                    {/* Number gloss effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/30 rounded-full blur-sm"></div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-900 transition-colors duration-300 mb-4">
                    {step.title}
                  </h3>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-4 group-hover:via-purple-300 transition-colors duration-300" />
                  
                  <p className="text-gray-700 group-hover:text-gray-800 leading-relaxed font-medium transition-colors duration-300">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom reflection */}
                <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white/10 to-transparent rounded-b-2xl"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Connecting lines with glow */}
        <div className="hidden md:flex justify-center items-center mt-8 mb-8 space-x-16">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-indigo-300 to-purple-400"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-500"></div>
            <div className="w-16 h-px bg-gradient-to-r from-pink-400 to-indigo-400"></div>
          </motion.div>
        </div>

        {/* Bottom CTA section */}
        <motion.div
          className="text-center mt-16 pt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/50 rounded-full text-indigo-700 font-semibold text-sm mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2 animate-pulse" />
            Ready to Get Started?
          </motion.div>
          
          <motion.p
            className="text-lg text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Join thousands of users who've already transformed their decision-making process.
          </motion.p>
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
}