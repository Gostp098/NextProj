'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CVData } from '@/types/cv';

interface CVContextType {
  cvData: CVData;
  updateCVData: (data: Partial<CVData>) => void;
  resetCVData: () => void;
  loadExampleData: () => void;
}

const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    website: '',
  },
  summary: '',
  experience: [
    {
      id: '1',
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      id: '1',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  ],
  skills: [
    { id: '1', name: '', level: 'Intermediate' },
  ],
  projects: [
    {
      id: '1',
      name: '',
      description: '',
      technologies: [],
    },
  ],
  languages: [
    { id: '1', name: '', proficiency: 'Professional' },
  ],
  certifications: [
    {
      id: '1',
      name: '',
      issuer: '',
      date: '',
    },
  ],
};

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: ReactNode }) {
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCVData(parsedData);
      } catch (error) {
        console.error('Error loading CV data from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever cvData changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cvData', JSON.stringify(cvData));
    }
  }, [cvData, isInitialized]);

  const updateCVData = (data: Partial<CVData>) => {
    setCVData(prev => ({
      ...prev,
      ...data,
      personalInfo: { ...prev.personalInfo, ...data.personalInfo },
    }));
  };

  const resetCVData = () => {
    setCVData(defaultCVData);
    localStorage.setItem('cvData', JSON.stringify(defaultCVData));
  };

  const loadExampleData = () => {
    const exampleData: CVData = {
      personalInfo: {
        fullName: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson',
        website: 'alexjohnson.dev',
      },
      summary: 'Experienced software engineer with 5+ years in full-stack development. Passionate about creating scalable web applications and mentoring junior developers.',
      experience: [
        {
          id: '1',
          jobTitle: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          startDate: '2020-03',
          endDate: '2023-12',
          current: false,
          description: 'Led a team of 5 developers in building a customer-facing SaaS platform.',
        },
        {
          id: '2',
          jobTitle: 'Full Stack Developer',
          company: 'StartupXYZ',
          location: 'Remote',
          startDate: '2018-01',
          endDate: '2020-02',
          current: false,
          description: 'Developed and maintained multiple web applications using React and Node.js.',
        },
      ],
      education: [
        {
          id: '1',
          degree: 'Master of Science in Computer Science',
          institution: 'Stanford University',
          location: 'Stanford, CA',
          startDate: '2015-09',
          endDate: '2017-06',
          gpa: '3.8',
          description: 'Specialized in Software Engineering and Machine Learning.',
        },
      ],
      skills: [
        { id: '1', name: 'React', level: 'Expert' },
        { id: '2', name: 'TypeScript', level: 'Expert' },
        { id: '3', name: 'Node.js', level: 'Advanced' },
        { id: '4', name: 'Next.js', level: 'Advanced' },
        { id: '5', name: 'MongoDB', level: 'Intermediate' },
      ],
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution with real-time inventory management.',
          technologies: ['React', 'Node.js', 'MongoDB', 'Redis'],
          link: 'github.com/alexjohnson/ecommerce',
        },
      ],
      languages: [
        { id: '1', name: 'English', proficiency: 'Native' },
        { id: '2', name: 'Spanish', proficiency: 'Professional' },
      ],
      certifications: [
        {
          id: '1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2022-05',
          credentialId: 'AWS-123456',
        },
      ],
    };
    setCVData(exampleData);
    localStorage.setItem('cvData', JSON.stringify(exampleData));
  };

  return (
    <CVContext.Provider value={{ cvData, updateCVData, resetCVData, loadExampleData }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
}