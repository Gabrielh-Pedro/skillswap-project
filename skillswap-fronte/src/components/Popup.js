import React, { useState } from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3); /* Escurece o fundo */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PopupContainer = styled.div`
  background: rgba(255, 255, 255, 0.7); /* Glassmorphism */
  backdrop-filter: blur(10px); /* Efeito de embaçamento */
  border-radius: 15px;
  padding: 20px;
  max-width: 300px;
  width: 100%;
  text-align: center;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
`;

const PopupMessage = styled.p`
  font-size: 16px;
  color: black;
`;

const PopupButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 55px;
  padding: 10px 15px;
  margin: 10px;
  width: 100px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:nth-child(2) {
    background-color: transparent;
    border: 3px #007bff solid;
    color: #007bff;
    font-weight: 700;
    width: 100px;
    transition: all 0.3s;

    &:hover {
      background-color: transparent;
      border: 3px red solid;
      color: red;
    }
  }
`;

const Popup = ({ onConfirm, onCancel }) => {
  return (
    <PopupOverlay>
      <PopupContainer>
        <PopupMessage>Tem certeza que deseja deletar este post permanentemente?<br></br><br></br>Essa ação não poderá ser revertida.</PopupMessage>
        <PopupButton onClick={onConfirm}>Sim</PopupButton>
        <PopupButton onClick={onCancel}>Cancelar</PopupButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default Popup;