import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const README_TEMPLATES = {
  modern: `Create a modern, professional README with:
- Hero section with badges
- Clean feature list with emojis
- Tech stack table
- Quick start commands
- Screenshots placeholder
- Contributing section
- License`,

  minimal: `Create a minimal, clean README with:
- Simple project title
- Brief description
- Installation steps
- Usage example
- No unnecessary sections`,

  detailed: `Create a comprehensive README with:
- Project logo/title
- Detailed description
- Table of contents
- Feature highlights
- Architecture overview
- API documentation section
- Environment variables guide
- Deployment instructions
- Testing guide
- Changelog
- Contributing guidelines
- Code of conduct
- License`
};

export async function generateReadme(repoData, template = 'modern') {
  try {
    const templatePrompt = README_TEMPLATES[template] || README_TEMPLATES.modern;
    
    const systemPrompt = `You are an expert technical writer specializing in creating high-quality README files for GitHub repositories. 
Your task is to analyze repository information and generate a professional, engaging README.md content.

Guidelines:
- Use proper Markdown formatting
- Include relevant badges (build, version, license)
- Write clear, concise descriptions
- Add emojis where appropriate for visual appeal
- Include practical code examples
- Highlight key features and benefits
- Add setup/installation instructions
- Consider the tech stack when suggesting commands`;

    const userPrompt = `Generate a README for the following repository:

Repository Name: ${repoData.name}
Description: ${repoData.description || 'No description provided'}
Language: ${repoData.language || 'Mixed'}
Stars: ${repoData.stars || 0}
Forks: ${repoData.forks || 0}
Topics: ${repoData.topics?.join(', ') || 'None'}
Has Package.json: ${repoData.hasPackageJson ? 'Yes' : 'No'}
Has Requirements.txt: ${repoData.hasRequirements ? 'Yes' : 'No'}
Has Dockerfile: ${repoData.hasDockerfile ? 'Yes' : 'No'}
Languages: ${JSON.stringify(repoData.languages)}
Root Files: ${repoData.rootFiles?.slice(0, 10).join(', ') || 'N/A'}

${templatePrompt}

Generate ONLY the README content as raw markdown. Do not wrap in code blocks. Make it professional and engaging.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI generation error:', error.message);
    
    // Fallback template
    return generateFallbackReadme(repoData);
  }
}

export async function enhanceReadme(existingContent, instructions) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a technical editor. Enhance the provided README based on user instructions. Return only the improved README content.'
        },
        {
          role: 'user',
          content: `Current README:\n\n${existingContent}\n\nEnhancement instructions: ${instructions}\n\nProvide the enhanced README content only.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI enhancement error:', error.message);
    return existingContent;
  }
}

function generateFallbackReadme(repoData) {
  const hasNode = repoData.hasPackageJson;
  const hasPython = repoData.hasRequirements;
  const hasDocker = repoData.hasDockerfile;

  let installCmd = '';
  if (hasNode) installCmd = 'npm install';
  else if (hasPython) installCmd = 'pip install -r requirements.txt';
  else if (hasDocker) installCmd = 'docker build -t app .';
  else installCmd = '# Add installation steps here';

  let runCmd = '';
  if (hasNode) runCmd = 'npm start';
  else if (hasPython) runCmd = 'python main.py';
  else if (hasDocker) runCmd = 'docker run -p 3000:3000 app';
  else runCmd = '# Add run commands here';

  return `# ${repoData.name}

> ${repoData.description || `A ${repoData.language || 'software'} project`}

${repoData.language ? `![${repoData.language}](https://img.shields.io/badge/${repoData.language}-100%25-blue)` : ''}

## ✨ Features

- Modern and clean architecture
- Production-ready code
- Well-documented codebase
- Easy to use and extend

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/${repoData.owner || 'user'}/${repoData.name}.git
cd ${repoData.name}

# Install dependencies
${installCmd}

# Run the application
${runCmd}
\`\`\`

## 📄 License

MIT © ${new Date().getFullYear()}
`;
}
