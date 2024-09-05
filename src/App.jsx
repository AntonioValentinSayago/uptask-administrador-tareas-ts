// src/App.js
import { QuizProvider } from "./context/QuizContext";
import Quiz from "./components/Quiz";

//* Propósito: Es el componente principal de la aplicación.
 // *Uso del QuizProvider: Envuelve toda la aplicación con QuizProvider para asegurarse de que 
 // * todos los componentes tengan acceso al contexto del juego.
//* Renderizado del Quiz Component: Muestra el componente Quiz, que maneja la lógica del juego.
function App() {
  return (
    <QuizProvider>
      <div className="App">
        <h1>Trivia Quiz Game</h1>
        <Quiz />
      </div>
    </QuizProvider>
  );
}

export default App;
