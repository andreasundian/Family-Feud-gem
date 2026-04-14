import { motion, AnimatePresence } from 'motion/react';
import { Answer } from '@/src/types';

interface AnswerCardProps {
  answer: Answer;
  index: number;
  key?: number | string;
}

function AnswerCard({ answer, index }: AnswerCardProps) {
  return (
    <div className="relative h-16 w-full perspective-2000">
      <motion.div
        className="w-full h-full preserve-3d cursor-default"
        initial={false}
        animate={{ 
          rotateX: answer.revealed ? 180 : 0,
          z: answer.revealed ? 40 : 0,
        }}
        transition={{
          rotateX: { type: 'spring', damping: 12, stiffness: 90, mass: 2 },
          z: { duration: 0.2 }
        }}
      >
        {/* Front Side (Hidden) */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-feud-blue via-feud-blue to-feud-dark border-2 border-feud-gold rounded-md flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col justify-around">
            <div className="h-[1px] w-full bg-white/30" />
            <div className="h-[1px] w-full bg-white/30" />
            <div className="h-[1px] w-full bg-white/30" />
          </div>
          <div className="w-10 h-10 rounded-full bg-feud-dark border-2 border-feud-gold flex items-center justify-center text-feud-yellow font-bold text-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] z-10">
            {index + 1}
          </div>
        </div>

        {/* Back Side (Revealed) */}
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-b from-feud-yellow via-feud-yellow to-feud-gold border-2 border-feud-gold rounded-md flex items-center px-4 justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.4)] overflow-hidden"
          style={{ transform: 'rotateX(180deg)' }}
        >
          {/* Success Flash Overlay */}
          <AnimatePresence>
            {answer.revealed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 bg-white pointer-events-none z-20"
              />
            )}
          </AnimatePresence>

          {/* Correct Highlight Border */}
          <AnimatePresence>
            {answer.revealed && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, times: [0, 0.2, 1] }}
                  className="absolute inset-0 border-4 border-green-400 rounded-md z-30 pointer-events-none shadow-[inset_0_0_20px_rgba(74,222,128,0.5)]"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -20, -30], scale: [0.5, 1.2, 1, 0.8] }}
                  transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
                  className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                >
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full font-black text-sm uppercase shadow-lg border-2 border-white">
                    Correct!
                  </span>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Outer Glow on Reveal */}
          <AnimatePresence>
            {answer.revealed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0.2] }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-white/30 blur-2xl pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Metallic Shine effect on reveal */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 translate-x-[-250%]"
            animate={answer.revealed ? { translateX: ['-250%', '250%'] } : {}}
            transition={{ duration: 1.5, ease: "circOut", delay: 0.1 }}
          />
          
          <motion.span 
            initial={{ x: -40, opacity: 0 }}
            animate={answer.revealed ? { x: 0, opacity: 1 } : { x: -40, opacity: 0 }}
            transition={{ delay: 0.3, type: 'spring', damping: 15, stiffness: 100 }}
            className="text-feud-dark font-black text-lg uppercase truncate mr-2 drop-shadow-sm z-10"
          >
            {answer.text}
          </motion.span>
          
          <motion.div 
            initial={{ scale: 0, rotate: -30 }}
            animate={answer.revealed ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -30 }}
            transition={{ delay: 0.5, type: 'spring', damping: 10, stiffness: 150 }}
            className="h-full w-14 border-l-2 border-feud-gold/50 flex items-center justify-center text-feud-dark font-black text-2xl z-10"
          >
            {answer.points}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

interface GameBoardProps {
  answers: Answer[];
}

export function GameBoard({ answers }: GameBoardProps) {
  // Family Feud board usually has 2 columns of 4
  const leftCol = answers.slice(0, 4);
  const rightCol = answers.slice(4, 8);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto p-6 bg-feud-dark rounded-xl border-4 border-feud-gold shadow-2xl"
    >
      <div className="space-y-3">
        {leftCol.map((answer, i) => (
          <motion.div key={i} variants={itemVariants}>
            <AnswerCard answer={answer} index={i} />
          </motion.div>
        ))}
        {/* Fill empty slots if less than 4 */}
        {Array.from({ length: Math.max(0, 4 - leftCol.length) }).map((_, i) => (
          <motion.div key={`empty-l-${i}`} variants={itemVariants} className="h-16 w-full bg-feud-blue/30 border-2 border-feud-gold/30 rounded-md" />
        ))}
      </div>
      <div className="space-y-3">
        {rightCol.map((answer, i) => (
          <motion.div key={i + 4} variants={itemVariants}>
            <AnswerCard answer={answer} index={i + 4} />
          </motion.div>
        ))}
        {/* Fill empty slots if less than 4 */}
        {Array.from({ length: Math.max(0, 4 - rightCol.length) }).map((_, i) => (
          <motion.div key={`empty-r-${i}`} variants={itemVariants} className="h-16 w-full bg-feud-blue/30 border-2 border-feud-gold/30 rounded-md" />
        ))}
      </div>
    </motion.div>
  );
}
