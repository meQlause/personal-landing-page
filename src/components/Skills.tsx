import React from "react";

export const Skills: React.FC = () => {
  const skillCategories = [
    {
      name: "Programming Languages",
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "Python", proficiency: 90 },
        { name: "JavaScript", proficiency: 90 },
        { name: "TypeScript", proficiency: 85 },
        { name: "PHP", proficiency: 85 },
        { name: "Solidity", proficiency: 85 },
        { name: "Scrypto", proficiency: 85 },
        { name: "Rust", proficiency: 80 },
        { name: "C#", proficiency: 80 },
      ],
    },
    {
      name: "Technologies",
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "Next.js", proficiency: 85 },
        { name: "Reach", proficiency: 85 },
        { name: "Nest.js", proficiency: 85 },
        { name: "PostgreSQL", proficiency: 85 },
        { name: "MongoDB", proficiency: 85 },
        { name: "Laravel", proficiency: 85 },
        { name: "Supabase", proficiency: 80 },
      ],
    },
    {
      name: "Other",
      color: "from-green-500 to-teal-500",
      skills: [
        { name: "Git", proficiency: 90 },
        { name: "Docker", proficiency: 90 },
        { name: "Azure", proficiency: 80 },
        { name: "CI/CD", proficiency: 80 },
        { name: "Tailwind CSS", proficiency: 80 },
        { name: "Bootstrap CSS", proficiency: 80 },
        { name: "Kubernetes", proficiency: 80 },
      ],
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-800 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              Skills & Technologies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Here are the technologies and tools I use to bring ideas to life.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center mb-8">
                  <div
                    className={`inline-block px-6 py-3 bg-gradient-to-r ${category.color} text-white rounded-full font-bold text-lg mb-4`}
                  >
                    {category.name}
                  </div>
                </div>

                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">
                          {skill.name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${category.color} h-3 rounded-full transition-all duration-1000 ease-out transform origin-left`}
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Skills */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
              Additional Expertise
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Responsive Design",
                "API Development",
                "Database Design",
                "DevOps",
                "Testing",
                "Performance Optimization",
                "SEO",
                "Accessibility",
                "Agile Methodology",
                "Team Leadership",
                "Code Review",
                "Mentoring",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
