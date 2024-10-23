import React, { useEffect, useState } from 'react';
import * as Styled from './Register';
import * as Filter from '../components/PostList';
import axios from 'axios';
import styled from 'styled-components';
import { FaSyncAlt, FaUser } from 'react-icons/fa';
import HeaderApp from '../components/HeaderApp';
import { ptBR } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import Modal from 'react-modal';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: transparent;
`;

const PostList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 60px;
  justify-content: center;
`;

const PostItem = styled.div`
  position: relative;
  margin-bottom: 30px;
  flex: 1 1 350px;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 15px 30px;
  background: #eee;
  height: 270px;
  width: 100%;
  border-radius: 20px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    animation: shake 0.5s ease-in-out infinite;
  }

  @keyframes shake {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    10% {
      transform: translate(2px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-2px, 2px) rotate(1deg);
    }
    30% {
      transform: translate(2px, 2px) rotate(0.5deg);
    }
    40% {
      transform: translate(-2px, -2px) rotate(-0.5deg);
    }
    50% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    60% {
      transform: translate(-1px, 1px) rotate(-1deg);
    }
    70% {
      transform: translate(2px, 0) rotate(0.5deg);
    }
    80% {
      transform: translate(-2px, 0) rotate(-0.5deg);
    }
    90% {
      transform: translate(1px, 1px) rotate(0.2deg);
    }
  }

  @media (max-width: 800px) {
    flex: 1 1 100%;
  }
`;

const ProfilePic = styled.img`
  position: absolute;
  margin-top: -40px;
  border: 10px white solid;
  top: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const MatchIcon = styled.div`
  position: absolute;
  left: -5px;
  top: -5px;
  background-color: #007bff;
  width: 40px;
  color: #eee;
  height: 40px;
  border: 5px white solid;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UserInfo = styled.p`
  font-size: 1em;
  margin: 0;
  margin-top: 100px;
  color: #333;
  text-align: center;
  font-weight: 700;
`;

const MainSkill = styled.p`
  color: black;
  font-weight: 600;
  margin-top: 110px;
  text-align: center;
`;

const PostTime = styled.p`
  position: absolute;
  bottom: 15px;
  font-size: 12px;
  color: #999;
  margin: 0px 0;
  text-align: center;
  width: calc(100% - 40px);
`;

const SkillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  justify-content: center;
  margin-top: 0px;
  margin-bottom: 80px;
`;

const SkillBadge = styled.span`
  background-color: #007bff;
  font-size: 12px;
  padding: 10px 20px;
  border-radius: 20px;
  color: white;
`;

const ModalButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s ease;
  border-radius: 500px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalHeader = styled.h2`
  margin: 0 0 10px;
  color: #007bff;
`;

const ModalContent = styled.p`
  margin-bottom: 20px;
`;

const Swaps = () => {
  const [receivedMatches, setReceivedMatches] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const [order, setOrder] = useState('newest');

  useEffect(() => {
    const fetchReceivedMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/api/swaps/received-matches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReceivedMatches(response.data);
      } catch (err) {
        setError('Erro ao buscar os matches recebidos.');
        console.error(err);
      }
    };

    fetchReceivedMatches();
  }, []);

  const handleOrderChange = (event) => {
    const newOrder = event.target.value;
    setOrder(newOrder);
    localStorage.setItem('postOrder', newOrder);
  };

  // Função para ordenar os matches com base no estado 'order'
  const sortedMatches = [...receivedMatches].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === 'newest' ? dateB - dateA : dateA - dateB; // Ordena com base na data
  });

  if (error) {
    return <div>{error}</div>;
  }

  const handleConfirmMatch = async () => {
    if (!currentMatchId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:5000/match/confirm/${currentMatchId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReceivedMatches((prev) => prev.filter(match => match._id !== currentMatchId));
      closeModal();
    } catch (error) {
      console.error('Erro ao confirmar o match:', error);
      setError('Erro ao confirmar o match.');
    }
  };

  const openModal = (matchId) => {
    setCurrentMatchId(matchId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMatchId(null);
  };

  return (
    <>
      <HeaderApp />
      <Container>
        <Styled.Title style={{ marginTop: '100px' }}>Aqui você pode ver quem te deu <Styled.SpanColor>Swaps</Styled.SpanColor></Styled.Title>
        {sortedMatches.length === 0 ? (
          <p className='centerP'>Você ainda não recebeu Swaps em nenhum post.</p>
        ) : (
          <PostList>
            {sortedMatches.map((match) => {
              const postDate = new Date(match.createdAt);
              const timePosted = formatDistanceToNow(postDate, { locale: ptBR });

              const matchedUser = match.userId._id === localStorage.getItem('userId') ? match.matchedUserId : match.userId;

              return (
                <PostItem onClick={() => openModal(match._id)} key={match._id}>
                  <ProfilePic src={`http://127.0.0.1:5000${matchedUser.photo}`} alt="Profile" />
                  <MainSkill>{matchedUser.mainSkill}</MainSkill>
                  <PostTime>{matchedUser.username} te deu um Swap há {timePosted}</PostTime>
                  <MatchIcon><FaSyncAlt /></MatchIcon>
                  <SkillContainer>
                    {matchedUser.skills.map((skill, index) => (
                      <SkillBadge key={index}>{skill}</SkillBadge>
                    ))}
                  </SkillContainer>
                </PostItem>
              );
            })}
          </PostList>
        )}
      </Container>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 'flex',
            boxShadow: '0 0px 8px rgba(0, 0, 0, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderRadius: '20px',
            border: 'none',
            left: '50%',
            right: 'auto',
            textAlign: 'center',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '20px 50px',
            width: '200px',
            backdropFilter: 'blur(10px)'
          },
        }}
      >
        <ModalHeader>Confirme o Swap</ModalHeader>
        <ModalContent>Você realmente deseja dar Swap?</ModalContent>
        <div>
          <ModalButton onClick={handleConfirmMatch}>Sim</ModalButton>
          <ModalButton onClick={closeModal}>Não</ModalButton>
        </div>
      </Modal>
    </>
  );
};

export default Swaps;