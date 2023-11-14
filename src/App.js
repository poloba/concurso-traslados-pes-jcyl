import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Table from './Table';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import centros from './centros_actualizado.json';

const App = () => {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<DndProvider backend={HTML5Backend}><Table data={centros} /></DndProvider>} />
      </Routes>
    </Router>
  );
}

export default App;
