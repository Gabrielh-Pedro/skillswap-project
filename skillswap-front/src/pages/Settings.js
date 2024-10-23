import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaEye, FaEyeSlash, FaAngleDown } from 'react-icons/fa';
import HeaderApp from '../components/HeaderApp';
import * as Styled from './Register'; // Supondo que os styled components estão nesse arquivo


// Definições de animação e estilos
const fadeIn = keyframes`
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 100px; /* Altere conforme necessário */
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  padding: 50px 20px;
  margin: 70px auto;
  background: transparent;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonExpand = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #eee;
  color: #aaa;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  margin-bottom: 10px;

  &:hover {
    background: #ddd;
  }

  &.active {
    background: #0056b3;
    color: white;
  }

  .icon {
    transition: transform 0.3s;
  }

  &.active .icon {
    transform: rotate(180deg); /* Rotaciona a seta para cima */
  }
`;

const InputContainer = styled.div`
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  transition: opacity 0.5s ease, max-height 0.5s ease;

  &.active {
    opacity: 1;
    max-height: 300px; /* Ajuste conforme necessário */
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-weight: 600;
  border: 1px solid #ddd;
  font-size: 12px;
  box-sizing: border-box;
  font-family: 'Open Sans';
  margin-bottom: 10px;
  border-radius: 10px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 35px;
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  margin-top: 15px;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-top: 10px;
`;

const Settings = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [discord, setDiscord] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [fieldToUpdate, setFieldToUpdate] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [expandedFields, setExpandedFields] = useState({
    username: false,
    email: false,
    whatsapp: false,
    discord: false,
    linkedin: false,
    changePassword: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Erro ao buscar dados do usuário');
          const data = await response.json();
          setUser(data.user);
          setUsername(data.user.username || '');
          setEmail(data.user.email || '');
          setWhatsapp(data.user.whatsapp || '');
          setDiscord(data.user.discord || '');
          setLinkedin(data.user.linkedin || '');
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setLoading(false); // Finaliza o carregamento
        }
      } else {
        setLoading(false); // Também finaliza se não houver token
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Carregando...</div>; // Exibe uma mensagem de carregamento
  }

  const validateField = async (fieldName, value) => {
    const usernameRegex = /^[a-zA-Z0-9._]{6,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const whatsappRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

    let errorMessage = '';

    switch (fieldName) {
      case 'username':
        if (!usernameRegex.test(value)) {
          errorMessage = 'Nome de usuário deve ter entre 6 e 15 caracteres e pode conter letras, números, pontos e sublinhados.';
        }
        break;
      case 'email':
        if (!emailRegex.test(value)) {
          errorMessage = 'Email inválido.';
        }
        break;
      case 'whatsapp':
        if (!whatsappRegex.test(value)) {
          errorMessage = 'WhatsApp inválido. Use o formato: (XX) XXXXX-XXXX';
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleSaveProfile = async () => {
    // Valida todos os campos
    const usernameError = await validateField('username', username);
    const emailError = await validateField('email', email);
    const whatsappError = await validateField('whatsapp', whatsapp);
    const discordError = await validateField('discord', discord);
    
    if (usernameError) {
      setError(usernameError);
      return;
    }
    if (emailError) {
      setError(emailError);
      return;
    }
    if (whatsappError) {
      setError(whatsappError);
      return;
    }
    if (discordError) {
      setError(discordError);
      return;
    }
    
    // Verifica se as senhas estão corretas e se coincidem
    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://127.0.0.1:5000/updatePrivacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          whatsapp,
          discord,
          linkedin,
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setSuccess('Perfil atualizado com sucesso!');
        setError('');
      } else {
        const data = await response.json();
        if (data.message.includes('senha anterior')) {
          setError('A senha anterior está incorreta.');
        } else if (data.message.includes('usuário já existe')) {
          setError('O nome de usuário já existe.');
        } else if (data.message.includes('email já existe')) {
          setError('O email já existe.');
        } else if (data.message.includes('whatsapp já existe')) {
          setError('O WhatsApp já existe.');
        } else if (data.message.includes('discord já existe')) {
          setError('O Discord já existe.');
        } else if (data.message.includes('linkedin já existe')) {
          setError('O LinkedIn já existe.');
        } else {
          setError(data.message || 'Erro ao salvar perfil');
        }
        setSuccess('');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setError('Erro ao salvar perfil');
    }
  };

  const toggleExpand = (field) => {
    setExpandedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleFieldUpdate = (field) => {
    setFieldToUpdate(field);
    setShowPopup(true);
  };

  const handleConfirm = () => {
    // Lógica para enviar a atualização ao backend
    setShowPopup(false);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <>
      <HeaderApp />
      <Container>
      <Styled.Title style={{ marginBottom: '30px' }}>Bem-vindo(a) a suas configurações de privacidade, <Styled.SpanColor>{user.username}</Styled.SpanColor></Styled.Title>

        <ButtonExpand onClick={() => toggleExpand('username')}>
          Nome de usuário
          <FaAngleDown className="icon" style={{ transform: expandedFields.username ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </ButtonExpand>
        <InputContainer className={expandedFields.username ? 'active' : ''}>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputContainer>

        <ButtonExpand onClick={() => toggleExpand('email')}>
          Email
          <FaAngleDown className="icon" style={{ transform: expandedFields.email ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </ButtonExpand>
        <InputContainer className={expandedFields.email ? 'active' : ''}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputContainer>

        <ButtonExpand onClick={() => toggleExpand('whatsapp')}>
          WhatsApp
          <FaAngleDown className="icon" style={{ transform: expandedFields.whatsapp ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </ButtonExpand>
        <InputContainer className={expandedFields.whatsapp ? 'active' : ''}>
          <Input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </InputContainer>

        <ButtonExpand onClick={() => toggleExpand('discord')}>
          Discord
          <FaAngleDown className="icon" style={{ transform: expandedFields.discord ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </ButtonExpand>
        <InputContainer className={expandedFields.discord ? 'active' : ''}>
          <Input
            type="text"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
        </InputContainer>

        <ButtonExpand onClick={() => toggleExpand('linkedin')}>
          LinkedIn
          <FaAngleDown className="icon" style={{ transform: expandedFields.linkedin ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </ButtonExpand>
        <InputContainer className={expandedFields.linkedin ? 'active' : ''}>
          <Input
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </InputContainer>

        <ButtonExpand onClick={() => toggleExpand('changePassword')}>
          Alterar Senha
          <FaAngleDown className="icon" style={{ transform: expandedFields.changePassword ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </ButtonExpand>
        <InputContainer className={expandedFields.changePassword ? 'active' : ''}>
          <Input
            type={showOldPassword ? 'text' : 'password'}
            placeholder="Senha Anterior"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <EyeIcon onClick={() => setShowOldPassword(!showOldPassword)}>
            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeIcon>
          <Input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <EyeIcon onClick={() => setShowNewPassword(!showNewPassword)}>
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeIcon>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar Nova Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeIcon>
        </InputContainer>

        <Button onClick={handleSaveProfile}>Salvar Alterações</Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Container>
    </>
  );
};

export default Settings;
