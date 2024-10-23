import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaEye, FaEyeSlash, FaLock, FaPlus, FaUnlockAlt, FaEnvelope, FaWhatsapp, FaIdCard, FaLinkedin, FaDiscord } from 'react-icons/fa';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsContainer = styled.div`
  margin: 0px 0;
  padding: 25px;
  padding-top: 0px;
  background-color: #dfdfff;
  border-radius: 20px;
  text-align: center; /* Centraliza todo o texto */
  max-height: 400px;
  overflow-y: auto; 
  &::-webkit-scrollbar {
    display: none; /* Esconde a scrollbar */
  }
`;

const TermsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  font-weight: bold; /* Deixa o título em negrito */
`;

const TermsList = styled.ol`
  list-style-type: none;
  padding: 0; /* Remove o padding padrão */
`;

const TermsItem = styled.li`
  margin: 10px 0;
  font-size: 1rem; /* Ajusta o tamanho da fonte para melhor legibilidade */
`;

const AcceptTermsContainer = styled.div`
  margin-top: 15px; /* Espaçamento acima do toggle */
  display: flex;
  align-items: center;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 30px;
  height: 16px;
`;

const ToggleCheckbox = styled.input`
  opacity: 0; /* Esconde o checkbox padrão */
  width: 0;
  height: 0;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%; /* Canto arredondado */
  }

  ${ToggleCheckbox}:checked + & {
    background-color: #007bff; /* Cor quando ativado */
  }

  ${ToggleCheckbox}:checked + &::before {
    transform: translateX(13px); /* Move a bolinha para a direita */
  }
`;

const AcceptTermsLabel = styled.span`
  margin-left: 10px; /* Espaçamento entre o toggle e o texto */
  font-size: 0.9rem;
  color: #555;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 10px;
`;
const ImageCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #dfdfff;
  margin-bottom: 0px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.3s ease;

  &:hover {
    filter: brightness(0.5);
  }

  /* Estilo da borda animada
  &:before {
    content: '';
    position: absolute;
    top: -8px; 
    left: -8px; 
    width: calc(100% + 8px); 
    height: calc(100% + 8px); 
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: #007bff;
    animation: spin 2s linear infinite;
    z-index: 0; 
  } */

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0; /* Torna o input invisível */
    cursor: pointer; /* Muda o cursor para pointer */
  }
`;

const UserName = styled.span`
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  text-align: center;
`;

export const InputContainer2 = styled.div`
  position: relative;
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 400px;
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 20px;
  padding-right: 20px;
  height: auto;
  margin: 0 auto;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
`;

const StepCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
`;

const Circle = styled.div`
  width: 30px;
  height: 30px;
  font-size: 12px;
  border-radius: 50%;
  border: ${(props) => {
    if (props.$active) return '7px white solid';
    if (props.$completed) return '';
    return '7px white solid';
  }};

  background-color: ${(props) => {
    if (props.$active) return '#007bff';
    if (props.$completed) return '#28a745';
    return '#333';
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin: 0 0px;
  z-index: 2;
  position: relative;

  ${(props) =>
    props.$active &&
    `
    &:before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      border-radius: 100%;
      border: 4px solid transparent;
      border-top-color: #007bff;
      animation: spin 2s linear infinite;
      z-index: 0;
    }
  `}

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StepText = styled.span`
  margin-top: 5px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.$active ? '#007bff' : props.$completed ? '#28a745' : '#333')};
`;

const ConnectionLine = styled.div`
  position: absolute;
  top: 20px; /* Ajuste a posição vertical */
  left: 50%;
  width: 70%;
  height: 2px;
  background-color: ${(props) => {
    if (props.$completed) return '#28a745'; // Verde se todos os passos estão completos
    if (props.$active) return '#007bff'; // Azul se o passo atual
    return '#333'; // Cinza se não estiver completo
  }};
  z-index: 1;
  transform: translateX(-50%);
  pointer-events: none; /* Para que não interfira na interação com os círculos */
`;

export const InputContainer = styled.div`
  position: relative;
`;

export const InputWithIcon = styled.input`
  padding: 10px 10px 10px 35px; // Espaço para o ícone
  border: none; // Remover todas as bordas inicialmente
  border-bottom: 1px solid ${(props) => (props.$valid ? '#007bff' : '#333')}; // Borda inferior
  font-weight: 500;
  width: 100%;
  margin-bottom: 10px;
  font-size: 12px;
  box-sizing: border-box;
  font-family: 'Open Sans';
  
  &:focus {
    outline: none; // Remover o contorno padrão do browser
    border-bottom: 2px solid #007bff; // Borda inferior azul ao focar
  }
`;

export const Icon = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  color: ${(props) => (props.$valid ? '#007bff' : '#333')}; // Azul se válido
  color: ${(props) => (props.$valid || props.$focused ? '#007bff' : '#333')}; // Azul se válido ou focado
`;


export const Title = styled.div`
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
  font-family: 'Open Sans';
`;

export const SpanColor = styled.span`
  color: #007bff;
  font-weight: 600;
`;

export const Button = styled.button`
  padding: 10px;
  width: 100%;
  background-color: ${(props) => (props.primary ? "#007bff" : "transparent")};
  color: white;
  color: ${(props) => (props.primary ? "white" : "#007bff")};
  border: ${(props) => (props.primary ? "none" : "2px solid #007bff")};
  border-radius: 40px;
  margin-bottom: 0px;
  font-weight: ${(props) => (props.primary ? "" : "600")};
  margin-top:  ${(props) => (props.primary ? "10px" : "10px")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.primary ? "#0056b3" : "transparent")};
  }
`;

export const TextArea = styled.textarea`
position: relative;
  padding: 15px;
  margin-bottom: 15px;
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  font-family: 'Open Sans';
  border: 1px solid #ccc;
  border-radius: 10px;
  resize: none;
`;

export const SkillSelect = styled.select`
appearance: none;
  padding: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #007bff;
  }

`;

export const SkillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 3px;
`;

export const SkillBadge = styled.span`
  display: flex;
  align-items: center;
  background-color: #007bff;
  padding: 0px 5px;
  padding-left: 15px;
  cursor: pointer;
  border-radius: 20px;
  color: white;
`;

export const RemoveSkillButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 15px;
  cursor: pointer;
  margin-left: 5px;
  transition: all 0.3s ease;
  &:hover {
    color: #ff4d4d;
    font-weight: bolder;
  }
`;

export const AreaBio = styled.div`
position: relative;
`;

export const CharacterCount = styled.p`
position: absolute;
right: 10px;
bottom: 15px;
  font-size: 12px;
  color: ${props => props.exceeded ? 'red' : 'gray'};
  text-align: right;
`;

export const ErrorMessage = styled.span`
  color: #ff4d4d;
  font-size: 12px;
  font-weight: 600;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    skills: [],
    photo: null,
    termsAccepted: false,
    mainSkill: '',
    whatsapp: '',
    discord: '',
    linkedin: '',
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const availableMainSkills = [
    'AI/ML Engineer',
    'Back-end',
    'Cloud Engineer',
    'Cybersecurity Specialist',
    'Data Scientist',
    'Designer',
    'DevOps',
    'Full Stack',
    'Game Developer',
    'Mobile Developer',
    'QA Tester',
    'UI/UX Designer'
  ];

  const availableSkills = [
    'Angular',
    'AWS',
    'Bootstrap',
    'C#',
    'C++',
    'CSS',
    'Django',
    'Docker',
    'Express.js',
    'Flask',
    'Git',
    'Google Cloud',
    'HTML',
    'Java',
    'JavaScript',
    'Jenkins',
    'Kotlin',
    'Kubernetes',
    'MongoDB',
    'Node.js',
    'PHP',
    'Python',
    'React',
    'Ruby on Rails',
    'Rust',
    'Sass',
    'SQL',
    'Tailwind CSS',
    'Terraform',
    'TypeScript',
    'Vue.js'
  ];

  const formatFullName = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatWhatsNumber = (number) => {
    // Remove todos os caracteres que não são números
    let cleaned = number.replace(/\D/g, '');
  
    // Limita o número a no máximo 11 dígitos
    if (cleaned.length > 11) {
      cleaned = cleaned.slice(0, 11);
    }
  
    // Aplica a formatação somente se o número tiver 11 dígitos
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
  
    // Caso contrário, exibe apenas os números sem formatação
    return cleaned;
  };  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'fullName') {
      setFormData({
        ...formData,
        [name]: formatFullName(value),
      });
    } else if (name === 'whatsapp') {
      setFormData({
        ...formData,
        [name]: formatWhatsNumber(value),  // Aplica a formatação do WhatsApp
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] })); // Permite alterar a foto mais de uma vez
  };

  const handleSkillChange = (e) => {
    const selectedSkill = e.target.value;

    if (selectedSkill === "") return;

    if (formData.skills.length >= 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        skills: "Você pode adicionar no máximo 5 habilidades.",
      }));
    } else if (!formData.skills.includes(selectedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, selectedSkill],
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        skills: "",
      }));
    }
  };

  const handleMainSkillChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      mainSkill: e.target.value,
    }));
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      termsAccepted: !prev.termsAccepted,
    }));
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const validateForm = async () => {
    const { fullName, username, email, password, confirmPassword, whatsapp, linkedin, discord } = formData;
    let validationErrors = {};

    const nameRegex = /^[A-ZÀ-Ÿ][a-zà-ÿ]*(?:\s[A-ZÀ-Ÿ][a-zà-ÿ]*)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9._]{6,15}$/;
    const whatsappRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-À-ÿ]+\/?$/;

    // Validações principais
    if (!nameRegex.test(fullName)) {
      validationErrors.fullName = "Nome completo inválido. Exemplo: 'João da Silva'.";
    }
    if (!usernameRegex.test(username)) {
      validationErrors.username = "O nome de usuário deve ter entre 6 e 15 caracteres.";
    }
    if (!username) {
      validationErrors.username = "Nome de usuário é obrigatório.";
    }
    if (!emailRegex.test(email)) {
      validationErrors.email = "E-mail inválido.";
    }
    if (!passwordRegex.test(password)) {
      validationErrors.password = "A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula e um número.";
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "A confirmação da senha não coincide.";
    }

    // Validação condicional para redes sociais
    const socialNetworksFilled = whatsapp || linkedin || discord;

    if (!socialNetworksFilled) {
      validationErrors.social = "Você deve preencher pelo menos uma rede social: WhatsApp, LinkedIn ou Discord.";
    }

    // Valida WhatsApp somente se preenchido
    if (whatsapp && !whatsappRegex.test(whatsapp)) {
      validationErrors.whatsapp = "Formato de WhatsApp inválido. Exemplo: (99) 99999-9999.";
    }

    // Valida LinkedIn somente se preenchido
    if (linkedin && !linkedinRegex.test(linkedin)) {
      validationErrors.linkedin = "A URL do LinkedIn deve estar no formato: https://www.linkedin.com/in/nome-do-usuario/";
    }
    // Verificações de disponibilidade de usuário, e-mail e nome
    const availability = await checkUserAvailability(username, email, fullName);
    if (!availability.usernameAvailable) {
      validationErrors.username = "Nome de usuário já existe.";
    }
    if (!availability.emailAvailable) {
      validationErrors.email = "E-mail já cadastrado.";
    }
    if (!availability.fullNameAvailable) {
      validationErrors.fullName = "Nome completo já existe.";
    }

    // Define os erros no estado
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
};

  
  


  const checkUserAvailability = async (username, email, fullName) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/check-availability', {
        username,
        email,
        fullName
      });
      return response.data; // Espera que o servidor retorne um objeto com disponibilidade
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return { usernameAvailable: true, emailAvailable: true, fullNameAvailable: true };
    }
  };

  const [isFocused, setIsFocused] = useState({}); // Para armazenar o estado de foco


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const isValid = await validateForm();
      if (isValid) {
        setStep(2); // Avança apenas se não houver erros
      }
    } else if (step === 2) {
      const { photo, bio, mainSkill, skills } = formData;
      if (photo && bio && mainSkill && skills.length > 0 && skills.length <= 5) {
        setErrors("");
        setStep(3);
      } else {
        setErrors("Por favor, preencha todos os campos necessários.");
      }
    } else if (step === 3) {
      if (formData.termsAccepted) {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });

        try {
          const response = await axios.post('http://127.0.0.1:5000/api/register', formDataToSend);
          setErrors('Registro concluído com sucesso!');
        } catch (error) {
          console.error('Erro de resposta:', error.response);
          setErrors('Erro ao registrar: ' + (error.response?.data?.message || error.message));
        }
      } else {
        setErrors("Você precisa aceitar os termos de contrato.");
      }
    }
  };

  const maxLength = 150;

  return (
    <><><Header /><Form onSubmit={handleSubmit}>
      <Title>Bem-vindo(a), vamos começar <SpanColor>seu registro!</SpanColor></Title>
      <StepIndicator>
        <StepCircle>
          <Circle $active={step === 1} $completed={step > 1}>1</Circle>
          <StepText $active={step === 1} $completed={step > 1}>Suas credenciais</StepText>
        </StepCircle>
        <ConnectionLine $active={step === 2} $completed={step > 1} />
        <StepCircle>
          <Circle $active={step === 2} $completed={step > 2}>2</Circle>
          <StepText $active={step === 2} $completed={step > 2}>Mais sobre você</StepText>
        </StepCircle>
        <ConnectionLine $active={step === 3} $completed={step > 2} />
        <StepCircle>
          <Circle $active={step === 3} $completed={step === 3}>3</Circle>
          <StepText $active={step === 3} $completed={step === 3}>Termos de contrato</StepText>
        </StepCircle>
      </StepIndicator>

      {step === 1 && (
        <>
          <InputContainer>
            <Icon $valid={!!formData.fullName && !errors.fullName}><FaIdCard /></Icon>
            <InputWithIcon
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nome completo"
              $valid={!!formData.fullName && !errors.fullName} />
            <Icon $valid={!!formData.fullName && !errors.fullName || isFocused.fullName}>
              <FaIdCard />
            </Icon>
            {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Icon $valid={!!formData.username}><FaUser /></Icon>
            <InputWithIcon
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nome de usuário"
              $valid={!!formData.username} />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Icon $valid={!!formData.email && !errors.email}><FaEnvelope /></Icon>
            <InputWithIcon
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              $valid={!!formData.email && !errors.email} />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Icon $valid={!!formData.whatsapp && !errors.whatsapp}><FaWhatsapp /></Icon>
            <InputWithIcon
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Digite seu número do Whatsapp"
              $valid={!!formData.whatsapp && !errors.whatsapp} />
            {errors.whatsapp && <ErrorMessage>{errors.whatsapp}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Icon $valid={!!formData.linkedin && !errors.linkedin}><FaLinkedin /></Icon>
            <InputWithIcon
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="Cole a URL do seu perfil no Linkedin"
              $valid={!!formData.linkedin && !errors.linkedin} />
            {errors.linkedin && <ErrorMessage>{errors.linkedin}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Icon $valid={!!formData.discord && !errors.discord}><FaDiscord /></Icon>
            <InputWithIcon
              type="text"
              name="discord"
              value={formData.discord}
              onChange={handleChange}
              placeholder="Digite seu nome de usuário do Discord"
              $valid={!!formData.discord && !errors.discord} />
            {errors.discord && <ErrorMessage>{errors.discord}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Icon $valid={!!formData.password && !errors.password}><FaUnlockAlt /></Icon>
            <InputWithIcon
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha"
              $valid={!!formData.password && !errors.password} />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Icon $valid={!!formData.confirmPassword && !errors.confirmPassword}><FaLock /></Icon>
            <InputWithIcon
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua senha"
              $valid={!!formData.confirmPassword && !errors.confirmPassword} />

            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputContainer>

          {errors.social && <ErrorMessage>{errors.social}</ErrorMessage>}

          <Button primary type="submit">Próximo</Button>
        </>
      )}

      {step === 2 && (
        <>
          <InputContainer2>
            <ProfileImageContainer>
              <ImageCircle>
                {formData.photo ? (
                  <img src={URL.createObjectURL(formData.photo)} alt="User" />
                ) : (
                  <FaPlus size="25px" color="#007bff" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </ImageCircle>
              {formData.fullName && <UserName><SpanColor>{formData.fullName}</SpanColor>, nos diga um pouco mais sobre você</UserName>}
            </ProfileImageContainer>
          </InputContainer2>
          <AreaBio>
            <TextArea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Conte-nos sobre você... (Máximo de 150 caracteres)"
              rows="3"
              maxLength={maxLength} />
            <CharacterCount>{formData.bio.length}/{maxLength}</CharacterCount>
          </AreaBio>

          <InputContainer>
            <SkillSelect onChange={handleMainSkillChange}>
              <option value="">Selecione sua principal habilidade:</option>
              {availableMainSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </SkillSelect>
          </InputContainer>
          <InputContainer>
            <SkillSelect name="skills" onChange={handleSkillChange}>
              <option value="">Selecione até 5 skills:</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </SkillSelect>
          </InputContainer>
          <SkillContainer>
            {formData.skills.map(skill => (
              <SkillBadge key={skill}>
                {skill}
                <RemoveSkillButton onClick={() => handleRemoveSkill(skill)}>x</RemoveSkillButton>
              </SkillBadge>
            ))}
          </SkillContainer>
          {errors.skills && <ErrorMessage>{errors.skills}</ErrorMessage>}
          {errors && typeof errors === "string" && <ErrorMessage>{errors}</ErrorMessage>}
          <Button primary type="submit">Próximo</Button>
          <Button type="button" onClick={handleBack}>Voltar</Button>
        </>
      )}

      {step === 3 && (
        <>
          <TermsContainer>
            <TermsTitle>Termos de Contrato</TermsTitle>
            <TermsList>
              <TermsItem>Ao se cadastrar no SkillSwap, você concorda em fornecer informações verdadeiras e precisas, incluindo seu nome completo e e-mail.</TermsItem>
              <TermsItem>Todos os dados cadastrados, como nome completo e e-mail, serão visíveis para todos os usuários da plataforma, promovendo a transparência e a interação.</TermsItem>
              <TermsItem>Você concorda em respeitar as diretrizes da comunidade SkillSwap e a manter um ambiente de respeito e colaboração entre os usuários.</TermsItem>
              <TermsItem>O SkillSwap se reserva o direito de alterar ou modificar estes termos a qualquer momento, e é sua responsabilidade revisar as atualizações.</TermsItem>
            </TermsList>
          </TermsContainer>

          <AcceptTermsContainer>
            <ToggleSwitch>
              <ToggleCheckbox
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange} />
              <Slider />
            </ToggleSwitch>
            <AcceptTermsLabel>Eu aceito os termos de contrato</AcceptTermsLabel>
          </AcceptTermsContainer>

          {errors && typeof errors === "string" && <ErrorMessage>{errors}</ErrorMessage>}


          <Button primary type="submit">Registrar</Button>
          <Button type="button" onClick={handleBack}>Voltar</Button>

        </>
      )}
    </Form></><Footer /></>

  );
};

export default Register;
