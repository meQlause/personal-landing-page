import React from 'react';
import { useInView } from 'react-intersection-observer';

const Skills: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const categories = [
    {
      name: 'Programming Languages',
      skills: [
        { name: 'Python', proficiency: 90 },
        { name: 'JavaScript', proficiency: 90 },
        { name: 'TypeScript', proficiency: 85 },
        { name: 'PHP', proficiency: 85 },
        { name: 'Solidity', proficiency: 85 },
        { name: 'Scrypto', proficiency: 85 },
        { name: 'Rust', proficiency: 80 },
        { name: 'C#', proficiency: 80 },
      ],
    },
    {
      name: 'Technologies',
      skills: [
        { name: 'Next.js', proficiency: 85 },
        { name: 'Reach', proficiency: 85 },
        { name: 'Nest.js', proficiency: 85 },
        { name: 'PostgreSQL', proficiency: 85 },
        { name: 'MongoDB', proficiency: 85 },
        { name: 'Laravel', proficiency: 85 },
        { name: 'Supabase', proficiency: 80 },
      ],
    },
    {
      name: 'Other',
      skills: [
        { name: 'Git', proficiency: 90 },
        { name: 'Docker', proficiency: 90 },
        { name: 'Azure', proficiency: 80 },
        { name: 'CI/CD', proficiency: 80 },
        { name: 'Tailwind CSS', proficiency: 80 },
        { name: 'Bootstrap CSS', proficiency: 80 },
        { name: 'Kubernetes', proficiency: 80 },
      ],
    },
  ];

  return (
    <section id="skills" className="py-24 bg-white dark:bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Skills</h2>
          <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and expertise
          </p>
        </div>

        <div className={`transition-all duration-700 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {category.name}
                </h3>

                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => {
                    // Create a delay effect for the skill bars
                    const delay = `${(categoryIndex * 6 + skillIndex) * 100}ms`;

                    return (
                      <div key={skillIndex}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: inView ? `${skill.proficiency}%` : '0%',
                              transitionDelay: delay
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {/* {['JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML5', 'CSS3', 'Git', 'SQL'].map((tech, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-lg font-medium text-gray-900 dark:text-white">{tech}</div>
              </div>
            ))} */}
          </div>
          <div className='mb-10'></div>
          <div className=" h-1 bg-primary-500 mx-auto mt-4 mb-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Skills;