import React from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import * as Styled from './Register'; // Supondo que os styled components estão nesse arquivo
import { FaIdCard, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import animationData from './animation.json'; // Importando a animação JSON

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  margin: 0 auto;

  @media screen and (max-width: 930px) {
        align-items: center;
        flex-direction: column;
    }
`;

const AnimationContainer = styled.div`
  position: relative;
  right: 0;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 930px) {
       width: 100%;
    }
`;

const TextArea = styled.div`
padding-left: 80px;
position: relative;
right: 0;
width: 50%;
display: flex;
box-sizing: border-box;
justify-content: center;
flex-direction: column;

@media screen and (max-width: 930px) {
       width: 100%;
       text-align: center;
       align-items: center;
       padding-left: 5px;
    padding-right: 5px;
    }
`;

const Title = styled.h1`
font-size: 42px;
font-weight: 600;
margin: 0;
`;

const Span = styled.h1`
font-size: 18px;
font-weight: 500;
margin: 0;
margin-top: 5px;
`;

const SpanColor = styled.h1`
font-size: 50px;
margin: 0;
color: #007bff;
`;

const Text = styled.p`
font-size: 16px;
margin: 0;
width: 90%;
margin-top: 20px;
`;

const ButtonsArea = styled.div`
height: auto;
display: flex;
gap: 10px;
margin-top: 20px;
`;

const Button = styled.button`
padding: 8px 20px;
 background-color: ${({ primary }) => (primary ? '#007bff' : 'transparent')};
 border: ${({ primary }) => (primary ? 'none' : '#007bff 2px solid')};
 color: ${({ primary }) => (primary ? 'white' : '#007bff')};
 font-weight: ${({ primary }) => (primary ? '' : '600')};

 &:hover {
    background-color: ${({ primary }) => (primary ? '' : 'transparent')};
 border: ${({ primary }) => (primary ? 'none' : '#007bff 2px solid')};
 color: ${({ primary }) => (primary ? 'white' : '#007bff')};
 transform: scale(1.02);
 }
`;

const StyledLottie = styled(Lottie)`
  width: 90%; // Define a largura como 100%
  height: auto; // Define a altura como 100%
`;

const Home = () => {
    const navigate = useNavigate(); // Hook para navegação

    return (
        <>
            <Header />
            <Container>
                <TextArea>
                    <Title>
                        Seja bem-vindo(a) a <SpanColor>SkillSwap!</SpanColor><Span>Juntos inovando a conexão de profissionais da área tecnológica!</Span>
                    </Title>
                    <Text>
                        SkillSwap é uma rede social inovadora voltada para desenvolvedores, designers e profissionais de TI, criada para facilitar conexões e trocas de habilidades. A plataforma permite que usuários compartilhem suas principais competências, colaborem em projetos, e encontrem pessoas com habilidades complementares. Além disso, o sistema intuitivo de registro e perfil personalizado permite uma experiência de navegação fluida e interativa.
                    </Text>
                    <ButtonsArea>
                        <Button primary onClick={() => navigate('/login')}>Fazer login</Button>
                        <Button onClick={() => navigate('/register')}>Criar conta</Button>
                    </ButtonsArea>
                </TextArea>
                <AnimationContainer>
                    <StyledLottie animationData={animationData} loop={true} />
                </AnimationContainer>
            </Container>
            <Footer />
        </>
    );
};

export default Home;
