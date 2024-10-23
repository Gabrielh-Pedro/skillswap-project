import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderApp from '../components/HeaderApp';
import PostList from '../components/PostList';
import AppProfile from '../components/AppProfile';
import styled from 'styled-components';

const PostListSection = styled.div`
  margin-top: 70px;
`;

function MainApp() {
  return (
    <>
      <HeaderApp />
      <AppProfile></AppProfile>
      <PostListSection>
        <PostList />
      </PostListSection>
    </>
  );
}

export default MainApp;
