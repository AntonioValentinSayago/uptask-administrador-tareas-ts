// src/context/QuizContext.js
import { createContext, useState } from "react";

// Crear contexto
//* createContext: Se utiliza para crear el contexto QuizContext, 
// que permitirá compartir datos globales entre los componentes.*/
const QuizContext = createContext();

// Proveedor del contexto
// eslint-disable-next-line react/prop-types
export const QuizProvider = ({ children }) => {
  // Estado para las preguntas
  // questions: Un array con las preguntas del juego, opciones y respuestas correctas.
  const [questions] = useState([
    { question: "What is the capital of France?", options: ["Paris", "London", "Rome", "Berlin"], answer: "Paris" },
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
    { question: "What is the capital of Spain?", options: ["Madrid", "Lisbon", "Barcelona", "Valencia"], answer: "Madrid" }
  ]);

  // Estados para el juego
  // currentQuestionIndex: Almacena el índice de la pregunta actual.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // score: Mantiene el puntaje del usuario.
  const [score, setScore] = useState(0);
  // selectedOption: Almacena la opción seleccionada por el usuario.
  const [selectedOption, setSelectedOption] = useState(null);

  // Funciones para manejar el juego

  //* handleNextQuestion: Verifica si la respuesta seleccionada es correcta. Si lo es,
  //*  incrementa el puntaje. Luego, avanza a la siguiente pregunta.
  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
    setSelectedOption(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  //* handleOptionSelect: Actualiza la opción seleccionada por el usuario.
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Valores del contexto
  //* contextValue: Un objeto que contiene el estado y las funciones que se proporcionan a los componentes que consumen este contexto.
  const contextValue = {
    questions,
    currentQuestionIndex,
    score,
    selectedOption,
    handleNextQuestion,
    handleOptionSelect
  };

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
};

export default QuizContext;
