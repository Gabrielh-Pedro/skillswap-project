const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Swap = require('./models/Swap');
const bcrypt = require('bcrypt');
const Post = require('./models/Post');
const User = require('./models/User');
const Match = require('./models/Match');

const app = express();
const PORT = process.env.PORT || 5000;
const secretKey = 'secrettoken';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Conexão ao MongoDB
mongoose.connect('mongodb://localhost:27017/originalskillswap')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.post('/api/register', upload.single('photo'), async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      whatsapp,
      linkedin,
      discord,
      password,
      bio,
      mainSkill,
      skills,
      termsAccepted
    } = req.body;

    // Validação de campos obrigatórios
    if (!fullName || !username || !email || !password || !termsAccepted) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }

    // Verificar se pelo menos um dos campos de contato foi preenchido
    if (!whatsapp && !linkedin && !discord) {
      return res.status(400).send('Pelo menos um dos campos WhatsApp, LinkedIn ou Discord deve ser preenchido.');
    }

    // Verificar se já existe um usuário com o mesmo nome completo, nome de usuário ou e-mail
    const existingUser = await User.findOne({
      $or: [
        { fullName },
        { username },
        { email }
      ]
    });

    if (existingUser) {
      return res.status(400).send('Nome completo, nome de usuário ou e-mail já em uso.');
    }

    // Validação da força da senha
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send('A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula e um número.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Corrigindo o caminho da foto e adicionando a barra inicial
    const photoPath = req.file ? '/' + req.file.path.replace(/\\/g, '/') : null;

    const user = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      bio,
      mainSkill,
      skills: skills ? skills.split(',') : [], // Certifique-se de que skills seja uma string, se fornecido
      photo: photoPath,
      termsAccepted,
      whatsapp,
      linkedin,
      discord
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });

    res.status(201).json({ message: 'Usuário registrado com sucesso!', token });
  } catch (error) {
    console.error(error); // Log do erro no backend
    res.status(400).send('Erro ao registrar usuário: ' + error.message);
  }
});


// Rota para verificar disponibilidade de nome de usuário, e-mail e nome completo
app.post('/api/check-availability', async (req, res) => {
  const { username, email, fullName } = req.body;

  try {
    // Verifica se o nome de usuário já existe
    const userWithUsername = await User.findOne({ username });
    // Verifica se o e-mail já existe
    const userWithEmail = await User.findOne({ email });
    // Verifica se o nome completo já existe
    const userWithFullName = await User.findOne({ fullName });

    res.json({
      usernameAvailable: !userWithUsername,
      emailAvailable: !userWithEmail,
      fullNameAvailable: !userWithFullName,
    });
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    res.status(500).json({ message: 'Erro ao verificar disponibilidade.' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Endpoint para confirmar um swap
app.post('/api/swaps/:id/confirm',  authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const swap = await Swap.findById(id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap não encontrado' });
    }

    // Atualiza o status do swap para CONFIRMADO
    swap.status = 'CONFIRMADO';
    await swap.save();

    res.status(200).json({ message: 'Swap confirmado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao confirmar o swap' });
  }
});


// Rota para obter dados do usuário
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Não autorizado' });
  }
});

app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
  }

  try {
    const isEmail = /\S+@\S+\.\S+/.test(identifier);

    const user = await User.findOne(isEmail ? { email: identifier } : { username: identifier });

    if (!user) {
      return res.status(400).json({ error: 'Verifique novamente os campos, os dados não conferem.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Verifique novamente os campos, os dados não conferem.' });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
    res.status(200).json({ message: 'Login realizado com sucesso!', token });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});
app.post('/updateProfile',  upload.single('photo'), async (req, res) => {
  const { bio, email, mainSkill, skills } = req.body;  // A bio, email e skills estarão no req.body
  const file = req.file;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secrettoken');
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualize os campos do usuário
    if (file) {
      user.photo = `/uploads/${file.filename}`;  // A foto será salva se estiver presente
    }
    if (bio) {
      user.bio = bio;
    }
    if (email) {
      user.email = email;
    }
    if (mainSkill) {
      user.mainSkill = mainSkill; // Atualize a mainSkill
    }
    if (skills) {
      user.skills = skills.split(',');  // Como `req.body.skills` é uma string, converta para array
    }

    await user.save();

    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

app.put('/api/privacyReturn', async (req, res) => {
  const { userId, newUsername, newWhatsapp, newLinkedin, newDiscord } = req.body;

  try {
    const user = await User.findById(userId);

    if (newUsername && user.usernameUpdated) {
      return res.status(400).json({ message: "Você só pode alterar o nome de usuário uma vez." });
    }

    if (newWhatsapp && user.whatsappUpdated) {
      return res.status(400).json({ message: "Você só pode alterar o WhatsApp uma vez." });
    }

    if (newLinkedin && user.linkedinUpdated) {
      return res.status(400).json({ message: "Você só pode alterar o LinkedIn uma vez." });
    }

    if (newDiscord && user.discordUpdated) {
      return res.status(400).json({ message: "Você só pode alterar o Discord uma vez." });
    }

    // Atualiza os campos
    if (newUsername && !user.usernameUpdated) {
      user.username = newUsername;
      user.usernameUpdated = true;
    }

    if (newWhatsapp && !user.whatsappUpdated) {
      user.whatsapp = newWhatsapp;
      user.whatsappUpdated = true;
    }

    if (newLinkedin && !user.linkedinUpdated) {
      user.linkedin = newLinkedin;
      user.linkedinUpdated = true;
    }

    if (newDiscord && !user.discordUpdated) {
      user.discord = newDiscord;
      user.discordUpdated = true;
    }

    await user.save();
    return res.status(200).json({ message: "Perfil atualizado com sucesso!" });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar perfil." });
  }
});


app.post('/updatePrivacy', upload.single('photo'),  authenticateToken, async (req, res) => {
  const { username, email, whatsapp, discord, linkedin, oldPassword, newPassword } = req.body;
  const file = req.file;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secrettoken'); // Verifique a chave secreta usada para assinar o JWT
    const userId = decoded.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica a senha anterior se a nova senha for fornecida
    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'A senha anterior está incorreta' });
      }
      // Atualiza a senha
      user.password = await bcrypt.hash(newPassword, 10); // Hash da nova senha
    }

    // Atualize os campos do usuário
    if (file) {
      user.photo = `/uploads/${file.filename}`; // Atualiza a foto se fornecida
    }
    if (username) {
      user.username = username; // Atualiza o nome de usuário
    }
    if (email) {
      user.email = email; // Atualiza o email
    }
    if (whatsapp) {
      user.whatsapp = whatsapp; // Atualiza o WhatsApp
    }
    if (discord) {
      user.discord = discord; // Atualiza o Discord
    }
    if (linkedin) {
      user.linkedin = linkedin; // Atualiza o LinkedIn
    }

    await user.save();

    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});


// Rota para remover habilidade
app.post('/removeSkill',  authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secrettoken');
    const userId = decoded.userId;
    const { skill } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.skills = user.skills.filter((s) => s !== skill);
    await user.save();

    res.status(200).json({ message: 'Habilidade removida com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover habilidade:', error);
    res.status(500).json({ error: 'Erro ao remover habilidade' });
  }
});

// Rota para adicionar habilidade
app.post('/addSkill', authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secrettoken');
    const userId = decoded.userId;
    const { skill } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (user.skills.includes(skill)) {
      return res.status(400).json({ error: 'Habilidade já adicionada' });
    }

    if (user.skills.length >= 5) {
      return res.status(400).json({ error: 'Você pode adicionar no máximo 5 habilidades.' });
    }

    user.skills.push(skill);
    await user.save();

    res.status(200).json({ message: 'Habilidade adicionada com sucesso!' });
  } catch (error) {
    console.error('Erro ao adicionar habilidade:', error);
    res.status(500).json({ error: 'Erro ao adicionar habilidade' });
  }
});

// Função para calcular o tempo restante em horas
const calculateTimeRemaining = (lastPostDate) => {
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
  const currentTime = new Date().getTime();
  const timeDifference = ONE_DAY_IN_MS - (currentTime - new Date(lastPostDate).getTime());
  const hoursRemaining = Math.ceil(timeDifference / (60 * 60 * 1000)); // converte de milissegundos para horas
  return hoursRemaining;
};

const checkTimeLimit = (lastPostDate) => {
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
  const currentTime = new Date().getTime();
  return (currentTime - new Date(lastPostDate).getTime()) >= ONE_DAY_IN_MS;
};

app.post('/createPost', upload.single('image'), authenticateToken, async (req, res) => {
const { description } = req.body;
const token = req.headers.authorization.split(' ')[1];

try {
  const decoded = jwt.verify(token, 'secrettoken');
  const userId = decoded.userId;

  // Verifica a última postagem do usuário
  const lastPost = await Post.findOne({ user: userId }).sort({ createdAt: -1 });

  // Se há uma última postagem e ainda não se passaram 24 horas, calcula o tempo restante
  if (lastPost && !checkTimeLimit(lastPost.createdAt)) {
    const hoursRemaining = calculateTimeRemaining(lastPost.createdAt);
    return res.status(400).json({
      message: `Você só pode fazer uma postagem por dia, você poderá postar de novo em: ${hoursRemaining} horas.`,
    });
  }

  // Criação do post (mantido da função original)
  const post = new Post({
    user: userId,
    description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null
  });

  // Salva o post no banco de dados
  await post.save();

  // Resposta de sucesso
  res.status(201).json({ message: 'Post criado com sucesso!' });

} catch (error) {
  console.error('Erro ao criar post:', error);
  res.status(500).json({ error: 'Erro ao criar post' });
}
});


app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username photo skills mainSkill').exec();
    res.status(200).json(posts); // Envia a data no formato ISO padrão
  } catch (error) {
    console.error('Erro ao listar posts:', error);
    res.status(500).json({ error: 'Erro ao listar posts' });
  }
});

app.get('/api/swaps', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Encontrar os posts onde o usuário deu match
    const matchedPosts = await Post.find({ matches: userId }).populate('user', 'username photo mainSkill');

    res.status(200).json(matchedPosts);
  } catch (error) {
    console.error('Erro ao buscar matches:', error);
    res.status(500).json({ error: 'Erro ao buscar matches' });
  }
});

// ROTA PARA CONFIRMAR O MATCH

app.post('/match/confirm/:matchId',  authenticateToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secrettoken');
  const userId = decoded.userId;
  const { matchId } = req.params;

  try {
    // Procura o match pelo _id
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: 'Match não encontrado' });
    }

    // Verifica se o usuário está autorizado a confirmar o match
    if (match.userId.toString() === userId || match.matchedUserId.toString() === userId) {
      match.accepted = true; // Atualiza o status do match
      await match.save();
      return res.status(200).json({ message: 'Match confirmado com sucesso!' });
    } else {
      return res.status(403).json({ message: 'Você não tem permissão para confirmar este match.' });
    }
  } catch (error) {
    console.error('Erro ao confirmar o match:', error);
    res.status(500).json({ error: 'Erro ao confirmar o match' });
  }
});


// ROTA PARA DAR MATCH

app.post('/match/:postId',  authenticateToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secrettoken');
  const userId = decoded.userId;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    if (!post.matches.includes(userId)) {
      post.matches.push(userId);
      await post.save();

      const postOwner = await User.findById(post.user);
      if (postOwner) {
        console.log(`Usuário ${postOwner.username} recebeu um match no post de ${userId}`);

        // Criar um novo documento de match
        const newMatch = new Match({
          userId: userId,
          matchedUserId: postOwner._id,
          accepted: false
        });

        await newMatch.save();
      }

      res.status(200).json({ message: 'Match feito com sucesso!' });
    } else {
      res.status(400).json({ message: 'Você já deu match neste post.' });
    }
  } catch (error) {
    console.error('Erro ao dar match:', error);
    res.status(500).json({ error: 'Erro ao dar match' });
  }
});

app.get('/api/swaps/received-matches',  authenticateToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secrettoken');
  const userId = decoded.userId;

  try {
    // Buscar todos os matches onde o usuário atual é o matchedUserId
    const matches = await Match.find({
      matchedUserId: userId,  // Alterado para filtrar apenas matches recebidos
      accepted: false // Condição para incluir apenas matches não confirmados
    })
      .populate('userId', 'username photo mainSkill skills') // Popular detalhes do usuário que deu match
      .populate('matchedUserId', 'username photo'); // Popular detalhes do usuário que foi matchado

    res.status(200).json(matches);
  } catch (error) {
    console.error('Erro ao buscar os matches recebidos:', error);
    res.status(500).json({ error: 'Erro ao buscar os matches recebidos' });
  }
});

app.get('/api/matches/confirmed',  authenticateToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secrettoken');
  const userId = decoded.userId;

  try {
    const matches = await Match.find({ matchedUserId: userId, accepted: true })
      .populate('userId', 'username fullName bio photo mainSkill skills whatsapp discord linkedin');
    res.status(200).json(matches);
  } catch (error) {
    console.error('Erro ao buscar matches confirmados:', error);
    res.status(500).json({ error: 'Erro ao buscar matches confirmados' });
  }
});



app.get('/check-matched/:postId',  authenticateToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secrettoken');
  const userId = decoded.userId;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado.' });
    }

    // Verifica se o usuário já deu match no post
    const isMatched = post.matches.includes(userId);
    res.status(200).json({ matched: isMatched });
  } catch (error) {
    console.error('Erro ao verificar match:', error);
    res.status(500).json({ error: 'Erro ao verificar match' });
  }
});


// Rota para excluir post
app.delete('/posts/:postId',  authenticateToken, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secrettoken');
  const userId = decoded.userId;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Verifica se o usuário é o autor do post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir este post' });
    }

    await Post.findByIdAndDelete(postId); // Usa findByIdAndDelete() para excluir o post

    res.status(200).json({ message: 'Post excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir post:', error);
    res.status(500).json({ error: 'Erro ao excluir post' });
  }
});

app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter perfil do usuário' });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 5000');
});

