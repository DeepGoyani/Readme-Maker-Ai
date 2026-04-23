import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getUserRepos, getRepoDetails } from '../services/github.js';

const router = express.Router();

// Get user's GitHub repositories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await req.db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (!user || !user.access_token) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    const repos = await getUserRepos(user.access_token);
    res.json(repos);
  } catch (error) {
    console.error('Error fetching repos:', error.message);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Get specific repository details
router.get('/:owner/:repo', authenticateToken, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const user = await req.db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (!user || !user.access_token) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    const repoDetails = await getRepoDetails(user.access_token, owner, repo);
    res.json(repoDetails);
  } catch (error) {
    console.error('Error fetching repo details:', error.message);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
});

// Search/filter repositories
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    const user = await req.db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    
    if (!user || !user.access_token) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    const repos = await getUserRepos(user.access_token);
    
    if (!q) {
      return res.json(repos);
    }

    const filtered = repos.filter(repo => 
      repo.name.toLowerCase().includes(q.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(q.toLowerCase()))
    );

    res.json(filtered);
  } catch (error) {
    console.error('Error searching repos:', error.message);
    res.status(500).json({ error: 'Failed to search repositories' });
  }
});

export default router;
