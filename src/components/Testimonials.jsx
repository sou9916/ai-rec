"use client";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "AR Framework revolutionized our recommendation engine. The neural learning capabilities delivered 94% accuracy improvement within weeks of deployment.",
    name: "Dr. Priya Sharma",
    role: "Chief Data Scientist, TechNova Labs",
    company: "Enterprise AI",
    rating: 5,
    span: "md:col-span-2",
  },
  {
    text: "The quantum-speed processing is phenomenal. Real-time recommendations across millions of users without latency.",
    name: "Arjun Mehta",
    role: "CTO, StartUpHub",
    company: "Fintech",
    rating: 5,
  },
  {
    text: "We've seen 300% ROI since implementing AR Framework. The predictive analytics suite identified market trends 6 months ahead of competitors. Game-changing technology.",
    name: "Neha Kapoor",
    role: "VP Operations, FinEdge",
    company: "Financial Services",
    rating: 5,
    span: "md:row-span-2",
  },
  {
    text: "Zero-trust security with federated learning exceeded our compliance requirements. Enterprise-grade solution.",
    name: "Ravi Iyer",
    role: "Security Architect",
    company: "Healthcare Tech",
    rating: 5,
  },
  {
    text: "The universal API framework integrated seamlessly with our existing infrastructure. Multi-protocol support saved months of development time.",
    name: "Ananya Rao",
    role: "CEO, BrightPath Systems",
    company: "Cloud Computing",
    rating: 5,
    span: "md:col-span-2",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Testimonials = () => {
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
            Enterprise Success Stories
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Industry
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Leaders Trust Us
            </span>
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4" />

          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Fortune 500 companies and innovative startups rely on AR Framework
            for mission-critical recommendation systems.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-4 auto-rows-[1fr]"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(99, 102, 241, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`relative group cursor-pointer flex ${t.span || ""}`}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

              {/* Main card */}
              <div className="relative flex flex-col justify-between bg-gradient-to-br from-white/80 via-white/70 to-indigo-50/50 backdrop-blur-xl border border-white/40 group-hover:border-white/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 w-full">
                {/* Background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 via-purple-500/3 to-pink-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative z-10">
                  {/* Quote icon & rating */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors duration-300">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(t.rating)].map((_, idx) => (
                        <svg
                          key={idx}
                          className="w-4 h-4 text-yellow-400 group-hover:text-yellow-500 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Text */}
                  <p className="text-gray-700 group-hover:text-gray-800 text-base leading-relaxed font-medium mb-6 transition-colors duration-300">
                    "{t.text}"
                  </p>
                </div>

                {/* Author info */}
                <div className="relative z-10 mt-auto">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-4 group-hover:via-purple-300 transition-colors duration-300" />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-900 transition-colors duration-300 text-sm">
                        {t.name}
                      </h4>
                      <p className="text-indigo-600 group-hover:text-purple-600 text-xs font-semibold mb-1 transition-colors duration-300">
                        {t.role}
                      </p>
                      <div className="inline-flex items-center px-2 py-1 bg-indigo-100/70 group-hover:bg-purple-100/70 backdrop-blur-sm rounded-full text-indigo-700 group-hover:text-purple-700 text-xs font-medium transition-all duration-300">
                        {t.company}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200 rounded-full flex items-center justify-center transition-colors duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats */}
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
            Trusted by 500+ Enterprise Clients
          </motion.div>

          <motion.div
            className="flex justify-center items-center gap-12 flex-wrap text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                94%
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Avg. Accuracy Improvement
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                300%
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Average ROI
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                &lt;50ms
              </div>
              <div className="text-sm font-semibold text-gray-600">
                Response Time
              </div>
            </div>
          </motion.div>
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
    </section>
  );
};

export default Testimonials;
