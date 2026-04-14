export interface Answer {
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface GameState {
  currentQuestionIndex: number;
  team1Score: number;
  team2Score: number;
  team1Players: string[];
  team2Players: string[];
  team1CurrentPlayerIndex: number;
  team2CurrentPlayerIndex: number;
  currentRoundPoints: number;
  strikes: number;
  turn: 1 | 2;
  timer: number;
  isTimerRunning: boolean;
  isStealInProgress: boolean;
  phase: 'setup' | 'playing' | 'round-over' | 'game-over';
}

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: "Name something people do when they're bored.",
    answers: [
      { text: "Watch TV", points: 35, revealed: false },
      { text: "Sleep", points: 25, revealed: false },
      { text: "Eat", points: 15, revealed: false },
      { text: "Read", points: 10, revealed: false },
      { text: "Play Games", points: 8, revealed: false },
      { text: "Clean", points: 5, revealed: false },
    ],
  },
  {
    id: '2',
    text: "Name a fruit you might find in a fruit salad.",
    answers: [
      { text: "Grapes", points: 30, revealed: false },
      { text: "Pineapple", points: 22, revealed: false },
      { text: "Melon", points: 18, revealed: false },
      { text: "Strawberry", points: 12, revealed: false },
      { text: "Apple", points: 10, revealed: false },
      { text: "Banana", points: 8, revealed: false },
    ],
  },
  {
    id: '3',
    text: "Name something you associate with vampires.",
    answers: [
      { text: "Blood", points: 40, revealed: false },
      { text: "Fangs", points: 30, revealed: false },
      { text: "Garlic", points: 15, revealed: false },
      { text: "Coffin", points: 10, revealed: false },
      { text: "Bat", points: 5, revealed: false },
    ],
  },
];
