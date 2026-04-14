import { motion } from 'motion/react';

interface ConfettiProps {
  count?: number;
}

export const Confetti = ({ count = 60 }: ConfettiProps) => {
  const colors = ['#FFD700', '#FF4500', '#1E90FF', '#32CD32', '#FF69B4', '#FFFFFF'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 8 + 4;
        const duration = Math.random() * 3 + 3;
        const delay = Math.random() * 5;
        const left = Math.random() * 100;
        const rotationDirection = Math.random() > 0.5 ? 1 : -1;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              top: -20, 
              left: `${left}%`,
              rotate: 0,
              scale: 0,
              opacity: 1
            }}
            animate={{ 
              top: '110%',
              rotate: 360 * 3 * rotationDirection,
              left: `${left + (Math.random() * 20 - 10)}%`,
              scale: [0, 1, 1, 0.8],
              opacity: [1, 1, 1, 0]
            }}
            transition={{ 
              duration: duration, 
              repeat: Infinity,
              ease: "linear",
              delay: delay
            }}
            className="absolute rounded-sm shadow-sm"
            style={{ 
              width: size, 
              height: size, 
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              zIndex: 100 + i
            }}
          />
        );
      })}
    </div>
  );
};
