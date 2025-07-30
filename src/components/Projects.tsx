import React from "react";
import { ExternalLink, Github, ArrowRight, Star } from "lucide-react";

export const Projects: React.FC = () => {
  const projects = [
    {
      title: "Qswap",
      description:
        "A web3 application for token swaps, Smart Order Routing(SOR), and liquidity pool creation on the Radix and Ethereum blockchain.",
      image: "https://i.ibb.co.com/23fCC3Y5/Qswap.png",
      tags: ["react", "solidity", "typescript", "ethers.js", "motionframe"],
      github: "https://github.com/meQlause/Qswap",
      demo: "https://qswap.ardial.tech/",
      featured: false,
      rating: 5,
    },
    {
      title: "Arcane Labyrinth",
      description:
        " Arcane Labyrinth is an immersive Play-to-Earn (P2E) game project built on the Radix blockchain. Dive into a mysterious world where players can explore, battle, and earn rewards using a collection of 4,567 uniquely crafted NFT characters, each belonging to one of five distinct character classes. With a focus on strategy, rarity, and progression, Arcane Labyrinth combines engaging gameplay with real digital asset ownership, offering a next-gen Web3 gaming experience.",
      image:
        "https://pbs.twimg.com/profile_banners/1637834929156546560/1679474543/1080x360",
      tags: [
        "Next.js",
        "nest.js",
        "Radix Network",
        "PostgreSQl",
        "Tailwind CSS",
      ],
      featured: true,
      rating: 5,
    },
    {
      title: "Noteboard",
      description:
        "Noteboard is a modern web application built with Next.js and React. It provides a platform for managing notes and tasks in an organized manner.",
      image: "https://i.ibb.co.com/8Ds2W0Nx/note.png",
      tags: [
        "Next.js",
        "NeonDB",
        "Drizzle ORM",
        "Tailwind CSS",
        "Zod",
        "Shadcn UI",
      ],
      featured: true,
      rating: 4,
    },
  ];

  const featuredProjects = projects;

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A showcase of my recent work spanning web applications, mobile
              apps, and enterprise solutions.
            </p>
          </div>

          {/* Featured Projects */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
              ⭐ Featured Work
            </h3>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 group"
                >
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {project.github &&
                        <a
                          href={project.github}
                          className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
                        >
                          <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </a>
                      }
                      {project.demo &&
                        <a
                          href={project.demo}
                          className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </a>
                      }
                    </div>
                    <div className="absolute bottom-4 left-4 flex">
                      {[...Array(project.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group cursor-pointer">
                      <span className="font-semibold">View Project</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
