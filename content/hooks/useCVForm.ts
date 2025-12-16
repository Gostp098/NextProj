import { useCV } from '../../context/CVContext';
import { CVData } from '@/types/cv';

export function useCVForm() {
  const { cvData, updateCVData } = useCV();

  const handlePersonalInfoChange = (field: string, value: string) => {
    updateCVData({
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleArrayFieldChange = (
    field: keyof CVData,
    index: number,
    subField: string,
    value: any
  ) => {
    const currentArray = [...(cvData[field] as any[])];
    currentArray[index] = { ...currentArray[index], [subField]: value };
    
    updateCVData({
      [field]: currentArray,
    });
  };

  const addArrayItem = (field: keyof CVData, template: any) => {
    const currentArray = [...(cvData[field] as any[])];
    currentArray.push({
      ...template,
      id: Date.now().toString(),
    });
    
    updateCVData({
      [field]: currentArray,
    });
  };

  const removeArrayItem = (field: keyof CVData, index: number) => {
    const currentArray = [...(cvData[field] as any[])];
    if (currentArray.length > 1) {
      currentArray.splice(index, 1);
      updateCVData({
        [field]: currentArray,
      });
    }
  };

  return {
    cvData,
    handlePersonalInfoChange,
    handleArrayFieldChange,
    addArrayItem,
    removeArrayItem,
  };
}