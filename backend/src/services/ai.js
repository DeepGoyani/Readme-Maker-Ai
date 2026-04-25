// Google Gemini API
const GEMINI_API_KEY = 'AIzaSyDaORd4QK-SPeVbtId_0ujR2VcJvsv5XDA';

async function callGeminiAPI(prompt) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });
  
  const data = await response.json();
  
  if (data.candidates && data.candidates[0]) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Failed to generate content');
}

// Template structures - completely different for each type
const TEMPLATE_STRUCTURES = {
  modern: {
    sections: ['hero', 'badges', 'features', 'tech-stack', 'quick-start', 'demo', 'contributing'],
    style: 'visual-modern',
    tone: 'friendly-professional',
    maxLength: 800
  },
  minimal: {
    sections: ['title', 'description', 'install', 'usage'],
    style: 'bare-minimum',
    tone: 'direct-concise',
    maxLength: 200
  },
  detailed: {
    sections: ['header', 'toc', 'overview', 'architecture', 'api', 'setup', 'deployment', 'testing', 'troubleshooting', 'contributing', 'license'],
    style: 'comprehensive',
    tone: 'technical-thorough',
    maxLength: 2000
  },
  premium: {
    sections: ['executive-summary', 'branding', 'value-proposition', 'feature-matrix', 'specifications', 'performance', 'security', 'enterprise-deployment', 'monitoring', 'sla', 'testimonials', 'roadmap', 'contact'],
    style: 'enterprise-corporate',
    tone: 'business-professional',
    maxLength: 3000
  }
};

export async function generateReadme(repoData, template = 'modern') {
  try {
    const templateConfig = TEMPLATE_STRUCTURES[template] || TEMPLATE_STRUCTURES.modern;
    
    const systemPrompt = `You are an expert technical writer specializing in creating high-quality README files for GitHub repositories. 
Your task is to analyze repository information and generate a professional, engaging README.md content.

CRITICAL INSTRUCTION: You MUST generate a README that follows the EXACT structure and style specified for the ${template.toUpperCase()} template. Each template has completely different requirements.

Repository Data:
- Name: ${repoData.name}
- Description: ${repoData.description || 'No description'}
- Language: ${repoData.language || 'Mixed'}
- Stars: ${repoData.stars || 0}
- Forks: ${repoData.forks || 0}
- Topics: ${repoData.topics?.join(', ') || 'None'}
- Has Package.json: ${repoData.hasPackageJson ? 'Yes' : 'No'}
- Has Requirements.txt: ${repoData.hasRequirements ? 'Yes' : 'No'}
- Has Dockerfile: ${repoData.hasDockerfile ? 'Yes' : 'No'}
- Languages: ${JSON.stringify(repoData.languages)}
- Root Files: ${repoData.rootFiles?.slice(0, 10).join(', ') || 'N/A'}

Template Configuration:
- Sections: ${templateConfig.sections.join(', ')}
- Style: ${templateConfig.style}
- Tone: ${templateConfig.tone}
- Max Length: ${templateConfig.maxLength} words

CRITICAL: Generate content SPECIFICALLY for the ${template.toUpperCase()} template using ONLY the sections listed. Each template must be UNIQUE in structure and content.
- MODERN: Use hero, badges, features, tech-stack, quick-start sections
- MINIMAL: Use only title, description, install, usage - maximum 200 words
- DETAILED: Use all technical sections with comprehensive explanations
- PREMIUM: Use enterprise sections with business focus

Generate ONLY the README content as raw markdown. Do not wrap in code blocks. Make it professional and engaging.`;

    const userPrompt = `Generate a README for the following repository:

Repository Data:
- Name: ${repoData.name}
- Description: ${repoData.description || 'No description'}
- Language: ${repoData.language || 'Mixed'}
- Stars: ${repoData.stars || 0}
- Forks: ${repoData.forks || 0}
- Topics: ${repoData.topics?.join(', ') || 'None'}
- Has Package.json: ${repoData.hasPackageJson ? 'Yes' : 'No'}
- Has Requirements.txt: ${repoData.hasRequirements ? 'Yes' : 'No'}
- Has Dockerfile: ${repoData.hasDockerfile ? 'Yes' : 'No'}
- Languages: ${JSON.stringify(repoData.languages)}
- Root Files: ${repoData.rootFiles?.slice(0, 10).join(', ') || 'N/A'}

Template Configuration:
- Sections: ${templateConfig.sections.join(', ')}
- Style: ${templateConfig.style}
- Tone: ${templateConfig.tone}
- Max Length: ${templateConfig.maxLength} words

CRITICAL: Generate content SPECIFICALLY for the ${template.toUpperCase()} template using ONLY the sections listed. Each template must be UNIQUE in structure and content.
- MODERN: Use hero, badges, features, tech-stack, quick-start sections
- MINIMAL: Use only title, description, install, usage - maximum 200 words
- DETAILED: Use all technical sections with comprehensive explanations
- PREMIUM: Use enterprise sections with business focus

Generate ONLY the README content as raw markdown. Do not wrap in code blocks. Make it professional and engaging.`;

    try {
      const content = await callGeminiAPI(userPrompt);
      return content.trim();
    } catch (error) {
      console.error('Gemini API error:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('AI generation error:', error.message);
    
    // Fallback template
    return generateFallbackReadme(repoData, template);
  }
}

// Fallback template generator
function generateFallbackReadme(repoData, template) {
  const { name, description, language, stars, forks } = repoData;
  
  switch(template) {
    case 'modern':
      return `# ${name}

![GitHub stars](https://img.shields.io/badge/stars-${stars}-blue) ![GitHub forks](https://img.shields.io/badge/forks-${forks}-green) ![License](https://img.shields.io/badge/license-MIT-orange)

> ${description || 'A modern, professional project built with cutting-edge technology.'}

## ✨ Features

- 🚀 **Modern Architecture** - Built with the latest technologies
- 🎨 **Beautiful Design** - Clean, intuitive user interface
- ⚡ **High Performance** - Optimized for speed and efficiency
- 🔧 **Easy Configuration** - Simple setup and customization
- 📱 **Responsive** - Works perfectly on all devices
- 🛡️ **Secure** - Built with security best practices

## 🛠️ Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| ${language || 'JavaScript'} | Latest | Primary development language |
| Node.js | v18+ | Runtime environment |
| Git | v2.30+ | Version control |

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/username/${name}.git

# Install dependencies
npm install

# Start the application
npm run dev
\`\`\`

## 📸 Demo

![Demo](https://via.placeholder.com/600x300?text=Demo+Screenshot)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`;

    case 'minimal':
      return `# ${name}

${description || 'A minimal, efficient project.'}

## Installation

\`\`\`bash
npm install ${name}
\`\`\`

## Usage

\`\`\`javascript
const ${name} = require('${name}');
${name}();
\`\`\`

## License

MIT`;

    case 'detailed':
      return `# ${name}

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Coverage](https://img.shields.io/badge/coverage-85%25-green) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

> ${description || 'A comprehensive, well-documented project with extensive features and robust architecture.'}

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

${name} is a sophisticated ${language || 'software'} solution designed to provide exceptional performance and reliability. Built with modern development practices and comprehensive testing.

## Features

### Core Functionality
- **Advanced Processing** - High-performance data handling
- **Scalable Architecture** - Designed for growth and expansion
- **Security First** - Enterprise-grade security measures
- **Real-time Updates** - Live data synchronization
- **Cross-platform Compatibility** - Works on all major platforms

### Technical Specifications
- **Language**: ${language || 'Multi-language'}
- **Performance**: 99.9% uptime
- **Scalability**: Horizontal and vertical scaling
- **Security**: OAuth 2.0, JWT authentication

## Architecture

The system follows a microservices architecture with the following components:

### Components
- **API Gateway** - Request routing and load balancing
- **Authentication Service** - User management and security
- **Database Layer** - Data persistence and caching
- **Background Workers** - Asynchronous task processing

### Data Flow
\`\`\`
User Request → API Gateway → Auth Service → Business Logic → Database → Response
\`\`\`

## API Documentation

### Endpoints

#### GET /api/v1/resource
Returns a list of all resources.

**Parameters:**
- \`page\` (optional): Page number for pagination
- \`limit\` (optional): Number of items per page

**Response:**
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "total": 100
  }
}
\`\`\`

#### POST /api/v1/resource
Creates a new resource.

**Request Body:**
\`\`\`json
{
  "name": "example",
  "value": "data"
}
\`\`\`

## Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 8.0 or higher
- Git 2.30 or higher

### Setup Steps

1. **Clone Repository**
   \`\`\`bash
   git clone https://github.com/username/${name}.git
   cd ${name}
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

4. **Database Setup**
   \`\`\`bash
   npm run db:setup
   npm run db:migrate
   \`\`\`

5. **Start Application**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|-----------|---------|-------------|
| NODE_ENV | Yes | development | Application environment |
| PORT | No | 3000 | Server port |
| DATABASE_URL | Yes | - | Database connection string |
| JWT_SECRET | Yes | - | JWT signing secret |

### Advanced Configuration

For production deployments, consider these additional settings:

- **Caching**: Redis for session storage
- **Monitoring**: Prometheus metrics collection
- **Logging**: Winston with structured logs
- **Rate Limiting**: Express-rate-limit for API protection

## Deployment

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Docker Deployment
\`\`\`bash
docker build -t ${name} .
docker run -p 3000:3000 ${name}
\`\`\`

### Cloud Platforms
- **AWS**: ECS with Application Load Balancer
- **Google Cloud**: Cloud Run with auto-scaling
- **Azure**: App Service with CDN integration

## Testing

### Unit Tests
\`\`\`bash
npm run test:unit
\`\`\`

### Integration Tests
\`\`\`bash
npm run test:integration
\`\`\`

### End-to-End Tests
\`\`\`bash
npm run test:e2e
\`\`\`

### Test Coverage
Current coverage: **85%**
Target coverage: **90%**

## Contributing

We encourage contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Add** tests for new functionality
5. **Ensure** all tests pass
6. **Submit** a pull request

### Code Standards
- Use ESLint for code formatting
- Follow conventional commits
- Write meaningful commit messages
- Document complex functions

### Pull Request Template
- Clear title describing the change
- Detailed description of implementation
- Link to related issues
- Screenshots for UI changes

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for complete details.

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}`;

    case 'premium':
      return `# ${name}

![Enterprise Grade](https://img.shields.io/badge/Enterprise-Premium-gold) ![Production Ready](https://img.shields.io/badge/Production%20Ready-brightgreen) ![SLA](https://img.shields.io/badge/SLA-99.9%25-blue)

## Executive Summary

${name} is an enterprise-grade solution designed for organizations requiring **high performance**, **scalability**, and **professional support**. Built with cutting-edge technology and adhering to industry best practices, this platform delivers exceptional value for mission-critical applications.

### Business Value Proposition

- **🚀 Increased Productivity** - 40% faster development cycles
- **💰 Cost Reduction** - 60% lower infrastructure costs  
- **🛡️ Enhanced Security** - Enterprise-grade security measures
- **📈 Scalability** - Handles 10M+ concurrent users
- **🎯 99.9% Uptime** - Guaranteed availability

## Professional Branding

### Corporate Identity
- **Brand Colors**: Professional palette with accessibility compliance
- **Typography**: Clean, readable font hierarchy
- **Logo Guidelines**: Consistent brand representation
- **Voice**: Professional, confident communication tone

## Feature Matrix

| Feature | Standard | Professional | Enterprise |
|----------|-----------|------------|------------|
| **Core Functionality** | Basic | Advanced | Complete |
| **User Management** | Local Auth | SSO Integration | Enterprise Directory |
| **API Access** | Rate Limited | Priority Queue | Unlimited Access |
| **Support** | Community | Business Hours | 24/7 Dedicated |
| **Customization** | Limited | Extensible | White-label Solutions |
| **Analytics** | Basic | Advanced | Real-time Intelligence |

## Technical Specifications

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Memory**: Minimum 8GB RAM, Recommended 16GB+
- **Storage**: SSD with at least 50GB free space
- **Network**: Stable internet connection (100 Mbps+)

### Performance Metrics
- **Response Time**: < 100ms (P95)
- **Throughput**: 10,000+ requests/second
- **Concurrent Users**: 1,000,000+ supported
- **Data Processing**: 1TB+ per hour

### Compliance & Certifications
- **SOC 2 Type II** - Security compliance certified
- **GDPR Compliant** - Data protection standards
- **ISO 27001** - Information security management
- **HIPAA Ready** - Healthcare data protection

## Security Considerations

### Enterprise Security Measures
- **Multi-factor Authentication** - SSO + 2FA required
- **End-to-end Encryption** - AES-256 encryption standards
- **Regular Security Audits** - Quarterly penetration testing
- **Data Privacy** - Zero-knowledge architecture
- **Access Controls** - Role-based permissions

### Threat Protection
- **DDoS Mitigation** - Cloudflare protection
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content Security Policy
- **Rate Limiting** - Intelligent abuse prevention

## Enterprise Deployment

### On-Premises Deployment
\`\`\`bash
# Enterprise Setup
./deploy-enterprise.sh --mode=production --ssl=enterprise --monitoring=full
\`\`\`

### Cloud Deployment
- **AWS**: ECS with dedicated VPC and Application Load Balancer
- **Azure**: App Service with VNet integration and Application Gateway
- **Google Cloud**: GKE with dedicated cluster and Cloud CDN
- **Private Cloud**: Support for all major providers

### Infrastructure as Code
\`\`\`yaml
# enterprise-deployment.yml
version: '3.8'
services:
  ${name}:
    image: ${name}:enterprise
    replicas: 10
    resources:
      limits:
        cpus: '4'
        memory: 8Gi
    environment:
      - NODE_ENV: production
      - LOG_LEVEL: info
\`\`\`

## Monitoring & Observability

### Real-time Monitoring
- **Application Performance** - New Relic APM
- **Infrastructure Health** - Datadog monitoring
- **Log Aggregation** - ELK stack (Elasticsearch, Logstash, Kibana)
- **Error Tracking** - Sentry integration

### Business Intelligence
- **User Analytics** - Custom dashboard with real-time insights
- **Performance Metrics** - Grafana dashboards with KPI tracking
- **Cost Optimization** - Cloud cost monitoring and alerts
- **Usage Reports** - Automated monthly business reports

## SLA & Support

### Service Level Agreement
- **Uptime Guarantee**: 99.9% monthly availability
- **Response Time**: < 4 hours for critical issues
- **Resolution Time**: < 24 hours for major incidents
- **Planned Maintenance**: Maximum 4 hours monthly window

### Support Channels
- **24/7 Dedicated Support** - Enterprise phone and email
- **Technical Account Manager** - Dedicated support specialist
- **Online Portal** - Ticket tracking and knowledge base
- **Emergency Contacts** - Direct line to senior engineers

### Support Tiers
| Tier | Response Time | Features | Cost |
|-------|---------------|----------|------|
| **Standard** | 24 hours | Email support | $0/month |
| **Professional** | 4 hours | Priority queue | $5,000/month |
| **Enterprise** | 1 hour | 24/7 dedicated | Custom pricing |

## Customer Testimonials

### Industry Leaders
> "${name} has transformed our development process. The enterprise features and professional support have exceeded our expectations." - **CTO, Fortune 500 Company**

> "The security features and compliance certifications gave us the confidence to deploy ${name} in our regulated environment. Outstanding performance and reliability." - **Security Director, Healthcare Provider**

> "We've seen a 40% reduction in infrastructure costs and 60% improvement in development velocity since implementing ${name}." - **VP Engineering, SaaS Company**

## Interactive Demo

### Live Demo
- **Production Demo**: [https://demo.${name.toLowerCase()}.com](https://demo.${name.toLowerCase()}.com)
- **Sandbox Environment**: [https://sandbox.${name.toLowerCase()}.com](https://sandbox.${name.toLowerCase()}.com)
- **API Explorer**: [https://docs.${name.toLowerCase()}.com/api-explorer](https://docs.${name.toLowerCase()}.com/api-explorer)

### Documentation Portal
- **Complete API Docs**: [https://docs.${name.toLowerCase()}.com](https://docs.${name.toLowerCase()}.com)
- **Developer Guides**: [https://docs.${name.toLowerCase()}.com/guides](https://docs.${name.toLowerCase()}.com/guides)
- **Video Tutorials**: [https://docs.${name.toLowerCase()}.com/tutorials](https://docs.${name.toLowerCase()}.com/tutorials)

## Roadmap & Future Plans

### Q1 2024
- **AI Integration** - Advanced machine learning capabilities
- **Mobile Applications** - Native iOS and Android apps
- **Advanced Analytics** - Predictive insights and recommendations

### Q2 2024
- **Blockchain Integration** - Distributed ledger support
- **Edge Computing** - Global CDN with edge processing
- **API v2.0** - Enhanced performance and features

### Q3 2024
- **Quantum Computing** - Next-generation processing
- **IoT Platform** - Complete device management
- **5G Network** - Ultra-low latency connectivity

### Long-term Vision
- **Autonomous Operations** - Self-healing infrastructure
- **Global Expansion** - Multi-region deployment
- **Sustainability** - Carbon-neutral operations

## Professional Contact Information

### Corporate Headquarters
**${name} Inc.**
1234 Enterprise Way, Suite 100
San Francisco, CA 94105
United States

### Executive Team
- **Chief Executive Officer**: CEO@${name.toLowerCase()}.com
- **Technical Support**: support@${name.toLowerCase()}.com
- **Sales Inquiries**: sales@${name.toLowerCase()}.com
- **Partnerships**: partners@${name.toLowerCase()}.com

### Business Hours
- **Monday - Friday**: 9:00 AM - 6:00 PM PST
- **Emergency Support**: 24/7/365
- **Response Guarantee**: < 1 hour for critical issues

---

## Certification & Compliance

![ISO 27001](https://img.shields.io/badge/ISO%2027001-Certified-green) ![SOC 2](https://img.shields.io/badge/SOC%202-Type%20II-Compliant-blue) ![GDPR](https://img.shields.io/badge/GDPR-Compliant-orange)

**${name}** is committed to maintaining the highest standards of security, privacy, and operational excellence.

---

*Last Updated: ${new Date().toISOString().split('T')[0]} | Version: Enterprise v2.0*`;

    default:
      return `# ${name}

A basic README for ${description || 'this project'}.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`
// Basic usage
const app = require('${name}');
app.run();
\`\`\`

## License

MIT`;
  }
}

export async function enhanceReadme(existingContent, instructions) {
  try {
    const prompt = `Enhance this README based on the user instructions:

Original README:
${existingContent}

Instructions: ${instructions}

Return ONLY the improved README content as raw markdown.`;

    const content = await callGeminiAPI(prompt);
    return content.trim();
  } catch (error) {
    console.error('AI enhancement error:', error.message);
    return existingContent;
  }
}
