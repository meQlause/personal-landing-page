import React from "react";
import { Code, Zap, Heart } from "lucide-react";

export const About: React.FC = () => {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Clean Code",
      description:
        "Writing maintainable, scalable, and efficient code that follows best practices.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance",
      description:
        "Building fast, optimized applications that deliver smooth performance across devices.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion",
      description:
        "Genuinely passionate about creating digital solutions that make a real impact.",
    },
  ];

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              About Me
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              I'm a passionate full-stack developer and a fast learner with
              various web2 and web3 experiences.
            </p>
          </div>

          <div className="flex flex-col mx-16 gap-16">
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  My Journey
                </h3>
                <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    I'm a software engineer driven by a passion for building web
                    applications. My journey began as a teenager, experimenting
                    with HTML and CSS to craft basic websites. These days, I
                    work on a wide range of projects, especially in the Web3
                    space.
                  </p>
                  <p>
                    After completing vocational high school (Teknik Komputer
                    Jaringan), I gained skills in networking (MTCNA) and server
                    administration. Even during my five years working in South
                    Korea as a migrant worker, I continued to pursue my passion
                    by successfully completing various Web3 projects. I'm a fast
                    leaner and have a strong work ethic, which I bring to every
                    challenge I take on.
                  </p>
                  <p>
                    When I'm not coding, I'm usually focused on upskilling by
                    taking online courses to deepen my knowledge and stay ahead
                    in the tech world. I'm also passionate about music and enjoy
                    exploring its creative side. Above all, I love building
                    solutions that solve real-world problems and make a
                    meaningful impact.
                  </p>
                </div>
              </div>
            </div>
            {/* Features Grid */}
            <div className="flex flex-col gap-8">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                What I Could Bring To You
              </h3>
              <div className="flex flex-row justify-between px-20">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 group max-w-64"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
