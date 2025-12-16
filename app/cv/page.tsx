'use client';

import { useState } from 'react';
import './cv-styles.css'; // Optional page-specific styles

export default function CvPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [{ jobTitle: '', company: '', description: '' }],
    skills: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate CV');
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { jobTitle: '', company: '', description: '' }]
    });
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '0.5rem' }}>
          📄 CV Generator
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Fill the form and download your CV as PDF
        </p>
      </header>

      <form 
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Personal Info */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            👤 Personal Information
          </h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            📝 Professional Summary
          </h2>
          <div className="form-group">
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              rows={4}
              placeholder="Brief summary about yourself..."
              style={{ width: '100%' }}
            />
          </div>
        </section>

        {/* Experience */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            💼 Experience
          </h2>
          
          {formData.experience.map((exp, index) => (
            <div 
              key={index}
              style={{
                border: '1px solid #eee',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                background: '#f9f9f9'
              }}
            >
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    placeholder="Software Developer"
                    value={exp.jobTitle}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].jobTitle = e.target.value;
                      setFormData({...formData, experience: newExp});
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    placeholder="Tech Company Inc."
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].company = e.target.value;
                      setFormData({...formData, experience: newExp});
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[index].description = e.target.value;
                    setFormData({...formData, experience: newExp});
                  }}
                  rows={2}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addExperience}
            style={{
              background: 'transparent',
              border: '1px dashed #007bff',
              color: '#007bff',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            + Add Experience
          </button>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>
            🛠️ Skills
          </h2>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              placeholder="JavaScript, React, Node.js, etc."
            />
          </div>
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? (
            <>
              <span className="loading-spinner" style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '3px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%'
              }}></span>
              Generating PDF...
            </>
          ) : (
            <>
              ⬇️ Download CV as PDF
            </>
          )}
        </button>
      </form>
    </div>
  );
}