import { useContext } from "react";
import QuizContext from "../context/QuizContext";

const Result = () => {
    /** Utiliza useContext para acceder al puntaje final y al total de preguntas. */
    const { score, questions } = useContext(QuizContext);
    return (
        <div className="result-container">
            <h2>Your Score: {score} / {questions.length}</h2>
            <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
    )
}

export default Result