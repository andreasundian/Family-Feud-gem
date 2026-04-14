/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameBoard } from './components/GameBoard';
import { StrikeDisplay } from './components/StrikeDisplay';
import { AdminPanel } from './components/AdminPanel';
import { QuestionCreator } from './components/QuestionCreator';
import { Confetti } from './components/Confetti';
import { SAMPLE_QUESTIONS, Question, GameState } from './types';
import { Trophy, Users, Settings2, Play, RotateCcw, SkipForward, Sun, Moon, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    team1Score: 0,
    team2Score: 0,
    team1Players: Array(5).fill(''),
    team2Players: Array(5).fill(''),
    team1CurrentPlayerIndex: 0,
    team2CurrentPlayerIndex: 0,
    currentRoundPoints: 0,
    strikes: 0,
    turn: 1,
    timer: 60,
    isTimerRunning: false,
    isStealInProgress: false,
    phase: 'setup',
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isTimerRunning && gameState.timer > 0 && gameState.phase === 'playing') {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
    } else if (gameState.timer === 0 && gameState.isTimerRunning) {
      setGameState(prev => ({ ...prev, isTimerRunning: false }));
      // Optional: Add logic for when timer hits zero (e.g., auto-strike)
    }
    return () => clearInterval(interval);
  }, [gameState.isTimerRunning, gameState.timer, gameState.phase]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handlePlayerNameChange = (team: 1 | 2, index: number, name: string) => {
    setGameState(prev => ({
      ...prev,
      [team === 1 ? 'team1Players' : 'team2Players']: prev[team === 1 ? 'team1Players' : 'team2Players'].map((n, i) => i === index ? name : n)
    }));
  };

  const currentQuestion = questions[gameState.currentQuestionIndex];

  const handleRevealAnswer = (index: number) => {
    if (gameState.phase !== 'playing') return;
    
    const newQuestions = [...questions];
    const answer = newQuestions[gameState.currentQuestionIndex].answers[index];
    
    if (!answer.revealed) {
      answer.revealed = true;
      setQuestions(newQuestions);
      setGameState(prev => ({
        ...prev,
        currentRoundPoints: prev.currentRoundPoints + answer.points,
        isStealInProgress: false,
        isTimerRunning: false // Stop timer on success
      }));
      // Play "Ding" sound logic here
    }
  };

  const handleAddStrike = () => {
    if (gameState.phase !== 'playing') return;
    setGameState(prev => {
      const nextStrikes = Math.min(prev.strikes + 1, 3);
      
      // Rotate player on strike
      if (prev.turn === 1) {
        return {
          ...prev,
          strikes: nextStrikes,
          isStealInProgress: false,
          isTimerRunning: false,
          team1CurrentPlayerIndex: (prev.team1CurrentPlayerIndex + 1) % 5
        };
      } else {
        return {
          ...prev,
          strikes: nextStrikes,
          isStealInProgress: false,
          isTimerRunning: false,
          team2CurrentPlayerIndex: (prev.team2CurrentPlayerIndex + 1) % 5
        };
      }
    });
    // Play "Buzzer" sound logic here
  };

  const handleResetStrikes = () => {
    setGameState(prev => ({ ...prev, strikes: 0, isStealInProgress: false }));
  };

  const handleAssignPoints = (team: 1 | 2) => {
    setGameState(prev => ({
      ...prev,
      team1Score: team === 1 ? prev.team1Score + prev.currentRoundPoints : prev.team1Score,
      team2Score: team === 2 ? prev.team2Score + prev.currentRoundPoints : prev.team2Score,
      currentRoundPoints: 0,
      isStealInProgress: false,
      phase: 'round-over'
    }));
  };

  const handleNextQuestion = () => {
    if (gameState.currentQuestionIndex < questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        strikes: 0,
        currentRoundPoints: 0,
        timer: 60,
        isTimerRunning: false,
        isStealInProgress: false,
        phase: 'playing',
        // Rotate starting team or keep it? Usually it alternates.
        turn: prev.turn === 1 ? 2 : 1
      }));
    } else {
      setGameState(prev => ({ ...prev, phase: 'game-over' }));
    }
  };

  const handleToggleTimer = () => {
    setGameState(prev => ({ ...prev, isTimerRunning: !prev.isTimerRunning }));
  };

  const handleResetTimer = (seconds: number = 60) => {
    setGameState(prev => ({ ...prev, timer: seconds, isTimerRunning: false, isStealInProgress: false }));
  };

  const handleAddQuestion = (newQuestion: Question) => {
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleSetTurn = (team: 1 | 2) => {
    setGameState(prev => ({ ...prev, turn: team, isStealInProgress: false }));
  };

  const handleRotatePlayer = (team: 1 | 2) => {
    setGameState(prev => ({
      ...prev,
      [team === 1 ? 'team1CurrentPlayerIndex' : 'team2CurrentPlayerIndex']: 
        (prev[team === 1 ? 'team1CurrentPlayerIndex' : 'team2CurrentPlayerIndex'] + 1) % 5
    }));
  };

  const handleStealTurn = () => {
    setGameState(prev => ({
      ...prev,
      turn: prev.turn === 1 ? 2 : 1,
      strikes: 0,
      isStealInProgress: true,
      timer: 30, // Give them 30 seconds to steal
      isTimerRunning: true
    }));
  };

  const startGame = () => {
    // Ensure default names if empty
    setGameState(prev => ({
      ...prev,
      team1Players: prev.team1Players.map((n, i) => n.trim() || `Player ${i + 1}`),
      team2Players: prev.team2Players.map((n, i) => n.trim() || `Player ${i + 1}`),
      phase: 'playing'
    }));
  };

  const resetGame = () => {
    setQuestions(SAMPLE_QUESTIONS.map(q => ({
      ...q,
      answers: q.answers.map(a => ({ ...a, revealed: false }))
    })));
    setGameState({
      currentQuestionIndex: 0,
      team1Score: 0,
      team2Score: 0,
      team1Players: Array(5).fill(''),
      team2Players: Array(5).fill(''),
      team1CurrentPlayerIndex: 0,
      team2CurrentPlayerIndex: 0,
      currentRoundPoints: 0,
      strikes: 0,
      turn: 1,
      timer: 60,
      isTimerRunning: false,
      isStealInProgress: false,
      phase: 'setup',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-feud-yellow selection:text-feud-dark transition-colors duration-300">
      {/* Header / Scoreboard */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-feud-yellow rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)]">
              <Trophy className="text-feud-dark w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-feud-yellow">Family Feud</h1>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Digital Edition</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-1">Team 1</p>
              <div className="bg-blue-600 px-6 py-2 rounded-lg border-2 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <span className="text-3xl font-black tabular-nums text-white">{gameState.team1Score}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Round Pot</p>
              <div className="bg-muted px-4 py-1 rounded border border-border">
                <span className="text-xl font-bold text-feud-yellow tabular-nums">{gameState.currentRoundPoints}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold mb-1">Team 2</p>
              <div className="bg-red-600 px-6 py-2 rounded-lg border-2 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                <span className="text-3xl font-black tabular-nums text-white">{gameState.team2Score}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10 text-muted-foreground hover:text-foreground"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        <AnimatePresence mode="wait">
          {gameState.phase === 'setup' ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="flex flex-col items-center justify-center py-10 space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <h2 className="text-7xl font-black italic uppercase text-feud-yellow drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">Let's Play!</h2>
                </motion.div>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">Enter the names of your 5 players for each team.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                {/* Team 1 Setup */}
                <Card className="bg-blue-600/10 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-400 uppercase italic">Team 1 Players</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {gameState.team1Players.map((name, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-blue-400 font-bold w-4">{i + 1}</span>
                        <Input
                          placeholder={`Player ${i + 1} Name`}
                          value={name}
                          onChange={(e) => handlePlayerNameChange(1, i, e.target.value)}
                          className="bg-background/50 border-blue-500/20"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Team 2 Setup */}
                <Card className="bg-red-600/10 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-400 uppercase italic">Team 2 Players</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {gameState.team2Players.map((name, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-red-400 font-bold w-4">{i + 1}</span>
                        <Input
                          placeholder={`Player ${i + 1} Name`}
                          value={name}
                          onChange={(e) => handlePlayerNameChange(2, i, e.target.value)}
                          className="bg-background/50 border-red-500/20"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Button size="lg" onClick={startGame} className="bg-feud-yellow text-feud-dark hover:bg-feud-gold font-black text-2xl px-16 py-10 rounded-2xl shadow-[0_10px_30px_rgba(255,215,0,0.3)] transition-all hover:scale-110 active:scale-95">
                <Play className="w-8 h-8 mr-3 fill-current" /> START GAME
              </Button>
            </motion.div>
          ) : gameState.phase === 'game-over' ? (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-8 relative"
            >
              <Confetti />
              
              <div className="text-center space-y-6 z-10">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    rotate: [0, 10, -10, 0],
                    filter: ["drop-shadow(0 0 0px rgba(255,215,0,0))", "drop-shadow(0 0 30px rgba(255,215,0,0.8))", "drop-shadow(0 0 0px rgba(255,215,0,0))"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative"
                >
                  <Trophy className="w-40 h-40 text-feud-yellow mx-auto drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
                  <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Star className="w-32 h-32 text-feud-yellow/20 fill-current" />
                  </motion.div>
                </motion.div>

                <motion.h2 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-8xl font-black italic uppercase text-feud-yellow drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                >
                  Game Over!
                </motion.h2>

                <div className="flex gap-16 justify-center mt-12">
                  <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`text-center p-8 rounded-3xl border-4 transition-all duration-500 ${gameState.team1Score > gameState.team2Score ? 'bg-blue-600 border-blue-400 scale-110 shadow-[0_0_40px_rgba(37,99,235,0.5)]' : 'bg-blue-600/20 border-blue-500/30 opacity-60'}`}
                  >
                    <p className="text-blue-200 font-bold uppercase tracking-widest text-sm mb-2">Team 1</p>
                    <p className="text-7xl font-black text-white">{gameState.team1Score}</p>
                    {gameState.team1Score > gameState.team2Score && (
                      <Badge className="mt-4 bg-white text-blue-600 font-black">WINNER</Badge>
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`text-center p-8 rounded-3xl border-4 transition-all duration-500 ${gameState.team2Score > gameState.team1Score ? 'bg-red-600 border-red-400 scale-110 shadow-[0_0_40px_rgba(220,38,38,0.5)]' : 'bg-red-600/20 border-red-500/30 opacity-60'}`}
                  >
                    <p className="text-red-200 font-bold uppercase tracking-widest text-sm mb-2">Team 2</p>
                    <p className="text-7xl font-black text-white">{gameState.team2Score}</p>
                    {gameState.team2Score > gameState.team1Score && (
                      <Badge className="mt-4 bg-white text-red-600 font-black">WINNER</Badge>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, type: 'spring' }}
                  className="mt-16"
                >
                  <div className="relative inline-block">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-4 bg-feud-yellow/20 blur-2xl rounded-full"
                    />
                    <h3 className="text-6xl font-black text-feud-yellow uppercase italic relative z-10 tracking-tighter">
                      {gameState.team1Score > gameState.team2Score ? "Team 1 Dominates!" : gameState.team2Score > gameState.team1Score ? "Team 2 Dominates!" : "A Legendary Tie!"}
                    </h3>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <Button variant="outline" size="lg" onClick={resetGame} className="border-feud-yellow text-feud-yellow hover:bg-feud-yellow/10 font-black px-12 py-8 text-2xl rounded-2xl transition-all hover:scale-105 active:scale-95">
                  <RotateCcw className="w-8 h-8 mr-3" /> PLAY AGAIN
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Round Over Overlay */}
              <AnimatePresence>
                {gameState.phase === 'round-over' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                  >
                    <div className="bg-slate-900 border-4 border-feud-yellow p-10 rounded-3xl text-center space-y-6 shadow-[0_0_50px_rgba(255,215,0,0.3)]">
                      <h2 className="text-5xl font-black italic uppercase text-feud-yellow">Round Over!</h2>
                      <p className="text-xl text-slate-300">Points have been assigned.</p>
                      <Button size="lg" onClick={handleNextQuestion} className="bg-feud-yellow text-feud-dark hover:bg-feud-gold font-black text-xl px-8 py-6 rounded-xl">
                        NEXT ROUND <SkipForward className="ml-2 w-6 h-6" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Question Display */}
              <div className="text-center space-y-2 relative">
                <div className="absolute right-0 top-0 flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border shadow-sm">
                  <Clock className={`w-5 h-5 ${gameState.timer <= 10 ? 'text-destructive animate-pulse' : 'text-feud-yellow'}`} />
                  <span className={`font-mono text-xl font-black ${gameState.timer <= 10 ? 'text-destructive animate-pulse' : ''}`}>
                    {Math.floor(gameState.timer / 60)}:{(gameState.timer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <p className="text-feud-yellow font-mono uppercase tracking-[0.3em] text-sm">Question {gameState.currentQuestionIndex + 1}</p>
                <h2 className="text-4xl font-black italic uppercase max-w-3xl mx-auto leading-tight">
                  {currentQuestion.text}
                </h2>
                <AnimatePresence>
                  {gameState.isStealInProgress && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-4"
                    >
                      <Badge className="bg-feud-yellow text-feud-dark font-black text-lg px-6 py-2 animate-bounce shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                        STEAL IN PROGRESS!
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Player Rosters */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
                <div className={`space-y-2 p-4 rounded-xl border-2 transition-all ${gameState.turn === 1 ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-blue-400 font-black uppercase italic tracking-wider">Team 1</h3>
                    {gameState.turn === 1 && <Badge className="bg-blue-500 text-white animate-pulse">Current Turn</Badge>}
                  </div>
                  <div className="space-y-1">
                    {gameState.team1Players.map((name, i) => (
                      <div key={i} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${gameState.team1CurrentPlayerIndex === i && gameState.turn === 1 ? 'bg-blue-500 text-white font-bold shadow-lg' : 'text-slate-400'}`}>
                        <span className="text-xs opacity-50">{i + 1}</span>
                        <span className="truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`space-y-2 p-4 rounded-xl border-2 transition-all ${gameState.turn === 2 ? 'bg-red-600/20 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-red-400 font-black uppercase italic tracking-wider">Team 2</h3>
                    {gameState.turn === 2 && <Badge className="bg-red-500 text-white animate-pulse">Current Turn</Badge>}
                  </div>
                  <div className="space-y-1">
                    {gameState.team2Players.map((name, i) => (
                      <div key={i} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors ${gameState.team2CurrentPlayerIndex === i && gameState.turn === 2 ? 'bg-red-500 text-white font-bold shadow-lg' : 'text-slate-400'}`}>
                        <span className="text-xs opacity-50">{i + 1}</span>
                        <span className="truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* The Board */}
              <GameBoard answers={currentQuestion.answers} />

              {/* Strikes */}
              <StrikeDisplay count={gameState.strikes} />

              {/* Admin Toggle */}
              <div className="pt-20 border-t border-slate-800">
                <Tabs defaultValue="player" className="w-full">
                  <div className="flex justify-center mb-8">
                    <TabsList className="bg-card border border-border">
                      <TabsTrigger value="player" className="data-[state=active]:bg-muted">
                        <Users className="w-4 h-4 mr-2" /> Player View
                      </TabsTrigger>
                      <TabsTrigger value="host" className="data-[state=active]:bg-muted">
                        <Settings2 className="w-4 h-4 mr-2" /> Host Controls
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="player">
                    <div className="text-center text-muted-foreground italic">
                      Players should look at the board above. Host, use the "Host Controls" tab to manage the game.
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="host">
                    <div className="space-y-8">
                      <AdminPanel 
                        currentQuestion={currentQuestion}
                        onRevealAnswer={handleRevealAnswer}
                        onAddStrike={handleAddStrike}
                        onResetStrikes={handleResetStrikes}
                        onNextQuestion={handleNextQuestion}
                        onAssignPoints={handleAssignPoints}
                        onSetTurn={handleSetTurn}
                        onRotatePlayer={handleRotatePlayer}
                        onStealTurn={handleStealTurn}
                        onToggleTimer={handleToggleTimer}
                        onResetTimer={handleResetTimer}
                        team1Score={gameState.team1Score}
                        team2Score={gameState.team2Score}
                        currentRoundPoints={gameState.currentRoundPoints}
                        strikes={gameState.strikes}
                        turn={gameState.turn}
                        timer={gameState.timer}
                        isTimerRunning={gameState.isTimerRunning}
                      />
                      <QuestionCreator onAddQuestion={handleAddQuestion} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-8 text-center text-muted-foreground text-xs uppercase tracking-widest border-t border-border mt-20">
        Family Feud Digital Edition &bull; Created for Fun &bull; 2024
      </footer>
    </div>
  );
}
