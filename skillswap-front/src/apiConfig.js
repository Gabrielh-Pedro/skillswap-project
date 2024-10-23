const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const API_ENDPOINTS = {
  createPost: `${API_BASE_URL}/createPost`,
  checkAvailability: `${API_BASE_URL}/api/check-availability`,
  register: `${API_BASE_URL}/api/register`,
  login: `${API_BASE_URL}/api/login`,
  createPost: `${API_BASE_URL}/api/swaps/:id/confirm`,
  me: `${API_BASE_URL}/api/me`,
  updateProfile: `${API_BASE_URL}/updateProfile`,
  privacy: `${API_BASE_URL}/updatePrivacy`,
  removeSkill: `${API_BASE_URL}/removeSkill`,
  addSkill: `${API_BASE_URL}/addSkill`,
  createPost: `${API_BASE_URL}/posts`,
  createPost: `${API_BASE_URL}/api/swaps`,
  confirmMatch: `${API_BASE_URL}/match/confirm/:matchId`,
  match: `${API_BASE_URL}/match/:postId`,
  receivedMatches: `${API_BASE_URL}/api/swaps/received-matches`,
  confirmedMatches: `${API_BASE_URL}/api/matches/confirmed`,
  checkMatch: `${API_BASE_URL}/check-matched/:postId`,
  posts: `${API_BASE_URL}/posts/:postId`,
  getPosts: `${API_BASE_URL}/check-matched/:postId`,
  user: `${API_BASE_URL}/users/:userId`,
};

export default API_ENDPOINTS;
