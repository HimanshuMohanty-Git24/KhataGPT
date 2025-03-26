import React from 'react';
import AppRouter from './routes';
import { CustomThemeProvider } from './context/ThemeContext';
import './styles/global.css';

function App() {
  return (
    <CustomThemeProvider>
      <div className="App">
        <AppRouter />
      </div>
    </CustomThemeProvider>
  );
}
//deploy test 2
export default App;