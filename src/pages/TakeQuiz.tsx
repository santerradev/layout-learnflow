import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MdArrowBack, MdArrowForward, MdCheck, MdClose } from 'react-icons/md';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

// Mock quiz data
const mockQuiz = {
  id: '1',
  title: 'Quiz de Programação',
  description: 'Teste seus conhecimentos em programação',
  questions: [
    {
      question: 'Qual das linguagens abaixo é usada principalmente para estilizar páginas web?',
      options: ['JavaScript', 'HTML', 'CSS', 'Python'],
      correct: 2
    },
    {
      question: 'Qual comando em Python imprime algo na tela?',
      options: ['print()', 'echo()', 'console.log()', 'printf()'],
      correct: 0
    },
    {
      question: 'Em JavaScript, qual palavra-chave declara uma variável que NÃO pode ser reatribuída?',
      options: ['var', 'let', 'const', 'static'],
      correct: 2
    },
    {
      question: 'Qual estrutura de dados é usada para armazenar pares chave-valor em JavaScript?',
      options: ['Array', 'Object', 'Set', 'Map'],
      correct: 1
    },
    {
      question: 'Em HTML, qual tag é usada para criar um link (hiperligação)?',
      options: ['<a>', '<link>', '<href>', '<url>'],
      correct: 0
    }
  ]
};

export const TakeQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    new Array(mockQuiz.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const progress = ((currentQuestion + 1) / mockQuiz.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    mockQuiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowResults(true);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setUserAnswers(new Array(mockQuiz.questions.length).fill(null));
    setShowResults(false);
    setScore(0);
  };

  const getScoreColor = () => {
    const percentage = (score / mockQuiz.questions.length) * 100;
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreFeedback = () => {
    const percentage = (score / mockQuiz.questions.length) * 100;
    if (percentage >= 70) return 'Excelente trabalho!';
    if (percentage >= 40) return 'Bom trabalho, mas você pode melhorar!';
    return 'Continue estudando!';
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <MdArrowBack className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card className="shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-6xl">🏆</div>
              <h2 className="text-3xl font-bold text-primary">Quiz Finalizado!</h2>
              
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">
                  Você acertou {score} de {mockQuiz.questions.length} questões
                </p>
                <p className={`text-5xl font-bold ${getScoreColor()}`}>
                  {Math.round((score / mockQuiz.questions.length) * 100)}%
                </p>
                <p className="text-lg font-medium">{getScoreFeedback()}</p>
              </div>

              {/* Detailed Feedback */}
              <div className="text-left space-y-4 pt-6">
                <h3 className="text-xl font-semibold mb-4">Respostas Detalhadas:</h3>
                {mockQuiz.questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === question.correct;
                  
                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium">
                          {index + 1}. {question.question}
                        </h3>
                        {isCorrect ? (
                          <Badge className="bg-green-500 hover:bg-green-600">Correto</Badge>
                        ) : (
                          <Badge variant="destructive">Incorreto</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer === optionIndex;
                          const isCorrectAnswer = optionIndex === question.correct;
                          
                          let className = "p-3 rounded-lg border-2 ";
                          
                          if (isCorrectAnswer) {
                            className += "bg-green-50 dark:bg-green-950/30 border-green-500 text-green-700 dark:text-green-400";
                          } else if (isUserAnswer && !isCorrect) {
                            className += "bg-red-50 dark:bg-red-950/30 border-red-500 text-red-700 dark:text-red-400";
                          } else {
                            className += "bg-muted/30 border-muted";
                          }
                          
                          return (
                            <div key={optionIndex} className={className}>
                              <div className="flex items-start gap-2">
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="flex-1">{option}</span>
                                {isCorrectAnswer && (
                                  <Badge className="bg-green-500 hover:bg-green-600 text-white ml-2">
                                    Correta
                                  </Badge>
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <Badge variant="destructive" className="ml-2">
                                    Sua resposta
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={handleRestart} className="flex-1">
                  Refazer Quiz
                </Button>
                <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                  Voltar para Atividades
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = mockQuiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <MdArrowBack className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold text-primary">{mockQuiz.title}</h1>
                <Badge variant="secondary">
                  Questão {currentQuestion + 1} / {mockQuiz.questions.length}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {question.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = userAnswers[currentQuestion] === index;
                  return (
                    <label
                      key={index}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(index)}
                        className="sr-only"
                      />
                      <div className={`flex items-center justify-center w-6 h-6 border-2 rounded-full ${
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {isSelected && <MdCheck className="h-4 w-4 text-primary-foreground" />}
                      </div>
                      <span className="font-medium">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <MdArrowBack className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={userAnswers[currentQuestion] === null}
              >
                {currentQuestion === mockQuiz.questions.length - 1 ? 'Finalizar' : 'Próximo'}
                <MdArrowForward className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
