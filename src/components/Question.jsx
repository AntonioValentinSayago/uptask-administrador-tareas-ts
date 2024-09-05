// src/components/Question.js
import  { useContext } from "react";
import QuizContext from "../context/QuizContext";

/* Propósito: Muestra la pregunta actual y las opciones de respuesta. */

const Question = () => {
  /** Utiliza useContext para acceder al contexto del juego y obtener la pregunta actual, las opciones, 
   * y las funciones de manejo de estado. */
    const { questions, currentQuestionIndex, handleNextQuestion, handleOptionSelect, selectedOption } = useContext(QuizContext);
    const currentQuestion = questions[currentQuestionIndex];
  
    return (
      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
        <div className="options">
          {/* Al hacer clic en una opción, llama a handleOptionSelect para actualizar la opción seleccionada. */}
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={selectedOption === option ? "selected" : ""}
            >
              {option}
            </button>
          ))}
        </div>
        {/* El botón "Next" avanza a la siguiente pregunta al llamar a handleNextQuestion. Solo está habilitado si el usuario ha seleccionado una opción. */}
        <button onClick={handleNextQuestion} disabled={!selectedOption}>
          Next
        </button>
      </div>
    );
}

export default Question