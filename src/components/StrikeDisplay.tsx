import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface StrikeDisplayProps {
  count: number;
}

export function StrikeDisplay({ count }: StrikeDisplayProps) {
  return (
    <div className="flex gap-4 justify-center items-center h-32">
      <AnimatePresence>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            className="bg-red-600 p-2 rounded-lg border-4 border-white shadow-xl"
          >
            <X className="w-16 h-16 text-white stroke-[4px]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
