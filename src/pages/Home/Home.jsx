import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const projects = [
    {
      id: 'card-scanner',
      title: 'Card Scanner',
      description: '交互式信用卡扫描动画效果，展示卡片经过扫描器时的视觉转换',
      path: '/card-scanner',
      tags: ['React', 'Three.js', 'Canvas', 'CSS'],
      icon: '💳',
    },
    // 后续可以在这里添加更多项目
  ];

  return (
    <div className="home">
      <div className="home-container">
        <header className="home-header">
          <h1 className="home-title">OVVO</h1>
          <p className="home-subtitle">创意交互体验集合</p>
        </header>

        <main className="home-main">
          <nav className="projects-grid">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={project.path}
                className="project-card"
              >
                <div className="project-icon">{project.icon}</div>
                <h2 className="project-title">{project.title}</h2>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-arrow">→</div>
              </Link>
            ))}
          </nav>
        </main>

        <footer className="home-footer">
          <p>探索更多创意交互体验</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
