import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
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
    {
      id: 'particle-canvas',
      title: 'Particle Canvas',
      description: '交互式粒子画布，鼠标移动产生粒子反应，点击产生爆炸效果',
      path: '/particle-canvas',
      tags: ['React', 'Canvas', 'Physics', 'Interactive'],
      icon: '✨',
    },
    {
      id: 'code-rain',
      title: 'Code Rain',
      description: 'Matrix 风格代码雨效果，可自定义颜色和速度，点击产生波纹',
      path: '/code-rain',
      tags: ['React', 'Canvas', 'Animation', 'Matrix'],
      icon: '🌧️',
    },
    {
      id: 'text-animation',
      title: 'Text Animation',
      description: '文字动画效果集合：打字机、粒子化、霓虹灯三种炫酷效果',
      path: '/text-animation',
      tags: ['React', 'Canvas', 'CSS', 'Typography'],
      icon: '📝',
    },
    // 后续可以在这里添加更多项目
  ];

  return (
    <div className="home">
      <Navbar />
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
      </div>
      
      <div className="home-signature">
        <span>STATICHIT • 探索更多创意交互体验</span>
      </div>
    </div>
  );
}

export default Home;
