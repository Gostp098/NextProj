'use client';

import { Plus, Trash2, Save, Upload } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Textarea } from '../components/UI/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card';
import { Select } from '../components/UI/Select';
import { useCV } from '../context/CVContext';
import { useEffect } from 'react';

export default function CVForm() {
  const { cvData, updateCVData, loadExampleData } = useCV();

  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      if (duration > 100) {
        console.warn(`Slow render: ${duration.toFixed(0)}ms`);
      }
    };
  }, []);

  const handlePersonalInfoChange = (field: string, value: string) => {
    updateCVData({
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const currentArray = [...cvData.experience];
    currentArray[index] = { ...currentArray[index], [field]: value };
    updateCVData({ experience: currentArray });
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    const currentArray = [...cvData.education];
    currentArray[index] = { ...currentArray[index], [field]: value };
    updateCVData({ education: currentArray });
  };

  const handleSkillChange = (index: number, field: string, value: any) => {
    const currentArray = [...cvData.skills];
    currentArray[index] = { ...currentArray[index], [field]: value };
    updateCVData({ skills: currentArray });
  };

  const addExperience = () => {
    const currentArray = [...cvData.experience];
    currentArray.push({
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    updateCVData({ experience: currentArray });
  };

  const removeExperience = (index: number) => {
    if (cvData.experience.length > 1) {
      const currentArray = [...cvData.experience];
      currentArray.splice(index, 1);
      updateCVData({ experience: currentArray });
    }
  };

  const addSkill = () => {
    const currentArray = [...cvData.skills];
    currentArray.push({
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate',
    });
    updateCVData({ skills: currentArray });
  };

  const removeSkill = (index: number) => {
    if (cvData.skills.length > 1) {
      const currentArray = [...cvData.skills];
      currentArray.splice(index, 1);
      updateCVData({ skills: currentArray });
    }
  };

  const addEducation = () => {
    const currentArray = [...cvData.education];
    currentArray.push({
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    updateCVData({ education: currentArray });
  };

  // Simple form handler - prevents default only
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission prevented - auto-save handles data');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Your existing form sections here */}
      {/* Personal Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">1</span>
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              value={cvData.personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
              required
            />
            {/* ... other fields ... */}
          </div>
        </CardContent>
      </Card>
      
      {/* ... other form sections ... */}
      
      <div className="flex gap-4">
        <Button 
          type="button"
          onClick={() => {
            // Test if data is saved
            const saved = localStorage.getItem('cvData');
            if (saved) {
              alert('✅ CV is saved! Go to Preview page.');
            } else {
              alert('❌ No data found. Try typing something first.');
            }
          }}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          Check Save Status
        </Button>
        <Button type="button" variant="outline" onClick={loadExampleData}>
          <Upload className="w-4 h-4 mr-2" />
          Load Example
        </Button>
      </div>
    </form>
  );
}