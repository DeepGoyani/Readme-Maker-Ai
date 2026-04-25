import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

// Get comprehensive user profile
export async function getUserProfile(accessToken) {
  try {
    const [userData, reposData, orgsData] = await Promise.all([
      axios.get(`${GITHUB_API_BASE}/user`, {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }),
      axios.get(`${GITHUB_API_BASE}/user/repos`, {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        },
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: 100,
          affiliation: 'owner,collaborator'
        }
      }),
      axios.get(`${GITHUB_API_BASE}/user/orgs`, {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      })
    ]);

    const user = userData.data;
    const repos = reposData.data;
    const orgs = orgsData.data;

    // Calculate statistics
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages = {};
    
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Get top repositories by stars
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        htmlUrl: repo.html_url,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at
      }));

    return {
      login: user.login,
      name: user.name,
      bio: user.bio || '',
      email: user.email,
      location: user.location,
      company: user.company,
      blog: user.blog,
      twitterUsername: user.twitter_username,
      avatarUrl: user.avatar_url,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      totalForks,
      languages: Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([lang, count]) => ({ language: lang, count })),
      topRepos,
      organizations: orgs.map(org => ({
        login: org.login,
        avatarUrl: org.avatar_url
      })),
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw new Error('Failed to fetch user profile');
  }
}

export async function getUserRepos(accessToken, page = 1, perPage = 100) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user/repos`, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      },
      params: {
        sort: 'updated',
        direction: 'desc',
        per_page: perPage,
        page: page,
        affiliation: 'owner,collaborator'
      }
    });

    return response.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      private: repo.private,
      htmlUrl: repo.html_url,
      cloneUrl: repo.clone_url,
      defaultBranch: repo.default_branch,
      topics: repo.topics || [],
      createdAt: repo.created_at,
      updatedAt: repo.updated_at
    }));
  } catch (error) {
    console.error('Error fetching user repos:', error.response?.data || error.message);
    throw new Error('Failed to fetch repositories');
  }
}

export async function getRepoDetails(accessToken, owner, repo) {
  try {
    const [repoData, contentsData, languagesData] = await Promise.all([
      axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
        headers: { Authorization: `token ${accessToken}` }
      }),
      axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ data: [] })),
      axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ data: {} }))
    ]);

    const rootFiles = contentsData.data.map(file => file.name);
    
    return {
      ...repoData.data,
      rootFiles,
      languages: languagesData.data,
      hasReadme: rootFiles.includes('README.md'),
      hasPackageJson: rootFiles.includes('package.json'),
      hasRequirements: rootFiles.includes('requirements.txt'),
      hasDockerfile: rootFiles.includes('Dockerfile'),
      hasLicense: rootFiles.some(f => f.toLowerCase().includes('license'))
    };
  } catch (error) {
    console.error('Error fetching repo details:', error.response?.data || error.message);
    throw new Error('Failed to fetch repository details');
  }
}

export async function getFileContent(accessToken, owner, repo, path) {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: { 
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error.response?.data || error.message);
    return null;
  }
}

export async function exchangeGitHubCode(code, clientId, clientSecret) {
  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code: code
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error exchanging GitHub code:', error.response?.data || error.message);
    throw new Error('Failed to exchange authorization code');
  }
}

// Generate professional README based on user profile and repositories
export function generateProfileReadme(userProfile) {
  const {
    login,
    name,
    bio,
    email,
    location,
    company,
    blog,
    twitterUsername,
    avatarUrl,
    followers,
    following,
    publicRepos,
    totalStars,
    totalForks,
    languages,
    topRepos,
    organizations,
    createdAt
  } = userProfile;

  const accountAge = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 365));
  
  const languagesSection = languages.length > 0 
    ? `
### 🛠️ Languages & Tools

${languages.map(({ language, count }) => `${language} ${'⭐'.repeat(Math.min(count, 5))}`).join(' • ')}
`
    : '';

  const topReposSection = topRepos.length > 0
    ? `
### 🚀 Featured Projects

${topRepos.slice(0, 6).map(repo => 
  `[${repo.name}](${repo.htmlUrl})${repo.description ? ` - ${repo.description}` : ''} ${'⭐'.repeat(Math.min(repo.stars, 5))}`).join('\n')}
`
    : '';

  const statsSection = `
### 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${login}&show_icons=true&hide_border=true&theme=radical)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${login}&layout=compact&hide_border=true&theme=radical)

**🔥 Total Stars:** ${totalStars} | **🍴 Total Forks:** ${totalForks} | **👥 Followers:** ${followers} | **🤝 Following:** ${following}
`;

  const orgsSection = organizations.length > 0
    ? `
### 🏢 Organizations

${organizations.map(org => `[@${org.login}](https://github.com/${org.login})`).join(' • ')}
`
    : '';

  const socialSection = `
### 🌐 Connect With Me

${blog ? `🌐 [Website/Blog](${blog})\n` : ''}
${twitterUsername ? `🐦 [Twitter](https://twitter.com/${twitterUsername})\n` : ''}
${email ? `📧 [Email](mailto:${email})\n` : ''}
${location ? `📍 ${location}\n` : ''}
${company ? `💼 ${company}\n` : ''}
`;

  return `# ${name ? name : login}'s GitHub Profile

${avatarUrl ? `![Profile Image](${avatarUrl})\n` : ''}

${bio ? `> ${bio}\n` : ''}

---

### 👋 About Me

Hi! I'm ${name || login}, a passionate developer with ${publicRepos} public repositories and ${totalStars} total stars. I've been contributing to open source for ${accountAge} years.

${languagesSection}

${topReposSection}

${statsSection}

${orgsSection}

${socialSection}

---

### 📈 Activity

[![GitHub Activity Graph](https://activity-graph.herokuapp.com/graph?username=${login}&theme=radical)](https://github.com/${login})

---

**⚡ Fun Fact:** I'm most active in ${languages[0]?.language || 'coding'} and love building amazing projects!

*Last updated: ${new Date().toLocaleDateString()}*
`;
}

export async function getGitHubUser(accessToken) {
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub user:', error.response?.data || error.message);
    throw new Error('Failed to fetch GitHub user');
  }
}

// Push README to GitHub repository
export async function pushReadmeToGitHub(accessToken, owner, repo, readmeContent, commitMessage = 'Update README with AI-generated content') {
  try {
    // First, get the current README file SHA (if it exists)
    const getFileResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    }).catch(error => {
      if (error.response?.status === 404) {
        // File doesn't exist, that's okay
        return null;
      }
      throw error;
    });

    const fileSHA = getFileResponse?.data?.sha;

    // Encode the README content to base64
    const encodedContent = Buffer.from(readmeContent).toString('base64');

    // Create or update the README file
    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
      {
        message: commitMessage,
        content: encodedContent,
        sha: fileSHA
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      commit: response.data.commit,
      url: response.data.content.html_url
    };
  } catch (error) {
    console.error('Error pushing README to GitHub:', error.response?.data || error.message);
    throw new Error('Failed to push README to GitHub: ' + (error.response?.data?.message || error.message));
  }
}
