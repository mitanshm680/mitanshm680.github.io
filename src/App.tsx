import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Github, Linkedin, Mail, Download, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Mitansh Maheshwari</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'projects', 'skills','coursework', 'Certifications', 'experience', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`${
                    activeSection === section
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  } capitalize px-1 py-2 text-sm font-medium transition-colors duration-200`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 md:px-12 lg:px-16 pt-24 pb-16">
          {/* Left Content */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Hi, I'm Mitansh Maheshwari
              <span className="block text-blue-600 mt-2">
                <TypeAnimation
                  sequence={[
                    'Software Developer',
                    2000,
                    '',
                    100,
                    'Backend Engineer',
                    2000,
                    '',
                    100,
                    'Data Engineer',
                    2000,
                    '',
                    100,
                    'Data Scientist',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              A Computer Science student passionate about AI, Data Science & Engineering, Web Development, and creating impactful solutions.
            </p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                View Projects <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              <a href="/mitansh_resume_s.pdf" download target="_blank" rel="noopener noreferrer">
                <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center">
                  Download CV <Download className="ml-2 h-4 w-4" />
                </button>
              </a>
              <a
                href="https://www.linkedin.com/in/mitansh-maheshwari-5143a5265/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center">
                  Visit LinkedIn <Linkedin className="ml-2 h-4 w-4" />
                </button>
              </a>
            </div>
          </div>
          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/Designer.png"
              alt="Profile"
              className="rounded-full w-60 sm:w-72 md:w-80 h-60 sm:h-72 md:h-80 object-cover shadow-xl"
            />
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 leading-relaxed">
                I'm a Junior-year Computer Science student at Arizona State University, expected to graduate in May, 2026. 
                My journey in technology started with a curiosity about how things work, which evolved into 
                a passion for creating innovative solutions through code.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                I specialize in data engineering, data science and backend development, and have a growing interest in artificial intelligence 
                and machine learning. When I'm not coding, you can find me reading about new technologies, browsing Wikipedia for random facts,
                or exploring the outdoors.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Quick Facts</h3>
              <ul className="space-y-2">
                <li className="flex flex-wrap items-center text-gray-600 gap-x-2">
                  <span className="min-w-32 md:w-32 font-medium">Location:</span>
                  <span className="flex-1">Phoenix, AZ</span>
                </li>
                <li className="flex flex-wrap items-center text-gray-600 gap-x-2">
                  <span className="min-w-32 md:w-32 font-medium">Education:</span>
                  <span className="flex-1">BS Computer Science with minor in Data Science</span>
                </li>
                <li className="flex flex-wrap items-center text-gray-600 gap-x-2">
                  <span className="min-w-32 md:w-32 font-medium">University:</span>
                  <span className="flex-1">Arizona State University</span>
                </li>
                <li className="flex flex-wrap items-center text-gray-600 gap-x-2">
                  <span className="min-w-32 md:w-32 font-medium">Graduation:</span>
                  <span className="flex-1">May, 2026</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="relative">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={2}
              slidesToScroll={2}
              autoplay={false}
              responsive={[
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]}
              className="py-8"
              nextArrow={
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  style={{ right: -20 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              }
              prevArrow={
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  style={{ left: -20 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
              }
              dotsClass="slick-dots custom-dots"
              appendDots={dots => (
                <div>
                  <ul className="flex justify-center gap-2 mt-4"> {dots} </ul>
                </div>
              )}
              customPaging={i => (
                <div className="w-3 h-3 bg-blue-500 rounded-full opacity-50 hover:opacity-75 transition-opacity duration-200"></div>
              )}
            >
              {[
                {
                  id: 1,
                  title: "Sentiment Analysis of Amazon Product Reviews",
                  description:
                    "Analyzed Amazon reviews using NLP techniques to determine customer sentiment trends.",
                  image:
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                  tech: ["Python", "NLTK", "Scikit-learn", "Matplotlib", "Seaborn"],
                  codeLink: "https://github.com/mitanshm680/Sentiment-Analysis---Amazon-Product-Reviews",
                },
                {
                  id: 2,
                  title: "Inventory Management System",
                  description:
                    "Created a Python-based inventory management system that tracks product quantities, manages orders, and generates reports. Features include user authentication, real-time inventory updates, and data visualization.",
                  image:
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                  tech: ["Python", "SQL", "Shiny", "Data Visualization"],
                  codeLink: "https://github.com/mitanshm680/Inventory-Management-System",
                },             
                {
                  id: 3,
                  title: "Procedural World Generation",
                  description:
                    "A C++ program using the dirtball dropping technique for procedural world generation. Showcases skills in C++, STL, data structures, and randomization to create dynamic and realistic worlds.",
                  image:
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                  tech: ["C++", "Data Structures", "Randomization"],
                  codeLink: "https://github.com/mitanshm680/2D-terrainmaps",
                },
                {
                  id: 4,
                  title: "Spotify Data Analysis and Music Recommendation System",
                  description:
                    "Analyzed Spotify listening history to identify popular music genres, trends, and user preferences. And Built a music recommendation system using the Analysed data.",
                  image:
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
                  tech: ["R", "Spotify API", "Shiny", "dplyr", "ggplot2"],
                  codeLink: "https://github.com/mitanshm680/Spotify-Data-Analysis-and-music-recommendation-system",
                },
              ].map((project) => (
                <div key={project.id} className="px-2">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <a
                          href={project.codeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          <Github className="h-4 w-4 mr-1" /> Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Programming Languages - Percentages modified */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Programming Languages</h3>
              <div className="space-y-3">
                {['C', 'Python', 'Java', 'C++', 'Javascript', 'R'].map((skill, index) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: ['80%', '90%', '85%', '80%', '75%', '90%'][index] }}></div>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 w-24">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frameworks & Libraries - Percentages modified */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Frameworks & Libraries</h3>
              <div className="space-y-3">
                {['React', 'Node.js', 'Pandas', 'Numpy', 'Shiny & Tkinter'].map((skill, index) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: ['80%', '75%', '90%', '85%', '80%'][index] }}></div>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 w-24">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Technologies - Percentages modified */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Tools & Technologies</h3>
              <div className="space-y-3">
                {['Git', 'Docker', 'IDEs', 'Linux', 'Apache Spark'].map((skill, index) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: ['90%', '70%', '85%', '80%', '70%'][index] }}></div>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 w-24">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Databases - Percentages modified */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Databases</h3>
              <div className="space-y-3">
                {['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Access', 'Hadoop'].map((skill, index) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: ['90%', '70%', '75%', '80%', '90%', '65%'][index] }}></div>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 w-24">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Software Development - Percentages modified */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Software Development</h3>
              <div className="space-y-3">
                {['Object-Oriented Programming', 'Software Testing & Debugging', 'Version Control', 'System Design', 'Data Structures & Algorithms'].map((skill, index) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: ['85%', '85%', '95%', '75%', '80%'][index] }}></div>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 w-40">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Science & Analytics - Percentages modified */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Data Science & Analytics</h3>
              <div className="space-y-3">
                {['Scikit-learn', 'TensorFlow', 'NLTK', 'Seaborn', 'Tableau', 'Alteryx'].map((skill, index) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: ['85%', '75%', '85%', '80%', '85%', '75%'][index] }}></div>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 w-24">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coursework Section */}
      <section id="coursework" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Relevant Coursework</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Object-Oriented Programming",
              "Digital Design Fundamentals",
              "Computer Organization & Assembly Language",
              "Discrete Mathematics",
              "Data Structures & Algorithms",
              "Theoeitical Computer Science",
              "Information Assurance & Security",
              "Software Engineering",
              "Data in R & Python",
              "Applied Linear Algebra",
              "Probability & Statistics for Engineering",
              "Operating Systems",
              "Principles of Programming Languages",
              "Mathematical Tools for Data Science",
              "Statistical Modeling & Inference for Data Science",
              "Industry Tools for Data Science",
              "Human Computer Interaction",
              "Machine Learning for Data Science",
            ].map((course) => (
              <div key={course} className="bg-blue-50 p-4 rounded-lg shadow-md text-center border-l-4 border-blue-500">
                <h3 className="font-semibold text-lg">{course}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section id="Certifications" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications</h2>
          <div className="relative">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={2}
              slidesToScroll={2}
              autoplay={false}
              responsive={[
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]}
              className="py-8"
              nextArrow={
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  style={{ right: -20 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              }
              prevArrow={
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                  style={{ left: -20 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
              }
              dotsClass="slick-dots custom-dots"
              appendDots={dots => (
                <div>
                  <ul className="flex justify-center gap-2 mt-4"> {dots} </ul>
                </div>
              )}
              customPaging={i => (
                <div className="w-3 h-3 bg-blue-500 rounded-full opacity-50 hover:opacity-75 transition-opacity duration-200"></div>
              )}
            >
              {[
                {
                  id: 1,
                  title: "IBM Data Science Professional Certificate",
                  description:
                    "Completed a series of courses covering data science fundamentals, including Python, SQL, and machine learning.",
                  image: "/IBM_Data_Science_page-0001.jpg",
                  tech: ["Python", "SQL", "Tableau", "Data Analysis", "R", "Machine Learning"],
                  certificateLink: "https://www.coursera.org/account/accomplishments/specialization/NUT3R5BS2ZQC",
                },
                {
                  id: 2,
                  title: "Alteryx Designer Core Certification",
                  description:
                    "Achieved certification in Alteryx Designer Core, demonstrating proficiency in data preparation, blending, and analysis using Alteryx.",
                  image: "/Alteryx_Designer_Core_Certification_Badge20250428-26-wrj87d_page-0001.jpg",
                  tech: ["Alteryx", "Data Cleaning", "Building Workflows", "Automation", "ETL"],
                  certificateLink: "https://www.credly.com/badges/e7753713-1644-4456-889e-69c443c338e9/linked_in_profile",
                },
              ].map((project) => (
                <div key={project.id} className="px-2">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
                    <div className="w-full">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <a
                          href={project.certificateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          🎓 View Certificate
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Work Experience</h2>
          <div className="space-y-8">
            
            {/* Engineering Peer Mentor */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Engineering Peer Mentor</h3>
                  <p className="text-blue-600">Arizona State University</p>
                </div>
                <p className="text-gray-600 text-sm">August 2023 - Present</p>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Guided first-year engineering students by providing academic and career support.</li>
                <li>Organized mentoring sessions to help students navigate coursework and university resources.</li>
                <li>Organized engineering-focused events to foster knowledge sharing and networking within the student community</li>
              </ul>
            </div>

            {/* ASU Sustainability Eco-Representative */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">ASU Sustainability Eco-Representative</h3>
                  <p className="text-blue-600">Arizona State University</p>
                </div>
                <p className="text-gray-600 text-sm">August 2024 - Present</p>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Promoted sustainable practices and environmental awareness across campus.</li>
                <li>Led initiatives such as waste reduction programs and energy conservation campaigns.</li>
                <li>Collaborated with students and faculty to organize sustainability events and workshops.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Connect With Me</h2>
          <p className="text-gray-600 mb-6">
            Feel free to reach out through any of the platforms below!
          </p>
          <div className="flex justify-center space-x-8">
            {/* Email - Copy to Clipboard */}
            <button
              onClick={() => {
                navigator.clipboard.writeText("mitanshm680@gmail.com");
                alert("Email copied to clipboard!");
              }}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <Mail className="h-8 w-8" />
            </button>

            {/* GitHub - Opens in new tab */}
            <a
              href="https://github.com/mitanshm680"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <Github className="h-8 w-8" />
            </a>

            {/* LinkedIn - Opens in new tab */}
            <a
              href="https://www.linkedin.com/in/mitansh-maheshwari-5143a5265/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              <Linkedin className="h-8 w-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Mitansh Maheshwari</h3>
              <p className="text-gray-400">
                Computer Science student passionate about AI, Data Science, Web Development, and building impactful solutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact'].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(link.toLowerCase())}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect</h3>
              <div className="flex space-x-6">
                <a href="https://github.com/mitanshm680" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Github className="h-8 w-8" />
                </a>
                <a href="https://www.linkedin.com/in/mitansh-maheshwari-5143a5265/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <Linkedin className="h-8 w-8" />
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("mitanshm680@gmail.com");
                    alert("Email copied to clipboard!");
                  }} 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Mail className="h-8 w-8" />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mitansh Maheshwari. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;