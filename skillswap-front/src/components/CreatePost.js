import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaImage, FaTimes } from 'react-icons/fa'; // Ícone de mídia
import './styles/CreatePost.css';
import * as Styled from '../pages/Register'; // Supondo que os styled components estão nesse arquivo

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  width: 100%;
  margin: auto;
  padding: 20px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #eeeeee;
`;

const TextArea = styled.textarea`
  position: relative;
  padding: 15px;
  margin-bottom: 0px;
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  font-family: 'Open Sans';
  border: none;
  border-radius: 10px;
  resize: none;
`;

const FileInputWrapper = styled.label`
  font-family: 'Lato', sans-serif;
  display: flex;
  margin-left: 5px;
  align-items: center;
  cursor: pointer;
  background: transparent; /* Remove a cor de fundo */
  color: #007bff;
  font-size: 16px;
  margin-bottom: 20px;
  margin-top: 10px;
  border: none; /* Remove a borda */
  transition: color 0.3s;

  &:hover {
    color: #0056b3; /* Cor ao passar o mouse */
  }

  > svg {
    margin-right: 8px; /* Espaçamento entre ícone e texto */
  }
`;

const HiddenFileInput = styled.input.attrs({ type: 'file' })`
  font-family: 'Lato', sans-serif;
  display: none;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  position: relative;
  margin-bottom: 10px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5); /* Fundo vermelho semi-transparente */
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 0, 0, 0.8); /* Escurece o botão ao passar o mouse */
  }
`;

const Button = styled.button`
  width: 100%;
  cursor: pointer;

  &:hover {
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffcccc;
  color: #d8000c;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-size: 12px;
  border: 1px solid #d8000c;
  border-radius: 50px;
  margin: 10px 0;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  animation: ${({ visible }) => (visible ? fadeIn : fadeOut)} 0.5s ease forwards; // Usa a animação apropriada
`;

const CreateProfileArea = styled.div`
  position: relative;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Slow = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 10px;
`;

const ProfilePic = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const CreatePost = ({ refreshPosts }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const maxLength = 200;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setError('');
      }, 3000); // A mensagem de erro desaparece após 3 segundos

      return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
    }
  }, [showError]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    if (!description || description.trim() === '') {
      setError('A descrição é obrigatória');
      setShowError(true);
      return;
  } else if (description.length < 50) { // Verifica se a descrição tem menos de 50 caracteres
      setError('A descrição deve ter pelo menos 50 caracteres');
      setShowError(true);
      return;
  }
    
    const formData = new FormData();
    formData.append('description', description);
    if (image) formData.append('image', image);

    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:5000/createPost', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (response.ok) {
      // Atualize a lista de posts e limpe o formulário
      setDescription('');
      setImage(null);
      setPreviewImage(null);
      refreshPosts(); // Atualiza a lista de posts após a criação
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Erro ao criar post');
      setShowError(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreviewImage(null);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {user && (
        <>
          <CreateProfileArea>
            <ProfilePic src={`http://127.0.0.1:5000${user.photo}`} alt="Profile" />
            <Slow>
              <h3 id='createUserName'>{user.username}</h3>
              <p id='sublimUserName'>{user.mainSkill || 'Nenhuma skill selecionada'}</p>
            </Slow>
            <div className="skills-container5">
              {user.skills.map((skill, index) => (
                <div key={index} className="skill-item5">{skill}</div>
              ))}
            </div>
          </CreateProfileArea>
          <div className="skills-container-mobile">
            {user.skills.map((skill, index) => (
              <div key={index} className="skill-item5">{skill}</div>
            ))}
          </div>
        </>
      )}
      <div className='midia'>
        <TextArea
          name='description'
          placeholder="O que você está buscando hoje?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={maxLength}
        />
        <Styled.CharacterCount style={{ marginBottom: '50px' }}>{description.length}/{maxLength}</Styled.CharacterCount>
        <FileInputWrapper>
          <FaImage />
          <span>Mídia</span>
          <HiddenFileInput
            accept="image/*"
            onChange={handleImageChange}
          />
        </FileInputWrapper>
      </div>

      {previewImage && (
        <div style={{ position: 'relative' }}>
          <PreviewImage src={previewImage} alt="Preview" />
          <RemoveImageButton onClick={removeImage}><FaTimes size={22} /></RemoveImageButton>
        </div>
      )}

      <Button type="submit">Postar</Button>
      {showError && <ErrorMessage visible>{error}</ErrorMessage>}
    </Form>
  );
};

export default CreatePost;
