
import { motion } from "framer-motion";

const founders = [
  { 
    img: "../src/assets/image (3).png", 
    alt: "Rohit R Bhat", 
    name: "Rohit R Bhat", 
    role: "Co-Founder & CTO",
    tagline: "Shaping the big picture with bold ideas."
  },
  { 
    img: "../src/assets/image.png", 
    alt: "Sai Vinyas BS", 
    name: "Sai Vinyas BS", 
    role: "Co-Founder & CEO",
    tagline: "Turning complex code into seamless experiences."
  },
  { 
    img: "../src/assets/image (1).png", 
    alt: "Sourabh V Katti", 
    name: "Sourabh V Katti", 
    role: "Co-Founder & Financial Head",
    tagline: "Keeping the engine running at full speed."
  },
  { 
    img: "../src/assets/image (2).png", 
    alt: "Sachidanand NC", 
    name: "Sachidanand NC", 
    role: "Co-Founder & Operation Head",
    tagline: "Inventing features users didn't know they needed."
  },
  { 
    img: "../src/assets/image (5).png", 
    alt: "Saiyam Bothra", 
    name: "Saiyam Bothra", 
    role: "Co-Founder &  Tech Lead",
    tagline: "Making it work all the time."
  }
];

export default function AboutUS() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Heading */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Meet Our Founders
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Visionaries behind the journey — building, innovating, and inspiring together.
          </p>
        </motion.div>

        {/* Modern Flow Layout */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">
          {founders.map((f, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* Profile image with glow */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-indigo-200 hover:ring-indigo-400 transition-all duration-500">
                <img
                  src={f.img}
                  alt={f.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Name & Role */}
              <h3 className="mt-5 text-lg md:text-xl font-semibold text-gray-900">{f.name}</h3>
              <p className="text-indigo-600 font-medium text-sm md:text-base ">{f.role}</p>
              <span className="w-12 h-0.5 bg-indigo-300 rounded-full mt-3"></span>
              <p className="mt-3 text-gray-500 text-sm italic max-w-xs">"{f.tagline}"</p>

              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
