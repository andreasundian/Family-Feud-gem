import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question, Answer } from '@/src/types';
import { X, Check, RotateCcw, SkipForward, Users, Clock, Play, Pause, Zap } from 'lucide-react';

interface AdminPanelProps {
  currentQuestion: Question;
  onRevealAnswer: (index: number) => void;
  onAddStrike: () => void;
  onResetStrikes: () => void;
  onNextQuestion: () => void;
  onAssignPoints: (team: 1 | 2) => void;
  onSetTurn: (team: 1 | 2) => void;
  onRotatePlayer: (team: 1 | 2) => void;
  onStealTurn: () => void;
  onToggleTimer: () => void;
  onResetTimer: (seconds?: number) => void;
  team1Score: number;
  team2Score: number;
  currentRoundPoints: number;
  strikes: number;
  turn: 1 | 2;
  timer: number;
  isTimerRunning: boolean;
}

export function AdminPanel({
  currentQuestion,
  onRevealAnswer,
  onAddStrike,
  onResetStrikes,
  onNextQuestion,
  onAssignPoints,
  onSetTurn,
  onRotatePlayer,
  onStealTurn,
  onToggleTimer,
  onResetTimer,
  team1Score,
  team2Score,
  currentRoundPoints,
  strikes,
  turn,
  timer,
  isTimerRunning,
}: AdminPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Users className="w-5 h-5" />
          Host Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-foreground">Current Question:</h3>
          <p className="p-3 bg-muted rounded-md border italic text-foreground">"{currentQuestion.text}"</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Reveal Answers</h4>
            <div className="grid gap-2">
              {currentQuestion.answers.map((answer, i) => (
                <Button
                  key={i}
                  variant={answer.revealed ? "outline" : "default"}
                  className="justify-between h-auto py-2 text-left"
                  onClick={() => onRevealAnswer(i)}
                  disabled={answer.revealed}
                >
                  <span className="truncate pr-2">{answer.text}</span>
                  <span className="font-mono bg-black/10 dark:bg-white/10 px-1 rounded">{answer.points}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Timer Controls */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Timer
                </h4>
                <span className={`font-mono text-2xl font-black ${timer <= 10 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                  {formatTime(timer)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={isTimerRunning ? "destructive" : "default"}
                  className="flex-1"
                  onClick={onToggleTimer}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isTimerRunning ? "Pause" : "Start"}
                </Button>
                <Button variant="outline" onClick={() => onResetTimer(60)}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                {[15, 30, 45, 60].map(s => (
                  <Button key={s} variant="ghost" size="sm" className="text-[10px] h-6 flex-1" onClick={() => onResetTimer(s)}>
                    {s}s
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Turn Management</h4>
              <div className="flex gap-2">
                <Button 
                  variant={turn === 1 ? "default" : "outline"}
                  className={`flex-1 ${turn === 1 ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                  onClick={() => onSetTurn(1)}
                >
                  Team 1
                </Button>
                <Button 
                  variant={turn === 2 ? "default" : "outline"}
                  className={`flex-1 ${turn === 2 ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
                  onClick={() => onSetTurn(2)}
                >
                  Team 2
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onRotatePlayer(1)}>
                  Rotate T1
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onRotatePlayer(2)}>
                  Rotate T2
                </Button>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-feud-yellow text-feud-yellow hover:bg-feud-yellow hover:text-feud-dark font-bold"
                onClick={onStealTurn}
              >
                <Zap className="w-4 h-4 mr-2 fill-current" /> STEAL TURN
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Game Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="destructive" onClick={onAddStrike} className="flex-1">
                  <X className="w-4 h-4 mr-2" /> Strike ({strikes})
                </Button>
                <Button variant="outline" onClick={onResetStrikes}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="secondary" onClick={onNextQuestion} className="w-full">
                <SkipForward className="w-4 h-4 mr-2" /> Next Question
              </Button>
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Round Points: {currentRoundPoints}</h4>
              <div className="flex gap-2">
                <Button onClick={() => onAssignPoints(1)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Team 1
                </Button>
                <Button onClick={() => onAssignPoints(2)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Team 2
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
