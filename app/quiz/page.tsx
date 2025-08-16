"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

type Question = {
  id: number;
  pertanyaan: string;
  pilihan: string[];
  jawaban: string;
  penjelasan?: string;
};

type QuizState = "not-started" | "in-progress" | "finished";

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>("not-started");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]); // Track all answers
  const [name, setName] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Load soal via API route /api/questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/questions");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setUserAnswers(new Array(data.length).fill(null)); // Initialize answers array
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer
  useEffect(() => {
    if (quizState !== "in-progress") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState]);

  const startQuiz = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (questions.length === 0) {
      alert("Questions are not ready yet");
      return;
    }
    setQuizState("in-progress");
  };

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
    // Update the answers array
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer");
      return;
    }

    if (questions[currentQuestionIndex].penjelasan) {
      setShowExplanation(true);
      setTimeout(() => {
        proceedToNext();
      }, 3000);
    } else {
      proceedToNext();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // Load the previous answer
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
      setShowExplanation(false);
    }
  };

  const proceedToNext = () => {
    setShowExplanation(false);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      // Load the next answer if it exists
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1]);
    } else {
      handleQuizFinish();
    }
  };

  const handleQuizFinish = () => {
    // Calculate final score
    let finalScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questions[index]?.jawaban) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setQuizState("finished");
  };

  const restartQuiz = () => {
    setQuizState("not-started");
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(questions.length).fill(null));
    setTimeLeft(300);
    setName("");
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>English Quiz App</title>
        <meta name="description" content="Test your English skills" />
      </Head>

      <div className={`quiz-container ${quizState}`} id="quiz-container">
        <header className="quiz-header">
          <h1>English Quiz</h1>
          {quizState === "in-progress" && (
            <div className="quiz-meta">
              <span className="timer">Time: {formatTime(timeLeft)}</span>
              <span className="progress">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          )}
        </header>

        <main className="quiz-main">
          {quizState === "not-started" && (
            <div className="start-screen">
              <div className="welcome-content">
                <div className="quiz-icon">📚</div>
                <h2>Welcome to English Quiz!</h2>
                <p>Test your English knowledge with our interactive quiz.</p>
                <div className="quiz-info">
                  <div className="info-item">
                    <span className="info-icon">⏱️</span>
                    <span>5 minutes</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">❓</span>
                    <span>{questions.length} questions</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">🎯</span>
                    <span>Multiple choice</span>
                  </div>
                </div>
                <div className="name-input-container">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="name-input"
                    onKeyPress={(e) => e.key === "Enter" && startQuiz()}
                  />
                  <button onClick={startQuiz} className="start-button">
                    🚀 Start Quiz
                  </button>
                </div>
              </div>
            </div>
          )}

          {quizState === "in-progress" && currentQuestion && (
            <div className="question-screen">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="question-container">
                <h3 className="question-text">{currentQuestion.pertanyaan}</h3>

                <div className="options-container">
                  {currentQuestion.pilihan?.map((option, index) => (
                    <button
                      key={index}
                      className={`option-button ${
                        selectedAnswer === option ? "selected" : ""
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {showExplanation && currentQuestion.penjelasan && (
                  <div className="explanation">
                    <h4>Explanation:</h4>
                    <p>{currentQuestion.penjelasan}</p>
                  </div>
                )}

                <div className="navigation-buttons">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="previous-button"
                  >
                    Previous Question
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="next-button"
                  >
                    {currentQuestionIndex + 1 === questions.length
                      ? "Finish Quiz"
                      : "Next Question"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {quizState === "finished" && (
            <div className="results-screen">
              <div className="celebration-header">
                <h2>🎉 Quiz Completed! 🎉</h2>
              </div>
              <div className="results-card">
                <div className="score-circle">
                  <div className="score-number">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="score-label">Your Score</div>
                </div>
                <div className="results-details">
                  <div className="result-item">
                    <span className="result-label">Name:</span>
                    <span className="result-value">{name}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Correct Answers:</span>
                    <span className="result-value">
                      {score} out of {questions.length}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Time Taken:</span>
                    <span className="result-value">
                      {formatTime(300 - timeLeft)}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Grade:</span>
                    <span
                      className={`result-value grade ${
                        score / questions.length >= 0.8
                          ? "excellent"
                          : score / questions.length >= 0.6
                          ? "good"
                          : "needs-improvement"
                      }`}
                    >
                      {score / questions.length >= 0.8
                        ? "Excellent!"
                        : score / questions.length >= 0.6
                        ? "Good Job!"
                        : "Keep Practicing!"}
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={restartQuiz} className="restart-button">
                🔄 Take Quiz Again
              </button>
            </div>
          )}
        </main>

        <footer className="quiz-footer">
          <p>© {new Date().getFullYear()} English Quiz App</p>
        </footer>
      </div>

      <style jsx>{`
        .quiz-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }

        .quiz-header {
          text-align: center;
          margin-bottom: 2rem;
          background-color: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .quiz-header h1 {
          color: #333;
          margin: 0;
        }

        .quiz-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #666;
        }

        .timer {
          color: #ff6b35;
          font-weight: bold;
        }

        .start-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 2rem 0;
        }

        .welcome-content {
          text-align: center;
          color: white;
          padding: 3rem;
          max-width: 500px;
        }

        .quiz-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .welcome-content h2 {
          margin: 1rem 0;
          font-size: 2.2rem;
          font-weight: 600;
        }

        .welcome-content p {
          margin-bottom: 2rem;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .quiz-info {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.8rem 1.2rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .info-icon {
          font-size: 1.2rem;
        }

        .name-input-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .name-input {
          padding: 15px 20px;
          font-size: 1.1rem;
          width: 100%;
          max-width: 350px;
          border: none;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          text-align: center;
          transition: all 0.3s;
        }

        .name-input::placeholder {
          color: #666;
        }

        .name-input:focus {
          outline: none;
          background: white;
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .question-screen {
          width: 100%;
        }

        .progress-bar {
          height: 8px;
          background-color: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #45a049);
          transition: width 0.3s ease;
        }

        .question-container {
          background-color: #fff;
          padding: 2.5rem;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .question-text {
          margin-bottom: 2rem;
          color: #333;
          font-size: 1.2rem;
          line-height: 1.6;
        }

        .options-container {
          display: grid;
          gap: 12px;
          margin-bottom: 2rem;
        }

        .option-button {
          padding: 15px 20px;
          background-color: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s;
          font-size: 1rem;
        }

        .option-button:hover {
          background-color: #e9ecef;
          border-color: #dee2e6;
        }

        .option-button.selected {
          background-color: #d1e7dd;
          border-color: #badbcc;
          color: #0f5132;
        }

        .explanation {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          border-left: 4px solid #f39c12;
        }

        .explanation h4 {
          margin-top: 0;
          color: #856404;
        }

        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 2rem;
        }

        .results-screen {
          text-align: center;
          margin-top: 2rem;
        }

        .celebration-header h2 {
          font-size: 2.5rem;
          color: #4caf50;
          margin-bottom: 2rem;
          animation: celebrate 1s ease-in-out;
        }

        @keyframes celebrate {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .results-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin: 2rem auto;
          max-width: 600px;
          position: relative;
          overflow: hidden;
        }

        .results-card::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          margin: 0 auto 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .score-number {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .score-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .results-details {
          position: relative;
          z-index: 1;
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .result-item:last-child {
          border-bottom: none;
        }

        .result-label {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .result-value {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .grade.excellent {
          color: #4caf50;
          text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
        }

        .grade.good {
          color: #ff9800;
          text-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
        }

        .grade.needs-improvement {
          color: #f44336;
          text-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
        }

        button {
          padding: 12px 24px;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s;
          min-width: 120px;
        }

        .start-button,
        .restart-button {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px;
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
          position: relative;
          overflow: hidden;
        }

        .start-button:hover,
        .restart-button:hover {
          background: linear-gradient(135deg, #ee5a24, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(238, 90, 36, 0.6);
        }

        .start-button::before,
        .restart-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s;
        }

        .start-button:hover::before,
        .restart-button:hover::before {
          left: 100%;
        }

        .next-button {
          background: linear-gradient(135deg, #ff9800, #f57c00);
        }

        .next-button:hover {
          background: linear-gradient(135deg, #f57c00, #ef6c00);
          transform: translateY(-2px);
        }

        .previous-button {
          background: linear-gradient(135deg, #6c757d, #5a6268);
        }

        .previous-button:hover {
          background: linear-gradient(135deg, #5a6268, #495057);
          transform: translateY(-2px);
        }

        button:disabled {
          background: #cccccc !important;
          cursor: not-allowed;
          transform: none;
        }

        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }

        .error-container button {
          margin-top: 1rem;
          background: linear-gradient(135deg, #f44336, #d32f2f);
        }

        .quiz-footer {
          margin-top: auto;
          text-align: center;
          padding: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .quiz-container {
            padding: 10px;
          }

          .question-container {
            padding: 1.5rem;
          }

          .navigation-buttons {
            flex-direction: column;
          }

          .quiz-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}
