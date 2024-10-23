import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaUpload } from 'react-icons/fa'; // Ícone para o botão de upload
import * as Styled from './Register'; // Supondo que os styled components estão nesse arquivo
import HeaderApp from '../components/HeaderApp';

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

export const ProfileDiv = styled.div`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
`;

export const ProfilePicContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #dfdfff;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.3s ease;

&:hover {
  filter: brightness(0.5);
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
    border: 1px red solid;
    height: 100%;
    opacity: 0; /* Torna o input invisível */
    cursor: pointer; /* Muda o cursor para pointer */
  }
`;

export const ProfilePic = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

const Error = styled.div`
  margin-top: 13px;
  color: #dc3545;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const Success = styled.div`
  margin-top: 13px;
  color: #28a745;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const Profile = () => {
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
    
        // Chama as funções ao montar o componente
        fetchUser();
        handleResize();
    
        // Adiciona um listener para verificar o tamanho da tela
        window.addEventListener('resize', handleResize);
    
        // Remove o listener ao desmontar o componente
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

    const handleMainSkillChange = (e) => {
        setMainSkill(e.target.value); // Atualiza a mainSkill
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleSaveProfile = async () => {
        const token = localStorage.getItem('token');

        // Crie um FormData para suportar o envio de arquivos junto com os dados
        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('email', email);
        formData.append('mainSkill', mainSkill);
        formData.append('skills', skills.join(','));  // Envie as skills como uma string separada por vírgulas

        if (photo) {
            formData.append('photo', photo);  // Adicione o arquivo de foto se estiver presente
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/updateProfile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Não defina o 'Content-Type', o navegador fará isso automaticamente para multipart/form-data
                },
                body: formData,  // Envie o FormData contendo foto e dados do perfil
            });

            if (response.ok) {
                setSuccess('Perfil atualizado com sucesso!');
                setError('');
                setVisible(true); // Mostra a mensagem
                setIsMessageVisible(true); // Torna a mensagem renderizável
                setTimeout(() => {
                    setVisible(false); // Esconde a mensagem após 3 segundos
                    setTimeout(() => {
                        setIsMessageVisible(false); // Remove a mensagem da renderização após a transição
                    }, 500); // O mesmo tempo que a transição para a opacidade
                }, 500);
            } else {
                const data = await response.json();
                setError(data.message || 'Erro ao salvar perfil');
                setSuccess('');
                setVisible(true); // Mostra a mensagem
                setIsMessageVisible(true); // Torna a mensagem renderizável
                setTimeout(() => {
                    setVisible(false); // Esconde a mensagem após 3 segundos
                    setTimeout(() => {
                        setIsMessageVisible(false); // Remove a mensagem da renderização após a transição
                    }, 500); // O mesmo tempo que a transição para a opacidade
                }, 500);
            }
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            setError('Erro ao salvar perfil');
            setSuccess('');
        }
    };

    const maxLength = 150;

    const removeSkill = async (skillToRemove) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5000/removeSkill', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skill: skillToRemove }),
            });

            if (response.ok) {
                handleRemoveSkill(skillToRemove); // Atualiza o estado localmente após a remoção no servidor
                setSuccess('Habilidade removida com sucesso!');
                setError('');
            } else {
                const data = await response.json();
                setError(data.error || 'Erro ao remover habilidade');
                setSuccess('');
            }
        } catch (error) {
            console.error('Erro ao remover habilidade:', error);
            setError('Erro ao remover habilidade');
            setSuccess('');
        }
    };

    const handleSkillChange = (e) => {
        const selectedSkill = e.target.value;

        if (selectedSkill && !skills.includes(selectedSkill)) {
            if (skills.length < 5) {
                setSkills([...skills, selectedSkill]);
                setNewSkill('');
                setError('');
                setSuccess('');
                setIsMessageVisible(true); // Mostrar mensagem de sucesso aqui se necessário
            } else {
                setError('Você só pode adicionar até 5 skills.');
                setSuccess('');
                setIsMessageVisible(true);
            }
        } else if (skills.includes(selectedSkill)) {
            setError('Você já adicionou esta skill.');
            setSuccess('');
            setIsMessageVisible(true);
        }
    };

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

    const handleRemoveSkill = (skillToRemove) => {
        setSkills((prevSkills) => prevSkills.filter(skill => skill !== skillToRemove));
    };

    return (
        <>
        <HeaderApp></HeaderApp>
            <Container>
                {user ? (
                    <>
                        <Styled.Title>Olá {user.username || 'usuário'}, vamos configurar <Styled.SpanColor>sua conta?</Styled.SpanColor></Styled.Title>
                        <ProfileDiv>
                            <ProfilePicContainer>
                                <ProfilePic
                                    src={photo ? URL.createObjectURL(photo) : `http://127.0.0.1:5000${user.photo}` || 'default.jpg'}
                                    alt="Profile" />
                                <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                            </ProfilePicContainer>

                            <h3>{user.mainSkill || 'Nenhuma skill selecionada'}</h3>
                        </ProfileDiv>

                        <Styled.AreaBio>
                            <Styled.TextArea
                                maxLength={maxLength}
                                value={bio}
                                onChange={handleBioChange}
                                placeholder="Conte um pouco mais sobre você e seus projetos..." />

                            <Styled.CharacterCount>{bio.length}/{maxLength}</Styled.CharacterCount>
                        </Styled.AreaBio>

                        <Styled.InputContainer>
                            <Styled.SkillSelect onChange={handleMainSkillChange}>
                                <option value="">Trocar habilidade:</option>
                                {availableMainSkills.map(skill => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </Styled.SkillSelect>
                        </Styled.InputContainer>
                        <Styled.InputContainer>
                            <Styled.SkillSelect onChange={handleSkillChange}>
                                <option value="">Alterar minhas skills:</option>
                                {availableSkills.map((skill) => (
                                    <option key={skill} value={skill}>
                                        {skill}
                                    </option>
                                ))}
                            </Styled.SkillSelect>
                        </Styled.InputContainer>
                        <Styled.SkillContainer>
                            {skills.map(skill => (
                                <Styled.SkillBadge key={skill}>
                                    {skill}
                                    <Styled.RemoveSkillButton onClick={() => removeSkill(skill)}>x</Styled.RemoveSkillButton>
                                </Styled.SkillBadge>
                            ))}
                        </Styled.SkillContainer>
                        <div style={{ textAlign: 'center' }}>
                            {isMessageVisible && error && (
                                <Error visible={isMessageVisible}>
                                    {error}
                                </Error>
                            )}
                            {isMessageVisible && success && (
                                <Success visible={isMessageVisible}>
                                    {success}
                                </Success>
                            )}
                        </div>



                        <Styled.Button style={{ marginTop: '15px' }} primary onClick={handleSaveProfile}>Salvar Alterações</Styled.Button>
                    </>
                ) : (
                    <div></div>
                )}
            </Container>
        </>
    );
};

export default Profile;
