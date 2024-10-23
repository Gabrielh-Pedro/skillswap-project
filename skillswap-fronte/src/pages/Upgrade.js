import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa'; // Ícone de check do react-icons
import HeaderApp from '../components/HeaderApp';

// Animação de subida e descida
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* Aumentando o deslocamento */
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 800px;
  height: auto; /* Ajustei para garantir que a altura se adapte melhor */
  margin: 150px auto;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    margin: 100px auto;
    height: auto; /* Ajuste de altura para dispositivos menores */
  }
`;

const BasePlan = styled.div`
  padding: 30px;
  border-radius: 12px;
  flex: 1;
  max-width: 280px;
  min-width: 250px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s ease;
  position: relative;
  &:hover {
    transform: translateY(-8px);
  }

  @media (max-width: 600px) {
    max-width: 20%; /* Para garantir que ocupe 100% da largura em telas pequenas */
    margin-bottom: 20px; /* Adicionar um espaço entre os planos */
  }
`;

const FreePlan = styled(BasePlan)`
  background-color: #eee;
`;

const PremiumPlan = styled(BasePlan)`
  background-color: #e6f0ff; /* Azul claro suave */
  border: 2px solid #007bff; /* Azul forte */
  box-shadow: 0 6px 12px rgba(0, 123, 255, 0.4); /* Sombras em tons de azul */
  animation: ${bounce} 3s ease-in-out infinite; /* Adicionando animação mais suave e visível */
`;

const Title = styled.h2`
  font-size: 24px;
  color: ${props => (props.premium ? '#007bff' : '#333')};
  margin-bottom: 15px;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const FeatureItem = styled.li`
  font-size: 16px;
  color: ${props => (props.premium ? '#007bff' : '#333')};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: 8px;
    font-size: 18px;
  }
`;

const PriceTag = styled.div`
  position: absolute;
  top: -40px;
  left: -40px; /* Preço no canto esquerdo */
  background-color: #007bff;
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
`;

const HighlightBadge = styled.div`
  background-color: #007bff;
  color: white;
  font-weight: bold;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  position: absolute;
  top: -20px;
  right: -20px;
`;

const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Upgrade = () => {
  return (
    <>
      <HeaderApp />
      <Container>
        {/* Plano Free */}
        <FreePlan>
          <PlanWrapper>
            <Title>Plano Free</Title>
            <Description>
              Acesse recursos limitados com o plano Free. Ideal para quem está começando!
            </Description>
            <FeatureList>
              <FeatureItem><FaCheckCircle /> Acesso básico ao sistema</FeatureItem>
              <FeatureItem><FaCheckCircle /> 1 Post a cada 24 horas</FeatureItem>
              <FeatureItem><FaCheckCircle /> 5 Swaps a cada 24 horas</FeatureItem>
              <FeatureItem><FaCheckCircle /> Visualização de perfis públicos</FeatureItem>
            </FeatureList>
          </PlanWrapper>
        </FreePlan>

        {/* Plano Premium */}
        <PremiumPlan>
          <PlanWrapper>
            <HighlightBadge>Mais Popular</HighlightBadge>
            <Title premium>Plano Premium</Title>
            <Description>
              Desbloqueie todos os recursos e aproveite ao máximo nossa plataforma!
            </Description>
            <FeatureList>
              <FeatureItem premium><FaCheckCircle /> Posts ilimitados</FeatureItem>
              <FeatureItem premium><FaCheckCircle /> Swaps ilimitados</FeatureItem>
              <FeatureItem premium><FaCheckCircle /> Suporte prioritário</FeatureItem>
              <FeatureItem premium><FaCheckCircle /> Acesso completo a usuários</FeatureItem>
              <FeatureItem premium><FaCheckCircle /> Recomendações personalizadas</FeatureItem>
            </FeatureList>
            <PriceTag>R$ 15,99/mês</PriceTag>
          </PlanWrapper>
        </PremiumPlan>
      </Container>
    </>
  );
};

export default Upgrade;
