import express from 'express';
import jwt from 'jsonwebtoken';
import { exchangeGitHubCode, getGitHubUser, getUserProfile, generateProfileReadme } from '../services/github.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { User } from '../database.js';

const router = express.Router();

router.post('/github/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Exchange code for access token
    const accessToken = await exchangeGitHubCode(
      code,
      process.env.GITHUB_CLIENT_ID,
      process.env.GITHUB_CLIENT_SECRET
    );

    // Get GitHub user data
    const githubUser = await getGitHubUser(accessToken);

    // Check if user exists in database
    let user = await User.findOne({ githubId: githubUser.id.toString() });

    if (user) {
      // Update access token and info
      user.accessToken = accessToken;
      user.username = githubUser.login;
      user.email = githubUser.email;
      user.avatarUrl = githubUser.avatar_url;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        githubId: githubUser.id.toString(),
        username: githubUser.login,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        accessToken
      });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Auth callback error:', error.message);
    res.status(500).json({ error: 'Authentication failed', message: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatarUrl
    });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Generate profile README
router.get('/profile-readme', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    // Fetch comprehensive user profile
    const userProfile = await getUserProfile(user.accessToken);
    
    // Generate professional README
    const readmeContent = generateProfileReadme(userProfile);

    res.json({
      profile: userProfile,
      readme: readmeContent
    });
  } catch (error) {
    console.error('Profile README generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate profile README', message: error.message });
  }
});

export default router;
