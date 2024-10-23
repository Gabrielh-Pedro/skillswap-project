import React, { useState, useEffect, useRef } from 'react';
import './styles/HeaderApp.css';
import { FaUser, FaRegComments, FaRegCheckCircle, FaRegBell, FaCog, FaFileContract, FaSyncAlt, FaSignOutAlt, FaArrowUp, FaRegListAlt, FaRegStar, FaEllipsisV } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';

const Header = styled.header`
`;

const MenuButton = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 100px;
    font-weight: 500;
    color: ${({ selected }) => (selected ? '#007bff' : '#333')};
    cursor: pointer;
    text-decoration: none;
    border-radius: 10px;
    font-size: 14px;
    transition: transform 0.3s ease, background-color 0.3s ease;
    position: relative;

    &:hover {
        color: #007bff;
        background-color: #eee;
        border-radius: 10px;
    }

    svg {
        margin-right: 0px;
    }

    ${({ selected }) =>
        selected &&
        `&::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: -5px;
            right: -5px;
            height: 3px;
            background-color: #007bff;
        }`}

@media screen and (max-width: 700px) {
    width: 80px;
} 

@media screen and (max-width: 500px) {
    width: 60px;
} 
@media screen and (max-width: 380px) {
    width: 50px;
} 

@media screen and (max-width: 300px) {
    width: 60px;
} 
`;

const ProfileContainerMobile = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    @media screen and (max-width: 930px) {
        display: flex;
        position: absolute;
        left: 30px;
    }

    @media screen and (max-width: 700px) {
    left: 5px;
    @media screen and (max-width: 300px) {
    display: none;
} 
} 
`;

const ProfileContainer = styled.div`
    position: absolute;
    right: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 0px;

    @media screen and (max-width: 930px) {
        display: none;
    }
`;

const ProfilePic = styled.img`
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
`;

const MainMenu = styled.button`
  background: none;
  display: flex;
  border: none;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #333;
  position: relative;
  &:hover{
    background-color: transparent;
  }
  @media screen and (max-width: 930px) {
       margin-right: -10px;
    }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background: white;
  width: 220px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease; /* Transições */
  z-index: 10;

  /* Animação de abertura aplicada apenas se não estiver fechando */
  ${({ isClosing }) => !isClosing && css`animation: ${slideDown} 0.3s ease forwards;`}

  &.closing {
    opacity: 0; /* Oculta o menu */
    transform: translateY(-10px); /* Animação de fechamento */
  }

  @media screen and (max-width: 930px) {
       left: 0;
       width: 220px;
    }
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    margin-right: 10px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  bottom: 8px;
  border: 2px white solid;
  right: 30px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  padding: 5px;
  font-size: 9px;
  width: 5px;
  height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;

  @media (max-width: 700px) {
    right: 0px; /* Ajuste a posição horizontal quando a tela for menor que 700px */
    bottom: 0;
  }
`;


const HeaderApp = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [visible, setVisible] = useState(false); // Estado adicional
    const menuRef = useRef(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const [notificationCount, setNotificationCount] = useState(0);
    const location = useLocation();
    const [showOptionsMenu, setShowOptionsMenu] = useState(false); // Estado para controlar o menu de opções

    const fetchReceivedMatches = async () => {
        try {
            const token = localStorage.getItem('token'); // Obter o token do localStorage ou de outro lugar
            const response = await axios.get('http://127.0.0.1:5000/api/swaps/received-matches', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Atualiza a contagem com o número de matches recebidos
            setNotificationCount(response.data.length);
        } catch (error) {
            console.error('Erro ao buscar matches recebidos:', error);
        }
    };

    useEffect(() => {
        fetchReceivedMatches(); // Chama a função ao montar o componente
    }, []);

    const handleIconClick = () => {
        setIsActive((prev) => !prev);
        if (!isActive) {
            setSearchValue(''); // Limpa o valor ao abrir
        }
    };

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleOptionsButtonClick = () => {
        if (showOptionsMenu) {
            setIsClosing(true); // Ativa a animação de fechamento
            setTimeout(() => {
                setShowOptionsMenu(false); // Esconde após a animação
                setIsClosing(false); // Reseta o estado de animação
            }, 300); // Tempo da animação
        } else {
            setShowOptionsMenu(true);
        }
    };

    const handleItemClick = (path) => {
        setIsClosing(true); // Ativa a animação de fechamento
        setTimeout(() => {
            setShowOptionsMenu(false);
            navigate(path);
            setIsClosing(false); // Reseta o estado de animação
        }, 300); // Tempo da animação
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsClosing(true); // Ativa a animação de fechamento
                setTimeout(() => {
                    setShowOptionsMenu(false);
                    setIsClosing(false); // Reseta o estado de animação
                }, 100); // Tempo da animação
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

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
                    if (!response.ok) {
                        throw new Error('Erro ao buscar dados do usuário');
                    }
                    const data = await response.json();
                    setUser(data.user);
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleCancelLogout = () => {
        setShowLogoutPopup(false);
    };

    return (
        <div>
            {user ? (
                <>
                    <Header className='mainHeader'>
                        <div className='mobileMenu'>
                            <div className='leftAroundMobile'>
                            </div>
                            <div className='centerAroundMobile'>
                                <ProfileContainerMobile>
                                    <div style={{ position: 'relative' }}>
                                        <MainMenu onClick={handleOptionsButtonClick}>
                                            <FaEllipsisV />
                                        </MainMenu>
                                        {showOptionsMenu && (
                                            <DropdownMenu
                                                ref={menuRef}
                                                className={isClosing ? 'closing' : ''} // Aplica a classe de fechamento
                                            >
                                                <MenuItem as="div" onClick={() => handleItemClick('/configuracoes')}>
                                                    <FaCog size={16} /> Configurações
                                                </MenuItem>
                                                <MenuItem as="div" onClick={() => handleItemClick('/profile')}>
                                                    <FaUser size={16} /> Meu perfil
                                                </MenuItem>
                                                <MenuItem as="div" onClick={() => handleItemClick('/termos')}>
                                                    <FaFileContract size={16} /> Termos de contrato
                                                </MenuItem>
                                                <MenuItem as="div" onClick={handleLogoutClick}>
                                                    <FaSignOutAlt size={16} /> Sair
                                                </MenuItem>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                    <ProfilePic
                                        src={user && user.photo ? `http://127.0.0.1:5000${user.photo}` : 'default.jpg'}
                                        alt="Profile"
                                    />
                                </ProfileContainerMobile>
                                <div className='tester'>
                                    <MenuButton to="/mainApp" selected={location.pathname === '/mainApp'}><FaRegListAlt size={22} /></MenuButton>
                                    <MenuButton to="/friends" selected={location.pathname === '/friends'}><FaSyncAlt size={22} /></MenuButton>
                                    <MenuButton to="/swaps" selected={location.pathname === '/swaps'}><FaRegBell size={22} />
                                        {notificationCount > 0 && <NotificationBadge>{notificationCount}</NotificationBadge>}
                                    </MenuButton>
                                    <MenuButton to="/upgrade" selected={location.pathname === '/upgrade'}><FaRegStar size={22} /></MenuButton>
                                </div>
                            </div>
                        </div>
                        <div className='leftAround'>
                            <Link id='linkLogo' to="/mainApp">
                                <img id='mainLogo' src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" />
                            </Link>
                        </div>
                        <div className='centerAround'>
                            <MenuButton to="/mainApp" selected={location.pathname === '/mainApp'}><FaRegListAlt size={22} /></MenuButton>
                            <MenuButton to="/friends" selected={location.pathname === '/friends'}><FaSyncAlt size={22} /> </MenuButton>
                            <MenuButton to="/swaps" selected={location.pathname === '/swaps'}><FaRegBell size={22} />
                                {notificationCount > 0 && <NotificationBadge>{notificationCount}</NotificationBadge>}
                            </MenuButton>
                            <MenuButton to="/upgrade" selected={location.pathname === '/upgrade'}><FaRegStar size={22} /></MenuButton>
                        </div>
                        <ProfileContainer>
                            <ProfilePic
                                src={user && user.photo ? `http://127.0.0.1:5000${user.photo}` : 'default.jpg'}
                                alt="Profile"
                            />
                            <div style={{ position: 'relative' }}>
                                <MainMenu onClick={handleOptionsButtonClick}>
                                    <FaEllipsisV />
                                </MainMenu>
                                {showOptionsMenu && (
                                    <DropdownMenu
                                        ref={menuRef}
                                        className={isClosing ? 'closing' : ''} // Aplica a classe de fechamento
                                    >
                                        <MenuItem as="div" onClick={() => handleItemClick('/configuracoes')}>
                                            <FaCog size={16} /> Configurações
                                        </MenuItem>
                                        <MenuItem as="div" onClick={() => handleItemClick('/profile')}>
                                            <FaUser size={16} /> Meu perfil
                                        </MenuItem>
                                        <MenuItem as="div" onClick={() => handleItemClick('/termos')}>
                                            <FaFileContract size={16} /> Termos de contrato
                                        </MenuItem>
                                        <MenuItem as="div" onClick={handleLogoutClick}>
                                            <FaSignOutAlt size={16} /> Sair
                                        </MenuItem>
                                    </DropdownMenu>
                                )}
                            </div>
                        </ProfileContainer>
                    </Header>
                    {showLogoutPopup && (
                        <div className='terms-popup'>
                            <div className='popup-content'>
                                <p className='sublim'>Você realmente deseja sair?</p>
                                <div className='buttonsOnOff'>
                                    <button style={{ width: "100px" }} onClick={handleConfirmLogout}>Sim</button>
                                    <button style={{ width: "100px" }} id='msgButton2' className='buttonAuth' onClick={handleCancelLogout}>Não</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default HeaderApp;
