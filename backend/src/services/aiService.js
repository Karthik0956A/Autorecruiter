// Mock AI service for JD analysis and skill extraction
// In production, integrate with Gemma, OpenAI, or Groq API

exports.analyzeJobDescription = async (jdText) => {
  try {
    // Extract skills from JD text
    const skills = extractSkills(jdText);
    
    // Extract experience level
    const experienceLevel = extractExperienceLevel(jdText);
    
    // Extract role
    const role = extractRole(jdText);
    
    // Generate summary
    const summary = generateSummary(jdText, role, skills);

    // Separate must-have and good-to-have skills
    const required_skills = skills.slice(0, Math.ceil(skills.length * 0.7));
    const good_to_have = skills.slice(Math.ceil(skills.length * 0.7));

    return {
      role,
      required_skills,
      good_to_have,
      experience_level: experienceLevel,
      summary
    };
  } catch (error) {
    throw new Error('Error analyzing job description');
  }
};

exports.extractSkillsFromResume = async (resumeText) => {
  try {
    return extractSkills(resumeText);
  } catch (error) {
    throw new Error('Error extracting skills from resume');
  }
};

exports.generateCandidateSummary = async (candidateData) => {
  try {
    const { name, experience_years, skills } = candidateData;
    const topSkills = skills.slice(0, 3).join(', ');
    return `${name} is a professional with ${experience_years || 'relevant'} years of experience specializing in ${topSkills}. Strong technical background with proven expertise in modern development practices.`;
  } catch (error) {
    throw new Error('Error generating candidate summary');
  }
};

exports.calculateMatchScore = (candidateSkills, requiredSkills, goodToHave, experienceYears, requiredExp) => {
  try {
    let score = 0;

    // Skill matching (70% weight)
    const matchedRequired = candidateSkills.filter(skill => 
      requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
    );
    const matchedGoodToHave = candidateSkills.filter(skill => 
      goodToHave.some(good => good.toLowerCase() === skill.toLowerCase())
    );

    const requiredSkillScore = (matchedRequired.length / (requiredSkills.length || 1)) * 70;
    const goodToHaveScore = (matchedGoodToHave.length / (goodToHave.length || 1)) * 10;

    // Experience matching (20% weight)
    let expScore = 0;
    const reqExp = parseExperienceRange(requiredExp);
    if (experienceYears >= reqExp.min && experienceYears <= reqExp.max) {
      expScore = 20;
    } else if (experienceYears > reqExp.max) {
      expScore = 15;
    } else {
      expScore = (experienceYears / reqExp.min) * 10;
    }

    score = requiredSkillScore + goodToHaveScore + expScore;
    return Math.min(Math.round(score), 100);
  } catch (error) {
    return 50; // Default score if calculation fails
  }
};

exports.explainMatch = (candidate, jd) => {
  const strengths = [];
  const weaknesses = [];
  const riskFactors = [];

  // Analyze strengths
  if (candidate.matched_skills.length > jd.required_skills.length * 0.7) {
    strengths.push('Strong skill alignment with job requirements');
  }
  if (candidate.experience_years >= 3) {
    strengths.push('Solid professional experience');
  }

  // Analyze weaknesses
  if (candidate.missing_skills.length > 2) {
    weaknesses.push('Missing some key technical skills');
  }
  if (candidate.experience_years < 2) {
    weaknesses.push('Limited professional experience');
  }

  // Analyze risks
  if (candidate.match_score < 60) {
    riskFactors.push('Below target match threshold');
  }

  const explanation = `This candidate matches ${candidate.match_score}% of the requirements. ${
    candidate.matched_skills.length
  } out of ${jd.required_skills.length} required skills are present.`;

  return {
    explanation,
    strengths: strengths.length > 0 ? strengths : ['Basic qualifications met'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['No significant concerns'],
    risk_factors: riskFactors.length > 0 ? riskFactors : ['Low risk candidate']
  };
};

// Helper functions
function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue',
    'TypeScript', 'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'Redux', 'Express',
    'Django', 'Flask', 'Spring', 'C++', 'C#', '.NET', 'PHP', 'Ruby',
    'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum', 'CI/CD',
    'Jenkins', 'Linux', 'Windows', 'MacOS', 'Android', 'iOS', 'Swift',
    'Kotlin', 'Flutter', 'React Native', 'Tailwind', 'Bootstrap', 'Sass'
  ];

  const foundSkills = [];
  commonSkills.forEach(skill => {
    const regex = new RegExp(skill, 'gi');
    if (regex.test(text)) {
      if (!foundSkills.includes(skill)) {
        foundSkills.push(skill);
      }
    }
  });

  return foundSkills;
}

function extractExperienceLevel(text) {
  const expPatterns = [
    /(\d+)\s*-\s*(\d+)\s*(years?|yrs?)/gi,
    /(\d+)\+?\s*(years?|yrs?)/gi
  ];

  for (const pattern of expPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  // Default levels
  if (/senior|lead|principal/gi.test(text)) return '5+ years';
  if (/mid-level|intermediate/gi.test(text)) return '2-5 years';
  if (/junior|entry/gi.test(text)) return '0-2 years';

  return '2-4 years';
}

function extractRole(text) {
  const rolePatterns = [
    /(?:hiring|looking for|seeking)\s+(?:a\s+)?([a-z\s]+?)(?:developer|engineer|architect|designer|manager|analyst)/gi,
    /(frontend|backend|full\s*stack|fullstack|devops|data|mobile|software|web)\s+(?:developer|engineer)/gi,
    /(developer|engineer|architect|designer|manager|analyst)/gi
  ];

  for (const pattern of rolePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  return 'Software Developer';
}

function generateSummary(jdText, role, skills) {
  const topSkills = skills.slice(0, 3).join(', ');
  return `Seeking a skilled ${role} with expertise in ${topSkills}. The ideal candidate will contribute to building scalable solutions and collaborate with cross-functional teams.`;
}

function parseExperienceRange(expString) {
  const rangeMatch = expString.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }

  const singleMatch = expString.match(/(\d+)/);
  if (singleMatch) {
    const years = parseInt(singleMatch[1]);
    return { min: years, max: years + 2 };
  }

  return { min: 2, max: 4 };
}

module.exports = exports;
