import React, { useState } from 'react';
import styled from 'styled-components';
import * as Styled from './Register'; // Supondo que os styled components estão nesse arquivo
import { FaIdCard, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 400px;
  padding: 50px 20px; /* Simplificação do padding */
  margin: 0 auto;
`;

const StyledLink = styled(Link)`
  width: 100%;
  text-decoration: none; /* Remove underline padrão */
  color: inherit; /* Herda a cor do botão ou do contexto */
`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const payload = {
      identifier, // Usar 'identifier' diretamente
      password,
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', payload);
      localStorage.setItem('token', response.data.token);
      const userId = response.data.userId; 
      localStorage.setItem('userId', userId);
      navigate('/mainApp');
    } catch (error) {
      console.error('Erro:', error.response?.data); // Exibe o erro no console
      setError(error.response?.data?.error || 'Erro desconhecido'); // Ajusta a mensagem de erro
    }
  };

  return (
    <><><Header />
      <Container>
        <Styled.Form onSubmit={handleSubmit}>
          <Styled.Title>
            Bem-vindo(a) de volta,<br />
            insira <Styled.SpanColor>suas credenciais!</Styled.SpanColor>
          </Styled.Title>

          <Styled.InputContainer>
            <Styled.InputWithIcon
              type="text"
              name="login"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Digite seu e-mail ou nome de usuário" />
            <Styled.Icon>
              <FaIdCard />
            </Styled.Icon>
          </Styled.InputContainer>

          <Styled.InputContainer>
            <Styled.InputWithIcon
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Adicionando controle de valor
              placeholder="Digite sua senha" />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <Styled.Icon>
              <FaLock />
            </Styled.Icon>
          </Styled.InputContainer>

          {error && <Styled.ErrorMessage>{error}</Styled.ErrorMessage>} {/* Exibe mensagem de erro */}

          <Styled.Button primary type="submit">Entrar</Styled.Button>

          <StyledLink to="/register">
            <Styled.Button type="button">Ainda não possuo uma conta</Styled.Button>
          </StyledLink>
        </Styled.Form>
      </Container></><Footer /></>

  );
};

export default Login;
