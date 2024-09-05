import { useContext } from "react";

function ThemeSwitcher() {
    // Consumir el contexto utilizando el hook useContext
    // eslint-disable-next-line no-undef
    const { theme, toggleTheme } = useContext(ThemeContext);
  
    return (
      <div>
        <p>Current Theme: {theme}</p>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
    );
  }

  
  export default ThemeSwitcher