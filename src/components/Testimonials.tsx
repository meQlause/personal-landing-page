import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const Testimonials: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO, TechStartup',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: 'John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and problem-solving skills made him a valuable asset to our project. I would highly recommend him for any web development needs.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager, Enterprise Solutions',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: 'Working with John was a pleasure. He has a deep understanding of modern web technologies and consistently delivered high-quality code. His ability to translate complex requirements into elegant solutions made our project a success.',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Marketing Director, Creative Agency',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: 'John redesigned our website with incredible attention to detail and user experience. The result was not only visually stunning but also led to a significant increase in user engagement and conversions. I would work with him again in a heartbeat.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h2>
          <div className="w-16 h-1 bg-primary-500 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            What clients and colleagues say about working with me
          </p>
        </div>
        
        <div className={`transition-all duration-700 transform ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Mobile Testimonials (Card Style) */}
          <div className="md:hidden">
            <div className="max-w-lg mx-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all duration-500 mb-6 ${
                    index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute top-0 left-0 text-primary-100 dark:text-gray-700 w-10 h-10 -mt-2 -ml-2" />
                    <p className="text-gray-600 dark:text-gray-300 pl-6 relative z-10">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center mt-4 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === activeIndex 
                        ? 'bg-primary-500' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop Testimonials (Carousel Style) */}
          <div className="hidden md:block relative">
            <div className="flex items-center justify-between">
              <button
                onClick={prevTestimonial}
                className="absolute left-0 z-10 -ml-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="overflow-hidden w-full">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div 
                      key={testimonial.id}
                      className="w-full flex-shrink-0 px-8"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
                        <Quote className="text-primary-100 dark:text-gray-700 w-16 h-16 mb-6" />
                        
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="mt-auto">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-4 border-white dark:border-gray-700"
                          />
                          <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-0 z-10 -mr-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === activeIndex 
                      ? 'bg-primary-500' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;