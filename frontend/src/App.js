import logo from './logo.svg';
import './App.css';
import Canvas from './components/Canvas';
import Home from './components/Home';
import Calibrate from './components/Calibrate';
import GameOver from './components/GameOver';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { PlayScreen } from './components/PlayScreen';

import 'tailwindcss/tailwind.css';

function App() {
  return (
    <div class="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/play" element={<PlayScreen />}/>
          <Route path="/calibrate" element={<Calibrate />}/>
          <Route path="/GameOver" element={<GameOver />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
