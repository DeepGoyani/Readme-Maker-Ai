import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

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
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error_description);
    }

    return response.data.access_token;
  } catch (error) {
    console.error('GitHub OAuth error:', error.response?.data || error.message);
    throw new Error('Failed to exchange GitHub code');
  }
}

export async function getGitHubUser(accessToken) {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/user`, {
      headers: { Authorization: `token ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub user:', error.response?.data || error.message);
    throw new Error('Failed to fetch GitHub user');
  }
}
