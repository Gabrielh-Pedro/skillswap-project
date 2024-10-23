import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaUpload } from 'react-icons/fa'; // Ícone para o botão de upload
import * as Styled from '../pages/Register'; // Supondo que os styled components estão nesse arquivo
import HeaderApp from '../components/HeaderApp';
import axios from 'axios';
import UserProfile from '../pages/UserProfile';

const MainDiv = styled.div`
  position: fixed;
  margin-top: -70px;
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  z-index: 0;
  @media screen and (max-width: 1160px) {
    display: none;
} 
`;

const RightMenu = styled.div`
  position: absolute;
  right: 30px;
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #eee;
  z-index: 20;
  gap: 10px;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const FriendPhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  z-index: 132901230;
  transition: all 0.3s ease;
  
  &:hover {
  filter: brightness(0.5);
}
`;

const UserProfileWrapper = styled.div`
  /* Estilize o UserProfile conforme necessário */
`;

const Direc = styled.div`
position: relative;
  left: 20px;
width: 300px;
height: 50px;
align-items: center;
justify-content: center;
margin-top: 20px;
display: flex;
`;

const Textz = styled.label`
align-items: center;
margin-left: 10px;
font-size: 12px;
font-size: 700;
display: flex;
`;

const Logo = styled.img`
  width: auto;
  height: 20px;
`;

const Container = styled.div`
  position: relative;
  left: 20px;
  width: 300px;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #eee;
  padding-bottom: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  width: 100%;
  background-color: #007bff;
  height: 60px;
  object-fit: cover;
  z-index: 1;
`;

const UserPhoto = styled.img`
  width: 80px; /* Ajuste o tamanho da imagem conforme necessário */
  height: 80px; /* Ajuste o tamanho da imagem conforme necessário */
  object-fit: cover;
  z-index: 2;
  border: 6px #eee solid;
  border-radius: 50%; /* Faz a imagem ser circular */
`;

const UserName = styled.h3`
  font-weight: 600;
  margin: 0;
  margin-top: 0px;
`;

const UserSkill = styled.h3`
  font-weight: 500;
  margin: 0;
  color: #999;
  font-size: 12px;
`;

const AreaBio = styled.div`
  width: 100%;
  margin-top: 0px;
  font-size: 12px;
  text-align: center; /* Centraliza o texto */
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
  text-align: center;
  background-color: #eee;
  border: none;
  border-radius: 10px;
  resize: none;
  appearance: none;
`;

const AppProfile = () => {
    const [user, setUser] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [email, setEmail] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [error, setError] = useState('');
    const [mainSkill, setMainSkill] = useState(user?.mainSkill || '');
    const [success, setSuccess] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [friends, setFriends] = useState([]);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    

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
                    if (!response.ok) throw new Error('Erro ao buscar dados do usuário');
                    const data = await response.json();
                    setUser(data.user);
                    setBio(data.user.bio || '');
                    setSkills(data.user.skills || []);
                    setEmail(data.user.email);
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                    setError('Erro ao buscar dados do usuário');
                }
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 720);
        };

        fetchUser();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isMessageVisible) {
            const timer = setTimeout(() => {
                setIsMessageVisible(false);
                setError(''); // Limpar a mensagem de erro
                setSuccess(''); // Limpar a mensagem de sucesso
            }, 3000); // 3 segundos

            return () => clearTimeout(timer); // Limpa o timer
        }
    }, [isMessageVisible]);

    return (
        <>
            <MainDiv>
                <Container>
                    {user ? (
                        <>
                            <Background></Background>
                            <UserPhoto src={`http://127.0.0.1:5000${user.photo}`} alt={`${user.username}'s photo`} />
                            <UserName>{user.username}</UserName>
                            <UserSkill>{user.mainSkill}</UserSkill>
                            <div style={{ marginTop: '12px' }} className="skills-container6">
                                {user.skills.map((skill, index) => (
                                    <div key={index} className="skill-item5">{skill}</div>
                                ))}
                            </div>
                            <AreaBio>
                                <TextArea
                                    readOnly
                                    value={user.bio}
                                />

                            </AreaBio>
                        </>
                    ) : (
                        <div></div>
                    )}
                </Container>
                <Direc>
                    <Logo src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" />
                    <Textz>SkillSwap Project © 2024</Textz>
                </Direc>
                <RightMenu>
                    {friends.map((friend) => {
                        const friendUser = friend.userId._id === localStorage.getItem('userId') ? friend.matchedUserId : friend.userId;
                        return (
                            <FriendPhoto
                                key={friendUser._id}
                                src={`http://127.0.0.1:5000${friendUser.photo}`}
                                alt={friendUser.username}
                            />
                        );
                    })}
                </RightMenu>

                {selectedUser && (
                    <UserProfileWrapper>
                    </UserProfileWrapper>
                )}
            </MainDiv>
        </>
    );
};

export default AppProfile;
