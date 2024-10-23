import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #dddddd;
  align-items: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column; /* Mudado para coluna para centralizar as seções */
  align-items: center;
  width: 100%;
  max-width: 800px; /* Largura máxima para o conteúdo */
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: center; /* Centraliza as seções */
  gap: 105px; /* Gap padrão em telas grandes */
  flex-wrap: wrap; /* Permite que as seções se ajustem em telas menores */

  @media (max-width: 768px) { /* Ajustes para telas menores */
    gap: 20px; /* Reduz o gap em telas pequenas */
  }
`;

const LinkSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px; /* Margem para espaçamento em telas pequenas */
`;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 1rem; /* Tamanho do texto reduzido */
  margin-bottom: 5px;
`;

const Link = styled.a`
  color: #333;
  text-decoration: none;
  margin: 3px 0; /* Margem menor */
  font-size: 0.9rem; /* Tamanho do texto reduzido */
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }
`;

const SocialMediaContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px; /* Espaçamento entre seções */
`;

const SocialIcon = styled.a`
  color: #333;
  font-size: 1.5rem; /* Tamanho do ícone */
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }
`;

const FooterText = styled.p`
  margin-top: 15px; /* Espaçamento acima do texto */
  color: #333; /* Cor do texto */
  font-size: 0.8rem; /* Tamanho do texto */
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <LinksContainer>
          <LinkSection>
            <SectionTitle>Sobre</SectionTitle>
            <Link href="#mission">Nossa Missão</Link>
            <Link href="#team">Equipe</Link>
          </LinkSection>
          <LinkSection>
            <SectionTitle>Serviços</SectionTitle>
            <Link href="#services">O que fazemos</Link>
            <Link href="#pricing">Preços</Link>
          </LinkSection>
          <LinkSection>
            <SectionTitle>Contato</SectionTitle>
            <Link href="#contact">Fale Conosco</Link>
            <Link href="#support">Suporte</Link>
          </LinkSection>
        </LinksContainer>
      </FooterContent>
      <SocialMediaContainer>
        <SocialIcon href="https://facebook.com" target="_blank" aria-label="Facebook">
          <FaFacebook />
        </SocialIcon>
        <SocialIcon href="https://instagram.com" target="_blank" aria-label="Instagram">
          <FaInstagram />
        </SocialIcon>
        <SocialIcon href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
          <FaLinkedin />
        </SocialIcon>
      </SocialMediaContainer>
      <FooterText>Projeto desenvolvido pela equipe Os Codificadores | Centro Universitário Facens 2024</FooterText>
    </FooterContainer>
  );
};

export default Footer;
