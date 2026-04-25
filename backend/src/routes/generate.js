import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generateReadme, enhanceReadme } from '../services/ai.js';
import { getRepoDetails, pushReadmeToGitHub } from '../services/github.js';
import { User, Readme, GenerationLog } from '../database.js';

const router = express.Router();

// Generate README for a repository
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { owner, repo, template = 'modern', customInstructions } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Repository owner and name required' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    // Log generation attempt
    await GenerationLog.create({
      userId: req.user.id,
      repoName: `${owner}/${repo}`,
      status: 'started'
    });

    // Fetch repository details
    const repoDetails = await getRepoDetails(user.accessToken, owner, repo);
    
    // Add owner to repo details
    repoDetails.owner = owner;

    // Generate README
    let readmeContent;
    if (customInstructions) {
      const baseReadme = await generateReadme(repoDetails, template);
      readmeContent = await enhanceReadme(baseReadme, customInstructions);
    } else {
      readmeContent = await generateReadme(repoDetails, template);
    }

    // Log successful generation
    await GenerationLog.create({
      userId: req.user.id,
      repoName: `${owner}/${repo}`,
      status: 'completed'
    });

    // Save to database
    const newReadme = await Readme.create({
      userId: req.user.id,
      repoName: repo,
      repoOwner: owner,
      content: readmeContent,
      templateStyle: template
    });

    res.json({
      id: newReadme._id,
      content: readmeContent,
      repo: {
        name: repo,
        owner: owner,
        details: {
          language: repoDetails.language,
          stars: repoDetails.stargazers_count,
          forks: repoDetails.forks_count
        }
      }
    });
  } catch (error) {
    console.error('Generation error:', error.message);
    
    // Log error
    await GenerationLog.create({
      userId: req.user.id,
      repoName: `${req.body.owner}/${req.body.repo}`,
      status: 'failed',
      errorMessage: error.message
    });

    res.status(500).json({ error: 'Failed to generate README', message: error.message });
  }
});

// Enhance existing README
router.post('/enhance', authenticateToken, async (req, res) => {
  try {
    const { content, instructions } = req.body;

    if (!content || !instructions) {
      return res.status(400).json({ error: 'Content and instructions required' });
    }

    const enhancedContent = await enhanceReadme(content, instructions);

    res.json({ content: enhancedContent });
  } catch (error) {
    console.error('Enhancement error:', error.message);
    res.status(500).json({ error: 'Failed to enhance README' });
  }
});

// Push README to GitHub repository
router.post('/push-to-github', authenticateToken, async (req, res) => {
  try {
    const { owner, repo, content, commitMessage } = req.body;

    if (!owner || !repo || !content) {
      return res.status(400).json({ error: 'Repository owner, name, and content required' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    const result = await pushReadmeToGitHub(
      user.accessToken,
      owner,
      repo,
      content,
      commitMessage || 'Update README with AI-generated content'
    );

    res.json({
      success: true,
      message: 'README successfully pushed to GitHub',
      commit: result.commit,
      url: result.url
    });
  } catch (error) {
    console.error('Push to GitHub error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
