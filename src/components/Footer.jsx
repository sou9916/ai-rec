import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-950 to-black overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-indigo-500/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/6 w-72 h-72 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main footer content */}
      <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid gap-8 md:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Brand */}
            <motion.div variants={itemVariants} className="group">
              <div className="relative">
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 group-hover:from-indigo-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">
                  AiRec
                </h2>
                {/* Subtle glow effect for brand */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
              </div>
              <p className="text-gray-600 leading-relaxed font-medium">
                Smarter recommendations, powered by AI — helping you make better decisions every day.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-white mb-6 relative">
                Quick Links
                <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "#features", text: "Features" },
                  { href: "#about", text: "About Us" },
                  { href: "#testimonials", text: "Testimonials" },
                  { href: "#how", text: "How It Works" }
                ].map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={link.href}
                      className="relative text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:bg-clip-text font-medium transition-all duration-300 group inline-block"
                    >
                      {link.text}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-white mb-6 relative">
                Support
                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "#faq", text: "FAQ" },
                  { href: "#contact", text: "Contact" },
                  { href: "#privacy", text: "Privacy Policy" },
                  { href: "#terms", text: "Terms of Service" }
                ].map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={link.href}
                      className="relative text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text font-medium transition-all duration-300 group inline-block"
                    >
                      {link.text}
                      <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-white mb-6 relative">
                Follow Us
                <div className="w-8 h-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full mt-2"></div>
              </h3>
              <div className="flex space-x-4">
                {[
                  { Icon: FaLinkedin, href: "#", color: "from-blue-500 to-blue-700" },
                  { Icon: FaGithub, href: "#", color: "from-gray-600 to-gray-800" },
                  { Icon: FaXTwitter, href: "#", color: "from-gray-800 to-black" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="relative group p-3 bg-gradient-to-br from-white/80 to-indigo-50/60 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Gloss effect on social buttons */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60 rounded-xl"></div>
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/20 rounded-xl blur-sm"></div>
                    
                    {/* Icon glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl blur-sm`}></div>
                    
                    <social.Icon 
                      size={20} 
                      className="relative z-10 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" 
                    />
                  </motion.a>
                ))}
              </div>

              {/* Newsletter signup */}
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <p className="text-sm text-gray-600 mb-3 font-medium">Stay updated with our latest features</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="flex-1 px-3 py-2 text-sm bg-white/70 backdrop-blur-sm border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
                  />
                  <button className="px-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-r-lg transition-all duration-300 relative overflow-hidden group">
                    <span className="relative z-10">Subscribe</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Glassmorphism divider */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative bg-white/30 backdrop-blur-sm h-px"></div>
      </div>

      {/* Bottom Bar with gloss effect */}
      <motion.div
        className="relative py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm font-medium">
              © {new Date().getFullYear()} AiRec. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <motion.div
                className="flex items-center text-gray-600 font-medium"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full mr-2 animate-pulse"></div>
                All systems operational
              </motion.div>
              
              <div className="flex items-center space-x-4">
                <a href="#privacy" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Privacy</a>
                <span className="text-gray-300">•</span>
                <a href="#terms" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Terms</a>
                <span className="text-gray-300">•</span>
                <a href="#security" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Security</a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 right-24 w-3 h-3 bg-indigo-400 rounded-full opacity-40"
        animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-16 w-2 h-2 bg-purple-400 rounded-full opacity-40"
        animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </footer>
  );
};

export default Footer;