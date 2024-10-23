import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrash, FaSyncAlt } from 'react-icons/fa';
import { formatDistanceToNow, format } from 'date-fns';
import styled, { keyframes } from 'styled-components';
import './styles/CreatePost.css'
import { useNavigate } from 'react-router-dom';
import UserProfile from '../pages/UserProfile';
import { ptBR } from 'date-fns/locale';
import Popup from './Popup';

const heartAnimation = keyframes`
  0% {
    transform: translateY(100px); /* Começa embaixo */
    opacity: 0;
  }
  50% {
    opacity: 1; /* Fica visível no meio do caminho */
  }
  100% {
    transform: translateY(-100px); /* Sobe para cima */
    opacity: 0; /* Desaparece no final */
  }
`;

const Heart = styled.div`
  position: absolute;
  font-size: ${(props) => props.size || 24}px; /* Tamanho aleatório */
  color: red;
  bottom: 0; /* Começa na parte inferior */
  left: ${(props) => props.left || 0}px; /* Posição horizontal aleatória */
  animation: ${heartAnimation} 2s ease forwards; /* Dura 2 segundos */

  /* Oscilação leve */
  @keyframes heartAnimation {
    0% {
      transform: translateY(100px); /* Começa embaixo */
      opacity: 0;
    }
    50% {
      opacity: 1; /* Fica visível no meio do caminho */
    }
    100% {
      transform: translateY(-100px); /* Sobe para cima */
      opacity: 0; /* Desaparece no final */
    }
  }
`;

const PostContainer = styled.div`
position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  margin: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  max-width: 500px;
  width: 100%;
  background-color: #eeeeee;
  box-sizing: border-box;

`;

const ProfileArea = styled.div`
position: relative;
  display: flex;
  left: 0;
  align-items: center;
  margin-bottom: 15px;
  width: calc(100% - 40px); /* Subtrai 40px do total para ajustar o espaço */
`;

const ProfilePic = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-align: left;
`;

const PostDescription = styled.p`
  width: calc(100% - 40px); /* Ajusta o espaço */
  overflow: hidden; /* Oculta o texto que excede a altura */
  font-size: 14px;
  margin-top: 12px;
  font-weight: 500;
  margin-bottom: 5px;
  color: black;
  text-align: left;
  line-height: 1.5; /* Melhora a legibilidade */
`;


const PostImage = styled.img`
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 0px;
  object-fit: cover;
  margin-top: 0px;
`;

const SkillItem = styled.div`
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-family: 'Lato', sans-serif;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #1e8bb8;
    transform: scale(1.05);
  }
`;

const ButtonsArea = styled.div`
 display: flex;
 gap: 5px;
  width: calc(100% - 40px); /* Subtrai 40px do total para ajustar o espaço */
`;

const Button = styled.button`
  margin-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1e8bb8;
  }

  svg {
    margin-right: 5px;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff4c4c;

  &:hover {
    background-color: #ff0000;
  }
`;


const PostTime = styled.p`
  font-size: 12px;
  color: #999;
  margin: 0px 0;
  text-align: left;
  width: calc(100% - 40px);
`;

const Post = ({ post, onMatch, onDelete, currentUserId }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const isAuthor = post.user._id === currentUserId;
  const postDate = new Date(post.createdAt);
  const [matched, setMatched] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hearts, setHearts] = useState([]);
  const navigate = useNavigate();

  // Calcula a diferença de tempo
  const now = new Date();
  const differenceInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
  const timePosted = differenceInHours < 24
    ? `Postado há ${formatDistanceToNow(postDate, { locale: ptBR })}`
    : `Postado dia ${format(postDate, 'dd/MM/yyyy', { locale: ptBR })} às ${format(postDate, 'HH:mm', { locale: ptBR })}`;

  const handleProfileClick = () => {

    if (post.user._id) {
      if (post.user._id === currentUserId) {
        navigate('/profile'); // Redireciona para configurações se for o próprio perfil
      } else {
        navigate(`/userInfo/${post.user._id}`); // Redireciona para o perfil de outro usuário
      }
    } else {
      console.error('ID do usuário não encontrado');
    }
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Aqui você pode verificar se o post já foi matchado com o usuário atual através do backend,
    // usando uma chamada para o seu endpoint de "match", se necessário.
    const checkIfMatched = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/check-matched/${post._id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // ou como você estiver passando o token
          },
        });
        const data = await response.json();
        setMatched(data.matched); // Atualiza o estado baseado na resposta do backend
      } catch (error) {
        console.error('Erro ao verificar se o post já foi matchado:', error);
      }
    };
  
    checkIfMatched(); // Chama a função para verificar se já foi matchado
  }, [post._id]);
  
  const handleMatchClick = async () => {
    if (!matched) {
      setMatched(true);
      await onMatch(post._id); // Chama a função para dar o match no post
  
      createHeartAnimation(); // Inicia a animação dos corações
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHearts([]);
    }, 2000); // Remove os corações após 2 segundos

    return () => clearTimeout(timer); // Limpa o timer
  }, [hearts]);

  const createHeartAnimation = () => {
    const heartCount = 5; // Número total de corações a serem criados
    const interval = 400; // Intervalo em milissegundos entre a criação de cada coração

    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        const size = Math.floor(Math.random() * 20) + 20; // Tamanho aleatório entre 20px e 40px
        const left = Math.floor(Math.random() * 100); // Posição horizontal aleatória dentro do container

        // Cria um novo coração
        setHearts(prev => [
          ...prev,
          { id: Date.now() + Math.random(), size, left },
        ]);
      }, i * interval); // Atraso para cada coração baseado no índice
    }
  };

  const handleDeleteClick = () => {
    setShowPopup(true); // Exibe o popup ao clicar em "Excluir"
  };

  const handleConfirmDelete = () => {
    setShowPopup(false); // Esconde o popup
    onDelete(post._id);  // Confirma a exclusão
  };

  const handleCancelDelete = () => {
    setShowPopup(false); // Cancela a exclusão e esconde o popup
  };

  const handleCloseProfile = () => {
    setShowUserProfile(false); // Fecha o perfil do usuário
  };

  return (
    <PostContainer>
      {showUserProfile && (
        <UserProfile user={post.user} onClose={handleCloseProfile} />
      )}
      <ProfileArea>
        <ProfilePic
          src={post.user.photo ? `http://127.0.0.1:5000${post.user.photo}` : 'default.jpg'}
          alt="Profile"
          onClick={handleProfileClick} // Adicione o evento de clique
        />
        <UserInfo>
          <h3 onClick={handleProfileClick} id='createUserName'>{post.user.username}</h3>
          <p id='sublimUserName'>{post.user.mainSkill || 'Nenhuma skill selecionada'}</p>
        </UserInfo>
        <div className='skills-container5'>
          {post.user.skills.map((skill, index) => (
            <SkillItem className="skill-item5" key={index}>{skill}</SkillItem>
          ))}
        </div>
      </ProfileArea>
      <div className="skills-container-mobile2">
        {post.user.skills.map((skill, index) => (
          <div key={index} className="skill-item5">{skill}</div>
        ))}
      </div>
      {post.imageUrl && <PostImage src={post.imageUrl ? `http://127.0.0.1:5000${post.imageUrl}` : 'default.jpg'} alt="Post" />}
      <PostDescription>{post.description}</PostDescription>
      <PostTime>{timePosted}</PostTime> {/* Aqui é onde o tempo será exibido */}
      <ButtonsArea>
        <ButtonsArea>
          {!isAuthor && (
            <Button
              onClick={handleMatchClick}
              style={{ fontWeight: matched ? "600" : "500", color: matched ? "#007bff" : "white", border:  matched ? "2px #007bff solid" : "none", backgroundColor: matched ? "transparent" : "#007bff" }}
            >
              <FaSyncAlt /> {matched ? "Swapped" : "Swap"}
            </Button>
          )}

          {matched && (
            <>
              {matched && hearts.map((heart) => (
                <Heart key={heart.id} size={heart.size} left={heart.left}>
                  🔄
                </Heart>
              ))}
            </>
          )}

          {isAuthor && (
            <DeleteButton onClick={handleDeleteClick}>
              <FaTrash /> Excluir
            </DeleteButton>
          )}
        </ButtonsArea>
        {showPopup && (
          <Popup
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </ButtonsArea>
    </PostContainer>
  );
};

export default Post;

