import React, { useState } from 'react';
import { BookOpen, Heart, Users, Shield, AlertCircle, CheckCircle, Play, Download } from 'lucide-react';

const Awareness = () => {
  const [activeTab, setActiveTab] = useState('articles');

  const articles = [
    {
      id: 1,
      title: 'Blood Donation: Myths vs Facts',
      excerpt: 'Debunking common misconceptions about blood donation and presenting the scientific facts.',
      content: `
        <h3>Common Myths About Blood Donation</h3>
        <p>There are many misconceptions about blood donation that prevent people from becoming donors. Let's address the most common ones:</p>
        
        <h4>Myth 1: Blood donation makes you weak</h4>
        <p><strong>Fact:</strong> Your body quickly replaces the donated blood. Most people can resume normal activities within a few hours.</p>
        
        <h4>Myth 2: Blood donation is painful</h4>
        <p><strong>Fact:</strong> You may feel a slight pinch when the needle is inserted, but the process is generally painless.</p>
        
        <h4>Myth 3: You can get diseases from donating blood</h4>
        <p><strong>Fact:</strong> All equipment used is sterile and disposable. There's no risk of infection when donating blood.</p>
        
        <h4>Myth 4: People with tattoos can't donate</h4>
        <p><strong>Fact:</strong> You can donate blood if your tattoo was done at a licensed facility and it's been at least 6 months.</p>
      `,
      author: 'Dr. Sushma Sharma',
      publishDate: '2024-03-10',
      readTime: '5 min read',
      category: 'Education'
    },
    {
      id: 2,
      title: 'Who Can Donate Blood?',
      excerpt: 'Understanding the eligibility criteria for blood donation in Nepal.',
      content: `
        <h3>Blood Donation Eligibility Criteria</h3>
        <p>Not everyone can donate blood. Here are the basic requirements:</p>
        
        <h4>Age Requirements</h4>
        <ul>
          <li>Must be between 18-65 years old</li>
          <li>First-time donors should be under 60</li>
        </ul>
        
        <h4>Weight Requirements</h4>
        <ul>
          <li>Minimum weight: 50 kg (110 lbs)</li>
          <li>BMI should be within healthy range</li>
        </ul>
        
        <h4>Health Requirements</h4>
        <ul>
          <li>Good general health</li>
          <li>No recent illness or infections</li>
          <li>Normal blood pressure and pulse</li>
          <li>Adequate hemoglobin levels</li>
        </ul>
        
        <h4>Lifestyle Factors</h4>
        <ul>
          <li>No recent travel to malaria-endemic areas</li>
          <li>No recent piercings or tattoos (within 6 months)</li>
          <li>No high-risk behaviors</li>
        </ul>
      `,
      author: 'Dr. Rajesh Karki',
      publishDate: '2024-03-08',
      readTime: '4 min read',
      category: 'Guidelines'
    },
    {
      id: 3,
      title: 'The Blood Donation Process',
      excerpt: 'Step-by-step guide to what happens when you donate blood.',
      content: `
        <h3>What to Expect During Blood Donation</h3>
        <p>Understanding the process can help ease any anxiety about donating blood:</p>
        
        <h4>Before Donation</h4>
        <ul>
          <li>Registration and medical history questionnaire</li>
          <li>Mini physical exam (blood pressure, pulse, temperature)</li>
          <li>Hemoglobin test</li>
        </ul>
        
        <h4>During Donation</h4>
        <ul>
          <li>Comfortable seating in donation chair</li>
          <li>Arm cleaning and needle insertion</li>
          <li>Blood collection (8-10 minutes)</li>
          <li>Approximately 450ml of blood collected</li>
        </ul>
        
        <h4>After Donation</h4>
        <ul>
          <li>Rest for 10-15 minutes</li>
          <li>Light refreshments provided</li>
          <li>Donation certificate issued</li>
          <li>Post-donation care instructions</li>
        </ul>
      `,
      author: 'Nurse Kamala Thapa',
      publishDate: '2024-03-05',
      readTime: '6 min read',
      category: 'Process'
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Blood Donation - Save a Life',
      description: 'Inspiring stories of blood donors and recipients in Nepal',
      duration: '3:45',
      thumbnail: '/api/placeholder/300/200',
      views: '12,456'
    },
    {
      id: 2,
      title: 'How Blood Donation Works',
      description: 'Educational video about the blood donation process',
      duration: '5:20',
      thumbnail: '/api/placeholder/300/200',
      views: '8,932'
    }
  ];

  const infographics = [
    {
      id: 1,
      title: 'Blood Types Compatibility Chart',
      description: 'Visual guide to blood type compatibility for donations',
      image: '/api/placeholder/400/300',
      downloads: '2,345'
    },
    {
      id: 2,
      title: 'Blood Donation Benefits',
      description: 'Health benefits of regular blood donation',
      image: '/api/placeholder/400/300',
      downloads: '1,876'
    }
  ];

  const [selectedArticle, setSelectedArticle] = useState(null);

  const renderArticleContent = (content) => {
    return { __html: content };
  };

  return (
    <div className="awareness">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <BookOpen className="inline mr-2" size={28} />
            Blood Donation Awareness
          </h1>
          <p className="text-gray">
            Learn about blood donation, its importance, and how you can help save lives
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('articles')}
            className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
          >
            <BookOpen className="inline mr-2" size={16} />
            Articles
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          >
            <Play className="inline mr-2" size={16} />
            Videos
          </button>
          <button
            onClick={() => setActiveTab('infographics')}
            className={`tab-btn ${activeTab === 'infographics' ? 'active' : ''}`}
          >
            <Download className="inline mr-2" size={16} />
            Infographics
          </button>
        </div>
      </div>

      {/* Articles Tab */}
      {activeTab === 'articles' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Educational Articles</h2>
          </div>
          
          {selectedArticle ? (
            <div className="article-reader">
              <button
                onClick={() => setSelectedArticle(null)}
                className="btn btn-secondary mb-4"
              >
                ← Back to Articles
              </button>
              
              <div className="article-full">
                <h1 className="article-title">{selectedArticle.title}</h1>
                <div className="article-meta">
                  By {selectedArticle.author} • {selectedArticle.publishDate} • {selectedArticle.readTime}
                </div>
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={renderArticleContent(selectedArticle.content)}
                />
              </div>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map(article => (
                <div key={article.id} className="article-card">
                  <div className="article-header">
                    <h3 className="article-title">{article.title}</h3>
                    <span className="article-category">{article.category}</span>
                  </div>
                  <div className="article-meta">
                    By {article.author} • {article.publishDate} • {article.readTime}
                  </div>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="btn btn-primary"
                  >
                    Read More
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Educational Videos</h2>
          </div>
          
          <div className="videos-grid">
            {videos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
                  <div className="video-placeholder">
                    <Play size={48} />
                  </div>
                  <span className="video-duration">{video.duration}</span>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-description">{video.description}</p>
                  <div className="video-stats">
                    {video.views} views
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Infographics Tab */}
      {activeTab === 'infographics' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Infographics & Resources</h2>
          </div>
          
          <div className="infographics-grid">
            {infographics.map(infographic => (
              <div key={infographic.id} className="infographic-card">
                <div className="infographic-image">
                  <div className="infographic-placeholder">
                    <Download size={48} />
                  </div>
                </div>
                <div className="infographic-info">
                  <h3 className="infographic-title">{infographic.title}</h3>
                  <p className="infographic-description">{infographic.description}</p>
                  <div className="infographic-stats">
                    {infographic.downloads} downloads
                  </div>
                  <button className="btn btn-primary">
                    <Download className="inline mr-2" size={16} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Facts Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Heart className="inline mr-2" size={20} />
            Key Facts About Blood Donation
          </h2>
        </div>
        
        <div className="facts-grid">
          <div className="fact-card">
            <div className="fact-icon">
              <Heart className="text-red-500" size={24} />
            </div>
            <h3 className="fact-title">One Donation</h3>
            <p className="fact-description">
              Can save up to 3 lives by being separated into red cells, plasma, and platelets
            </p>
          </div>
          
          <div className="fact-card">
            <div className="fact-icon">
              <Users className="text-blue-500" size={24} />
            </div>
            <h3 className="fact-title">Only 3%</h3>
            <p className="fact-description">
              Of Nepal's population donates blood regularly, but demand is much higher
            </p>
          </div>
          
          <div className="fact-card">
            <div className="fact-icon">
              <Shield className="text-green-500" size={24} />
            </div>
            <h3 className="fact-title">Safe Process</h3>
            <p className="fact-description">
              All equipment is sterile and single-use, making donation completely safe
            </p>
          </div>
          
          <div className="fact-card">
            <div className="fact-icon">
              <AlertCircle className="text-yellow-500" size={24} />
            </div>
            <h3 className="fact-title">Every 2 Seconds</h3>
            <p className="fact-description">
              Someone in Nepal needs blood, highlighting the constant demand
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awareness;