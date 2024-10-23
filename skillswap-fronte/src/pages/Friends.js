import React, { useEffect, useState } from 'react';
import * as Styled from './Register'; // Verifique se este import é necessário
import axios from 'axios';
import styled from 'styled-components';
import { FaSyncAlt, FaUser, FaWhatsapp, FaDiscord, FaLinkedin } from 'react-icons/fa';
import HeaderApp from '../components/HeaderApp';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap; /* Permite que os cards se ajustem em múltiplas linhas */
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  background: transparent;
  gap: 20px;
`;

const FriendCard = styled.div`
  background-color: #eee;
  flex: 1 1 350px;
  max-width: 400px;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  padding-bottom: 15px;
  flex-direction: column;
  align-items: center; /* Centraliza os itens no card */
`;

const FriendPhoto = styled.img`
  position: relative;
  left: 0;
  width: 100px; /* Ajuste o tamanho da imagem conforme necessário */
  height: 100px; /* Ajuste o tamanho da imagem conforme necessário */
  object-fit: cover;
  border: 3px white solid;
  border-radius: 50%; /* Faz a imagem ser circular */
`;

const ProfileArea = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const FriendDate = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const FriendDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const FriendName = styled.span`
  margin-top: 10px;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0px;
`;

const FriendUser = styled.span`
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  color: #999;
`;

const FriendSkill = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #007bff;
  margin: 0;
  margin-top: 10px;
`;

const ContactInfo = styled.div`
  margin-top: 10px;
  font-size: 12px;
  text-align: center; /* Centraliza o texto */
`;

const AreaBio = styled.div`
  width: 100%;
  margin-top: 12px;
  font-size: 12px;
  text-align: center; /* Centraliza o texto */
`;

const MatchIcon = styled.div`
  position: absolute;
  right: -0px;
  bottom: -0px;
  background-color: #007bff;
  width: 30px;
  color: #eee;
  height: 30px;
  border: 3px white solid;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextArea = styled.textarea`
position: relative;
  padding: 15px;
  margin-bottom: 0px;
  color: #333;
  width: 100%;
  height: 130px;
  box-sizing: border-box;
  font-family: 'Open Sans';
  background-color: #fff;
  border: none;
  border-radius: 10px;
  resize: none;
  appearance: none;
`;

const SocialIcons = styled.div`
  display: flex;
  margin-top: 12px;
  gap: 15px; /* Espaçamento entre os ícones */
  
  a {
    color: #007bff; /* Mantém a cor dos ícones */
    text-decoration: none;
    transition: all 0.3s;

    &:hover {
      color: #0056b3; /* Cor ao passar o mouse */
    }
  }

  svg {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

const Title = styled.div`
  width: 400px;
  text-align: center;
  font-size: 30px;
  margin-bottom: 20px;
  font-family: 'Open Sans';
`;


const Friends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:5000/api/matches/confirmed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const uniqueFriends = [];
        const seenUserIds = new Set();

        response.data.forEach((friend) => {
          const friendUser = friend.userId._id === localStorage.getItem('userId') ? friend.matchedUserId : friend.userId;

          if (!seenUserIds.has(friendUser._id)) {
            uniqueFriends.push(friend);
            seenUserIds.add(friendUser._id);
          }
        });

        setFriends(uniqueFriends);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };

    fetchFriends();
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos
  };

  return (
    <>
      <HeaderApp />
      <Container>
        <Title style={{ marginTop: '100px' }}>Aqui você pode ver seus <Styled.SpanColor>Swaps</Styled.SpanColor></Title>
        {friends.length === 0 && (
          <Title style={{ marginTop: '100px' }}>Você ainda não deu Swap com ninguém</Title>
        )}

        {friends.map((friend) => {
          const friendUser = friend.userId._id === localStorage.getItem('userId') ? friend.matchedUserId : friend.userId;

          return (
            <FriendCard key={friendUser._id}>
              <ProfileArea>
                <div className='testers'>
                  <FriendPhoto src={`http://127.0.0.1:5000${friendUser.photo}`} alt={`${friendUser.username}'s photo`} />
                  <MatchIcon><FaSyncAlt /></MatchIcon>
                </div>
                <FriendDate>
                  <FriendDesc>
                    <FriendName>{friendUser.fullName}</FriendName>
                    <FriendUser>#{friendUser.username}</FriendUser>
                  </FriendDesc>
                  <FriendSkill>{friendUser.mainSkill}</FriendSkill>
                </FriendDate>
              </ProfileArea>
              <div className="skills-container6">
                {friendUser.skills.map((skill, index) => (
                  <div key={index} className="skill-item5">{skill}</div>
                ))}
              </div>
              <AreaBio>
                <TextArea
                  readOnly
                  value={friendUser.bio}
                />

              </AreaBio>
              <SocialIcons>
                {friendUser.whatsapp && (
                  <a href={`https://wa.me/${formatPhoneNumber(friendUser.whatsapp)}`} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp />
                  </a>
                )}
                {friendUser.discord && (
                  <a href={`https://discord.com/users/${friendUser.discord}`} target="_blank" rel="noopener noreferrer">
                    <FaDiscord />
                  </a>
                )}
                {friendUser.linkedin && (
                  <a href={`${friendUser.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
              </SocialIcons>
            </FriendCard>
          );
        })}
      </Container>
    </>
  );
};

export default Friends;
