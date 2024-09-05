import { useContext } from "react";
import QuizContext from "../context/QuizContext";
import Question from "./Question";
import Result from "./Result";

//* Propósito: Controla el flujo del juego de trivia.

const Quiz = () => {
    //* Uso del Contexto: Utiliza useContext para acceder al contexto del juego y 
    //* obtener el índice de la pregunta actual y el array de preguntas.
    const { questions, currentQuestionIndex } = useContext(QuizContext);

    // Mostrar resultado al final del juego
    //** Si el índice de la pregunta actual es mayor o igual al número total de preguntas 
        // *(currentQuestionIndex >= questions.length), renderiza el componente Result para mostrar el 
    //* resultado final. */
    if (currentQuestionIndex >= questions.length) {
        return <Result />;
    }

    /** Si hay preguntas restantes, renderiza el componente Question para mostrar la pregunta actual. */
    return (
        <div className="quiz-container">
            <Question />
        </div>
    )
}

export default Quiz