import { createContext, useState } from 'react'


// Componente Provider que envuelve la aplicación
// eslint-disable-next-line react/prop-types
function ThemeProvider({ children  }) {

    const ThemeContext = createContext();
    // Estado para manejar el tema
    const [theme, setTheme] = useState("light");
  
    // Función para alternar entre temas
    const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };
  
    // Proveer el valor del contexto
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }
  

  export default ThemeProvider;