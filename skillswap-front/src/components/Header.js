import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaLinkedin, FaSignInAlt, FaInstagram, FaFacebook, FaHome, FaUserPlus, FaDownload } from 'react-icons/fa';
import './styles/Header.css';

const Linke = styled(Link)`
  background-color: #007bff;
  padding: 8px 15px;
  border-radius: 50px;
  color: white;

  &:hover {
    color: white;
    background-color: #005bff;
  }
`;

const Link1 = styled(Link)`
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

const Header = () => {
  const [activeTab, setActiveTab] = useState('');
  const location = useLocation(); // Hook para acessar a rota atual

  // Sincroniza o estado ativo do tab com a rota atual
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('inicio');
    } else if (location.pathname === '/register') {
      setActiveTab('registro');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    } else if (location.pathname === '/baixar') {
      setActiveTab('baixar');
    }
  }, [location.pathname]); // Atualiza sempre que a rota mudar

  return (
    <header className="header">
      <Link id='linkLogo' to="/">
        <div className="logo">
          <img src="logo.png" alt="SkillSwap Logo" />
        </div>
      </Link>

      <nav className="nav-menu">
        <ul>
          <li>
            <Link1
              to="/"
              className={activeTab === 'inicio' ? 'active' : ''}
              onClick={() => setActiveTab('inicio')}
            >
              Início
            </Link1>
          </li>
          <li>
            <Link1
              to="/login"
              className={activeTab === 'login' ? 'active' : ''}
              onClick={() => setActiveTab('login')}
            >
              Login
            </Link1>
          </li>
          <li>
            <Link1
              to="/register"
              className={activeTab === 'registro' ? 'active' : ''}
              onClick={() => setActiveTab('registro')}
            >
              Registro
            </Link1>
          </li>
          <li>
            <Linke
              to="/baixar"
              className={activeTab === 'baixar' ? 'active' : ''}
              onClick={() => setActiveTab('baixar')}
            >
              Baixar Aplicativo
            </Linke>
          </li>
        </ul>
      </nav>
      <div className="icon-menu">
        <Link to="/login" onClick={() => setActiveTab('login')}>
          <FaSignInAlt />
        </Link>
        <Link to="/register" onClick={() => setActiveTab('registro')}>
          <FaUserPlus />
        </Link>
        <Link to="/baixar" onClick={() => setActiveTab('baixar')}>
          <FaDownload />
        </Link>
      </div>
      <div className="social-icons">
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
          <FaFacebook />
        </a>
      </div>
    </header >
  );
};

export default Header;
