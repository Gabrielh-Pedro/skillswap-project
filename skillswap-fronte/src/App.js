import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; // Importe sua página Home
import Header from './components/Header';
import Footer from './components/Footer';
import Upgrade from './pages/Upgrade'
import Home from './pages/Home';
import Friends from './pages/Friends'
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Swaps from './pages/Swaps';
import MainApp from './pages/MainApp'
import UserProfile from './pages/UserProfile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mainApp" element={<MainApp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/swaps" element={<Swaps />} />
        <Route path="/userInfo/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
