const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

// Parse PDF resume
exports.parsePDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Error parsing PDF file');
  }
};

// Parse DOC/DOCX resume
exports.parseDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error('Error parsing DOC/DOCX file');
  }
};

// Parse resume based on file type
exports.parseResume = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      return await this.parsePDF(filePath);
    } else if (
      mimetype === 'application/msword' ||
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return await this.parseDOCX(filePath);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    throw error;
  }
};

// Extract candidate info from resume text (simple version)
exports.extractCandidateInfo = (resumeText) => {
  const info = {
    name: '',
    email: '',
    phone: '',
    skills: [],
    experience_years: 0
  };

  // Extract email
  const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Extract phone
  const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    info.phone = phoneMatch[0];
  }

  // Extract name (first line usually)
  const lines = resumeText.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    info.name = lines[0].trim();
  }

  // Extract common skills
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue',
    'TypeScript', 'MongoDB', 'SQL', 'PostgreSQL', 'MySQL', 'AWS', 'Azure',
    'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'Redux', 'Express',
    'Django', 'Flask', 'Spring', 'C++', 'C#', '.NET', 'PHP', 'Ruby',
    'Machine Learning', 'AI', 'Data Science', 'DevOps', 'CI/CD'
  ];

  commonSkills.forEach(skill => {
    const regex = new RegExp(skill, 'gi');
    if (regex.test(resumeText)) {
      if (!info.skills.includes(skill)) {
        info.skills.push(skill);
      }
    }
  });

  // Estimate experience years
  const expMatch = resumeText.match(/(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi);
  if (expMatch) {
    const numbers = expMatch[0].match(/\d+/);
    if (numbers) {
      info.experience_years = parseInt(numbers[0]);
    }
  }

  return info;
};
