import { motion } from "framer-motion";

const features = [
  {
    icon: "🤖",
    title: "Neural Learning Engine",
    desc: "Advanced deep learning algorithms that continuously evolve and adapt to user behavior patterns for hyper-personalized recommendations.",
    tech: "Deep Neural Networks"
  },
  {
    icon: "📊",
    title: "Predictive Analytics Suite",
    desc: "Real-time data processing with machine learning models that identify emerging trends and preference shifts before they happen.",
    tech: "ML Forecasting"
  },
  {
    icon: "⚡",
    title: "Quantum-Speed Processing",
    desc: "Sub-millisecond response times powered by optimized algorithms and distributed computing architecture.",
    tech: "Edge Computing"
  },
  {
    icon: "🔄",
    title: "Universal API Framework",
    desc: "Seamless integration with any platform through RESTful APIs, GraphQL endpoints, and SDK libraries.",
    tech: "Multi-Protocol"
  },
  {
    icon: "🛡️",
    title: "Zero-Trust Security",
    desc: "Military-grade encryption with federated learning ensures data privacy while maintaining recommendation accuracy.",
    tech: "Federated AI"
  },
  {
    icon: "📱",
    title: "Omnichannel Deployment",
    desc: "Deploy across web, mobile, IoT devices, and AR/VR platforms with consistent performance and user experience.",
    tech: "Cross-Platform"
  },
];

export const Features = () => {
  return (
    <section className="relative py-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 font-semibold text-sm mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse" />
            Framework Capabilities
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Powered by
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Next-Gen AI
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4" />
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Enterprise-grade recommendation engine built for scalability, precision, and real-world performance across industries.
          </p>
        </motion.div>

        {/* Enhanced Path line with glassmorphism */}
        <div className="absolute left-1/2 top-48 bottom-16 w-1 bg-gradient-to-b from-transparent via-indigo-300/50 to-purple-400/50 -translate-x-1/2 rounded-full backdrop-blur-sm" />

        {/* Features Grid */}
        <div className="space-y-16 relative">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Enhanced Icon bubble with glassmorphism */}
              <motion.div 
                className="flex-shrink-0 relative group"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur group-hover:blur-lg transition-all duration-300" />
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-white/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-xl border border-white/50 shadow-xl text-3xl flex items-center justify-center text-indigo-600 z-10">
                  {f.icon}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>

              {/* Enhanced Text card with glassmorphism */}
              <motion.div 
                className="bg-gradient-to-br from-white/70 via-white/50 to-indigo-50/30 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 max-w-md relative overflow-hidden group hover:shadow-3xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(99, 102, 241, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                
                <div className="relative z-10">
                  {/* Tech badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-indigo-100/70 backdrop-blur-sm border border-indigo-200/50 rounded-full text-indigo-700 font-bold text-xs mb-4 uppercase tracking-wider">
                    {f.tech}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-900 transition-colors">
                    {f.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {f.desc}
                  </p>

                  {/* Subtle accent line */}
                  <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-4 group-hover:w-16 transition-all duration-300" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <motion.div
          className="text-center mt-16 pt-12 border-t border-gradient-to-r from-transparent via-indigo-200/50 to-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/50 rounded-full text-indigo-700 font-semibold text-sm mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2 animate-pulse" />
            Ready to Experience the Future?
          </motion.div>
          
          <p className="text-gray-600 text-lg font-medium">
            Join leading enterprises leveraging Ai Framework for intelligent decision-making
          </p>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-24 right-24 w-3 h-3 bg-indigo-400 rounded-full opacity-60"
        animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-16 w-2 h-2 bg-purple-400 rounded-full opacity-60"
        animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </section>
  );
};