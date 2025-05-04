import React from 'react';
import { BookOpen, Award, Clock, Coffee } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const About: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const stats = [
    { icon: <BookOpen size={20} />, value: '10+', label: 'Years Experience' },
    { icon: <Award size={20} />, value: '50+', label: 'Projects Completed' },
    { icon: <Clock size={20} />, value: '500+', label: 'Hours of Coding' },
    { icon: <Coffee size={20} />, value: '1000+', label: 'Cups of Coffee' },
  ];

  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-gray-800" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">About Me</h2>
          <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 mb-10"></div>
          {/* <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get to know me and my professional journey
          </p> */}
        </div>

        <div className={`transition-all duration-700 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mx-36 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Hi,  I am Ardial
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                I'm a software engineer driven by a passion for building
                web applications and creating meaningful digital experiences.
                My journey began as a teenager, experimenting with HTML and CSS
                to craft basic websites.
                These days, I work on a wide range of projects,
                especially in the Web3 space.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                After completing vocational high school (Teknik Komputer Jaringan),
                I gained skills in networking (MTCNA) and server administration.
                Even during my five years working in South Korea as a migrant worker,
                I continued to pursue my passion by successfully completing various Web3 projects.
                I'm a fast leaner and have a strong work ethic,
                which I bring to every challenge I take on.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-11 leading-relaxed">
                When I'm not coding, I'm usually focused on upskilling by taking online courses to deepen my knowledge and stay ahead in the tech world.
                I'm also passionate about music and enjoy exploring its creative side.
                Above all,
                I love building solutions that solve real-world problems and make a meaningful impact.
              </p>

              <div className="flex gap-4 justify-center">
                <a
                  href="https://filebin.net/vzzaij30fxksx2fy/Resume.pdf"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Download Resume
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Let's Talk
                </a>
              </div>
              <div className='mb-10'></div>
              <div className=" h-1 bg-primary-500 mx-auto mt-4 mb-10"></div>
            </div>

            {/* <div className="space-y-8"> */}
            {/* <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-full mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div> */}

            {/* <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3">Education</h4>
                <div className="space-y-3 py-7">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2010 - 2014</div>
                    <div className="font-medium text-gray-900 dark:text-white">Bachelor of Science in Computer Science</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">University of Technology</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2015 - 2018</div>
                    <div className="font-medium text-gray-900 dark:text-white">SMK Bakti Ilham</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Teknik Komputer Jaringan</div>
                  </div>
                </div>
              </div> */}

            {/* <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3">Work Experience</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2020 - Present</div>
                    <div className="font-medium text-gray-900 dark:text-white">Senior Full-Stack Developer</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">TechCorp Inc.</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2016 - 2020</div>
                    <div className="font-medium text-gray-900 dark:text-white">Frontend Developer</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">WebSolutions Ltd.</div>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;