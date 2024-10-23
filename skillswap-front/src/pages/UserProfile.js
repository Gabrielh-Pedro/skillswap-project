import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import HeaderApp from '../components/HeaderApp';
import * as StyledProfile from './Profile';
import { useParams } from 'react-router-dom'; // Importar useParams
import * as Styled from './Register'; // Supondo que os styled components estão nesse arquivo

const Container = styled.div`
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
  margin-top: 70px;
`;

export const SkillBadge = styled.span`
  display: flex;
  align-items: center;
  background-color: #007bff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;
  color: white;
`;

export const SkillItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const UserProfile = ({ onClose }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Usar useParams para obter o ID da URL

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!id) {
                setError('ID do usuário não fornecido.');
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const response = await axios.get(`http://127.0.0.1:5000/users/${id}`);
                setProfile(response.data.user);
            } catch (error) {
                console.error('Erro ao carregar o perfil do usuário:', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data.error : 'Erro ao carregar o perfil do usuário');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    if (loading) return <div></div>;
    if (error) return <div>{error}</div>;
    if (!profile) return <div>Perfil não encontrado.</div>;

    return (
        <>
            <HeaderApp />
            <Container>
                <Styled.Title>Você está vendo o perfil de  <Styled.SpanColor>{profile.username}</Styled.SpanColor></Styled.Title>
                <StyledProfile.ProfileDiv>
                    <StyledProfile.ProfilePicContainer>
                        <StyledProfile.ProfilePic
                            src={profile.photo ? `http://127.0.0.1:5000${profile.photo}` : 'default.jpg'}
                            alt="Profile" />
                    </StyledProfile.ProfilePicContainer>

                    <h3>{profile.mainSkill || 'Nenhuma skill selecionada'}</h3>
                </StyledProfile.ProfileDiv>

                <Styled.AreaBio>
                            <Styled.TextArea
                                readOnly
                                value={profile.bio}
                                />

                        </Styled.AreaBio>

                <Styled.SkillContainer>
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                                <SkillBadge key={index}>{skill}</SkillBadge>
                            ))
                        ) : (
                            <SkillItem>Nenhuma skill adicionada</SkillItem>
                        )}
                </Styled.SkillContainer>
            </Container>
        </>
    );
};

export default UserProfile;
