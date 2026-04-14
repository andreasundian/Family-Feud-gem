import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Question, Answer } from '@/src/types';
import { Plus, Trash2, Save, ListPlus } from 'lucide-react';

interface QuestionCreatorProps {
  onAddQuestion: (question: Question) => void;
}

export function QuestionCreator({ onAddQuestion }: QuestionCreatorProps) {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState<{ text: string; points: string }[]>([
    { text: '', points: '' },
    { text: '', points: '' },
  ]);

  const handleAddAnswerField = () => {
    if (answers.length < 8) {
      setAnswers([...answers, { text: '', points: '' }]);
    }
  };

  const handleRemoveAnswerField = (index: number) => {
    if (answers.length > 1) {
      setAnswers(answers.filter((_, i) => i !== index));
    }
  };

  const handleAnswerChange = (index: number, field: 'text' | 'points', value: string) => {
    const newAnswers = [...answers];
    newAnswers[index][field] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const validAnswers: Answer[] = answers
      .filter(a => a.text.trim() !== '' && !isNaN(parseInt(a.points)))
      .map(a => ({
        text: a.text.trim(),
        points: parseInt(a.points),
        revealed: false,
      }));

    if (validAnswers.length === 0) return;

    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: questionText.trim(),
      answers: validAnswers,
    };

    onAddQuestion(newQuestion);
    
    // Reset form
    setQuestionText('');
    setAnswers([{ text: '', points: '' }, { text: '', points: '' }]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-dashed border-border bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-feud-yellow" />
          Add Custom Question
        </CardTitle>
        <CardDescription>Create a new survey question for the game.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question Text</Label>
            <Input
              id="question"
              placeholder="e.g., Name something you find in a kitchen..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="bg-background"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answers & Points</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddAnswerField}
                disabled={answers.length >= 8}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Answer
              </Button>
            </div>
            
            <div className="space-y-3">
              {answers.map((answer, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder={`Answer ${index + 1}`}
                      value={answer.text}
                      onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Pts"
                      value={answer.points}
                      onChange={(e) => handleAnswerChange(index, 'points', e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAnswerField(index)}
                    disabled={answers.length <= 1}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-feud-yellow text-feud-dark hover:bg-feud-gold font-bold">
            <Save className="w-4 h-4 mr-2" /> Save Question to Queue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
