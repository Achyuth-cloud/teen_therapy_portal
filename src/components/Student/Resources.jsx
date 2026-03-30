import React, { useState } from 'react';
import { FaVideo, FaFileAlt, FaPhone, FaHeart, FaYoutube, FaBook, FaExternalLinkAlt } from 'react-icons/fa';

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const resources = {
    articles: [
      { id: 1, title: 'Understanding Anxiety in Teens', description: 'Learn about common anxiety triggers and coping strategies.', icon: FaFileAlt, link: '#' },
      { id: 2, title: 'Building Resilience', description: 'Tips for developing emotional strength and adaptability.', icon: FaFileAlt, link: '#' },
      { id: 3, title: 'Healthy Sleep Habits', description: 'How sleep affects mental health and wellbeing.', icon: FaFileAlt, link: '#' }
    ],
    videos: [
      { id: 4, title: 'Mindfulness for Beginners', description: '10-minute guided mindfulness practice', icon: FaYoutube, link: '#', duration: '10:00' },
      { id: 5, title: 'Managing Stress', description: 'Practical techniques for stress reduction', icon: FaYoutube, link: '#', duration: '15:00' }
    ],
    helplines: [
      { id: 6, title: 'Crisis Helpline', number: '1-800-273-8255', description: '24/7 support for crisis situations', icon: FaPhone },
      { id: 7, title: 'Teen Support Line', number: '1-800-852-8336', description: 'Confidential support for teens', icon: FaPhone }
    ]
  };

  const categories = [
    { id: 'all', label: 'All Resources', icon: FaBook },
    { id: 'articles', label: 'Articles', icon: FaFileAlt },
    { id: 'videos', label: 'Videos', icon: FaYoutube },
    { id: 'helplines', label: 'Helplines', icon: FaPhone }
  ];

  const getAllResources = () => {
    return [...resources.articles, ...resources.videos, ...resources.helplines];
  };

  const getFilteredResources = () => {
    if (activeCategory === 'all') return getAllResources();
    return resources[activeCategory] || [];
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Mental Health Resources</h1>
          <p style={{ color: '#666' }}>Explore articles, videos, and support services</p>
        </div>
        <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`btn ${activeCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <category.icon />
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-3">
        {getFilteredResources().map(resource => (
          <div key={resource.id} className="card">
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5e72e4'
                }}>
                  <resource.icon size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{resource.title}</h4>
                  {resource.duration && (
                    <p style={{ fontSize: '0.75rem', color: '#8898aa', marginTop: '0.25rem' }}>{resource.duration}</p>
                  )}
                  {resource.number && (
                    <p style={{ fontSize: '0.875rem', color: '#5e72e4', fontWeight: 600, marginTop: '0.25rem' }}>
                      {resource.number}
                    </p>
                  )}
                </div>
              </div>
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {resource.description}
              </p>
              {resource.link && (
                <a href={resource.link} className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                  Learn More <FaExternalLinkAlt style={{ marginLeft: '0.5rem' }} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="card-body" style={{ textAlign: 'center' }}>
          <FaHeart size={32} style={{ marginBottom: '1rem' }} />
          <h3>Need Immediate Support?</h3>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
            If you're in crisis, please reach out to a trusted adult or call a crisis helpline immediately.
          </p>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1rem' }}>
            Crisis Helpline: 1-800-273-8255
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;