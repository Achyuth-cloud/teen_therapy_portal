import React, { useEffect, useMemo, useState } from 'react';
import { FaFileAlt, FaPhone, FaHeart, FaYoutube, FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { resourceApi, getErrorMessage } from '../../services/api';

const typeIcons = {
  article: FaFileAlt,
  video: FaYoutube,
  helpline: FaPhone,
  exercise: FaBook
};

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [{ data: resourceList }, { data: categoryList }] = await Promise.all([
          resourceApi.getAll(),
          resourceApi.getCategories()
        ]);
        setResources(resourceList);
        setCategories(categoryList);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load resources'));
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const filteredResources = useMemo(() => {
    if (activeCategory === 'all') {
      return resources;
    }

    return resources.filter((resource) => resource.type === activeCategory);
  }, [activeCategory, resources]);

  const categoryButtons = [
    { id: 'all', label: 'All Resources', icon: FaBook },
    ...categories.map((category) => ({
      id: category.category,
      label: `${category.category.charAt(0).toUpperCase()}${category.category.slice(1)}`,
      icon: typeIcons[category.category] || FaBook
    }))
  ];

  if (loading) {
    return <div className="card"><div className="card-body">Loading resources...</div></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Mental Health Resources</h1>
          <p style={{ color: '#666' }}>Explore articles, videos, and support services</p>
        </div>
        <div className="flex" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          {categoryButtons.map((category) => (
            <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`btn ${activeCategory === category.id ? 'btn-primary' : 'btn-outline'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <category.icon />
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-3">
        {filteredResources.map((resource) => {
          const Icon = typeIcons[resource.type] || FaBook;

          return (
            <div key={resource.resource_id} className="card">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5e72e4' }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{resource.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#8898aa', marginTop: '0.25rem' }}>
                      {resource.type}
                    </p>
                  </div>
                </div>
                <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>{resource.description}</p>
                {resource.content && (
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>{resource.content}</p>
                )}
                {resource.link && (
                  <a href={resource.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                    Open Resource <FaExternalLinkAlt style={{ marginLeft: '0.5rem' }} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="card-body" style={{ textAlign: 'center' }}>
          <FaHeart size={32} style={{ marginBottom: '1rem' }} />
          <h3>Need Immediate Support?</h3>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
            If you are in immediate danger, call 999. If you need urgent emotional support in the UK, contact Samaritans on 116 123, text SHOUT to 85258, or contact Childline on 0800 1111.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;
