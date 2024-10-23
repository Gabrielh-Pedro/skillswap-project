import React, { useState, useEffect } from 'react';
import Post from './Post';
import CreatePost from './CreatePost';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa'; // Ícone de filtro

// Container geral
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  align-items: center;
  margin: 0 auto;
  padding: 20px;
`;

export const FilterPanel = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

// Container do Select com ícone
export const FilterWrapper = styled.div`
  position: relative;
  width: auto;
  left: 0;
  display: inline-block;
  margin-bottom: 20px;
`;

// Ícone de filtro dentro do select
export const FilterIcon = styled(FaBars)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none; // Para não interferir no clique do select
`;

// Estilização do select
export const FilterSelect = styled.select`
  appearance: none; // Remove a seta padrão do select
  padding: 10px 30px 10px 40px; // Espaçamento para o ícone
  border-radius: 10px;
  width: 100%;
  border: none;
  font-weight: 600;
  background-color: #eee;
  font-size: 12px;
  color: #aaa;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    border-color: #007bff;
  }

  // Remove a seta padrão no WebKit-based browsers (Chrome, Safari, etc.)
  &::-webkit-appearance {
    none;
  }

  // Remove a seta padrão no Firefox
  &::-moz-appearance {
    none;
  }

  &::ms-expand {
    display: none; // Remove seta no IE
  }
`;

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('newest'); // Estado para armazenar a ordem de exibição
  const [selectedMainSkill, setSelectedMainSkill] = useState("none"); // Estado para a mainSkill selecionada
  const [myPostsOrder, setMyPostsOrder] = useState('newest'); // Novo estado para a ordenação em "Meus Posts"

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://127.0.0.1:5000/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar posts');

        const data = await response.json();
        setPosts(data);

        const userResponse = await fetch('http://127.0.0.1:5000/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) throw new Error('Erro ao buscar informações do usuário');

        const userData = await userResponse.json();
        setUserId(userData?.user?._id);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleMainSkillChange = (event) => {
    setSelectedMainSkill(event.target.value); // Atualiza a mainSkill selecionada
  };

  const handleMatch = async (postId) => {
    const token = localStorage.getItem('token');
    await fetch(`http://127.0.0.1:5000/match/${postId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    refreshPosts();
  };

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    await fetch(`http://127.0.0.1:5000/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    refreshPosts();
  };

  const refreshPosts = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:5000/posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setPosts(data);
  };

  const handleOrderChange = (event) => {
    const newOrder = event.target.value;
    setOrder(newOrder);
    localStorage.setItem('postOrder', newOrder); // Salva a escolha no localStorage
  };

  const handleMyPostsOrderChange = (event) => {
    setMyPostsOrder(event.target.value); // Atualiza a ordenação para "Meus Posts"
  };

  // Função para filtrar os posts de acordo com a mainSkill e a opção de "Meus Posts"
  const filteredPosts = posts.filter(post => {
    if (!post || !post.user) return false; // Verifica se o post e o post.user existem antes de acessar _id

    if (order === "myPosts") {
      return post.user._id === userId; // Mostra apenas posts do usuário atual
    }

    if (post.user._id === userId) {
      return false; // Exclui os posts do usuário atual em outros filtros
    }

    if (selectedMainSkill === "none") return true; // Se "nenhum" estiver selecionado, mostre todos os posts
    return post.user.mainSkill === selectedMainSkill; // Filtra posts pela mainSkill do criador
  });

  // Ordena os posts para o filtro "Meus Posts"
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    // Usa a ordenação correta baseada no filtro selecionado
    if (order === 'myPosts') {
      return myPostsOrder === 'newest' ? dateB - dateA : dateA - dateB;
    }

    return order === 'newest' ? dateB - dateA : order === 'oldest' ? dateA - dateB : 0;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <FilterPanel>
        <FilterWrapper>
          <FilterIcon />
          <FilterSelect value={order} onChange={handleOrderChange}>
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="myPosts">Meus Posts</option>
          </FilterSelect>
        </FilterWrapper>

        {/* Se "Meus Posts" estiver selecionado, mostre o filtro de "Mais recentes"/"Mais antigos" */}
        {order === "myPosts" ? (
          <FilterWrapper>
            <FilterIcon />
            <FilterSelect value={myPostsOrder} onChange={handleMyPostsOrderChange}>
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </FilterSelect>
          </FilterWrapper>
        ) : (
          // Se "Meus Posts" NÃO estiver selecionado, mostre o filtro de mainSkill
          <FilterWrapper>
            <FilterIcon />
            <FilterSelect value={selectedMainSkill} onChange={handleMainSkillChange}>
              <option value="none">Todos</option>
              <option value="AI/ML Engineer">AI/ML Engineer</option>
              <option value="Back-end">Back-end</option>
              <option value="Cloud Engineer">Cloud Engineer</option>
              <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Designer">Designer</option>
              <option value="DevOps">DevOps</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Game Developer">Game Developer</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="QA Tester">QA Tester</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
            </FilterSelect>
          </FilterWrapper>
        )}
      </FilterPanel>

      <CreatePost refreshPosts={refreshPosts} />

      {sortedPosts.map(post => (
        post && post._id ? ( // Verifica se o post é válido antes de renderizar
          <Post
            key={post._id}
            post={post}
            onMatch={handleMatch}
            onDelete={handleDelete}
            currentUserId={userId}
          />
        ) : (
          <div key={Math.random()}>Post inválido</div> // Para lidar com posts inválidos
        )
      ))}
    </Container>
  );
};

export default PostList;
