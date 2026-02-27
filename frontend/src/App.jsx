import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Landing from './components/home/Landing';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
