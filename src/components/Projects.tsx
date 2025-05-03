import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Github, Folder } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Projects: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with product management, cart functionality, and payment processing.',
      link: '#',
      github: '#',
      category: 'fullstack',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      color: 'from-blue-500 to-purple-500',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A Kanban-style task management application with real-time updates and team collaboration features.',
      link: '#',
      github: '#',
      category: 'frontend',
      tags: ['React', 'TypeScript', 'Firebase'],
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 3,
      title: 'Finance Dashboard',
      description: 'An interactive dashboard for tracking financial data with charts, graphs, and data visualization.',
      link: '#',
      github: '#',
      category: 'frontend',
      tags: ['React', 'D3.js', 'Tailwind CSS'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 4,
      title: 'Content Management System',
      description: 'A modern CMS with customizable content types, user roles, and a responsive admin interface.',
      link: '#',
      github: '#',
      category: 'backend',
      tags: ['Node.js', 'Express', 'PostgreSQL'],
      color: 'from-yellow-500 to-red-500',
    },
    {
      id: 5,
      title: 'Real-time Chat Application',
      description: 'A messaging platform with real-time communication, read receipts, and media sharing.',
      link: '#',
      github: '#',
      category: 'fullstack',
      tags: ['React', 'Socket.io', 'Node.js'],
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 6,
      title: 'API Gateway Service',
      description: 'A microservice for handling API requests with authentication, rate limiting, and caching.',
      link: '#',
      github: '#',
      category: 'backend',
      tags: ['Node.js', 'Express', 'Redis'],
      color: 'from-red-500 to-orange-500',
    },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-800" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h2>
          <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A selection of my recent work and personal projects
          </p>
        </div>
        
        <div 
          className={`transition-all duration-700 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div
            ref={containerRef}
            className="overflow-x-auto hide-scrollbar"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="inline-flex gap-6 p-4">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="w-[400px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`h-3 bg-gradient-to-r ${project.color}`} />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <a 
                        href={project.link}
                        className="text-primary-600 dark:text-primary-400 font-medium flex items-center hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                      >
                        View project <ArrowUpRight size={16} className="ml-1" />
                      </a>
                      
                      <div className="flex space-x-3">
                        <a 
                          href={project.github}
                          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                          <Github size={20} />
                          <span className="sr-only">GitHub repository</span>
                        </a>
                        <a 
                          href="#"
                          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                          <Folder size={20} />
                          <span className="sr-only">Project details</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              View More on GitHub <Github size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;