import { motion } from "framer-motion";

const founders = [
  { 
    img: "../src/assets/image (3).png", 
    alt: "Rohit R Bhat", 
    name: "Rohit R Bhat", 
    role: "Co-Founder & CTO",
    tagline: "Architecting the future of intelligent systems with cutting-edge technology.",
    tech: "AI Architecture"
  },
  { 
    img: "../src/assets/image.png", 
    alt: "Sai Vinyas BS", 
    name: "Sai Vinyas BS", 
    role: "Co-Founder & CEO",
    tagline: "Leading the revolution in personalized recommendation frameworks.",
    tech: "Strategic Vision"
  },
  { 
    img: "../src/assets/image (1).png", 
    alt: "Sourabh V Katti", 
    name: "Sourabh V Katti", 
    role: "Co-Founder & Financial Head",
    tagline: "Optimizing resource allocation for maximum technological impact.",
    tech: "Growth Strategy"
  },
  { 
    img: "../src/assets/image (2).png", 
    alt: "Sachidanand NC", 
    name: "Sachidanand NC", 
    role: "Co-Founder & Operation Head",
    tagline: "Orchestrating seamless operations across complex AI ecosystems.",
    tech: "System Operations"
  },
  { 
    img: "../src/assets/image (5).png", 
    alt: "Saiyam Bothra", 
    name: "Saiyam Bothra", 
    role: "Co-Founder & Tech Lead",
    tagline: "Transforming theoretical AI concepts.",
    tech: "Technical Excellence"
  }
];

export default function AboutUS() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Heading */}
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
            Innovation Leaders
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Founding
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Architects
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4" />
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Pioneering minds behind the AR Recommendation Framework — where artificial intelligence meets human insight to create transformative solutions.
          </p>
        </motion.div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-6">
          {founders.map((f, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center relative group"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              {/* Enhanced Profile Card with glassmorphism */}
              <motion.div
                className="bg-gradient-to-br from-white/70 via-white/50 to-indigo-50/30 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 relative overflow-hidden hover:shadow-3xl transition-all duration-500 w-full max-w-xs"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(99, 102, 241, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
                
                <div className="relative z-10">
                  {/* Enhanced Profile image with multiple effects */}
                  <div className="relative mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur group-hover:blur-lg transition-all duration-300" />
                    <div className="relative w-24 h-24 md:w-28 md:h-28 md:left-7 rounded-full overflow-hidden bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-xl border-4 border-white/50 shadow-xl">
                      <img
                        src={f.img}
                        alt={f.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Tech badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-indigo-100/70 backdrop-blur-sm border border-indigo-200/50 rounded-full text-indigo-700 font-bold text-xs mb-4 uppercase tracking-wider">
                    {f.tech}
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-900 transition-colors">
                    {f.name}
                  </h3>
                  
                  <p className="text-indigo-600 font-semibold text-sm mb-4 uppercase tracking-wide">
                    {f.role}
                  </p>

                  {/* Enhanced divider */}
                  <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 group-hover:w-16 transition-all duration-300" />
                  
                  {/* Enhanced tagline */}
                  <p className="text-gray-600 text-sm leading-relaxed font-medium italic">
                    "{f.tagline}"
                  </p>

                  {/* Subtle accent elements */}
                  <div className="flex justify-center space-x-1 mt-4">
                    <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-200" />
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-400" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          className="text-center mt-16 pt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-200/50 rounded-full text-indigo-700 font-semibold text-sm mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2 animate-pulse" />
            Building Tomorrow's Intelligence, Today
          </motion.div>
          
          <p className="text-gray-600 text-lg font-medium max-w-2xl mx-auto">
            Combined decades of experience in AI, machine learning, and enterprise software development, united by a vision to democratize intelligent recommendations.
          </p>

          {/* Stats */}
          <motion.div
            className="flex justify-center items-center gap-8 mt-8 flex-wrap text-sm font-semibold text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2" />
              <span>10+ Years Combined Experience</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2" />
              <span>100+ AI Models Deployed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full mr-2" />
              <span>Global Enterprise Clients</span>
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
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </section>
  );
}