import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        } else if (value.length < 2) {
          return "Name must be at least 2 characters long";
        }
        return "";

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          return "Email is required";
        } else if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "subject":
        if (!value.trim()) {
          return "Subject is required";
        } else if (value.length < 10) {
          return "Subject must be at least 5 characters long";
        }
        return "";

      case "message":
        if (!value.trim()) {
          return "Message is required";
        } else if (value.length < 50) {
          return "Message must be at least 10 words long";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const errors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      subject: validateField("subject", formData.subject),
      message: validateField("message", formData.message),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(1);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      emailjs.init({
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        blockHeadless: true,
        limitRate: {
          throttle: 100000,
        },
      });

      const templateParams = {
        name: formData.name,
        subject: formData.subject,
        message: formData.message,
        email: formData.email,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_1,
        templateParams
      );

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_2,
        templateParams
      );

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Email sending failed:", error);
      setError("Failed to send message. Please try again later.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "me@ardial.tech",
      link: "mailto:me@ardial.tech",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      value: "+62 852 919 383 16",
      link: "tel:+6285291938316",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      value: "Jawa Tengah, Semarang",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              I'm always open to discussing new opportunities, creative
              projects, or just having a chat about technology and design.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Let's Connect
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg">
                  Whether you have a project in mind, want to collaborate, or
                  just want to say hello, I'd love to hear from you. Let's
                  create something amazing together!
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="flex items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group transform hover:scale-105"
                  >
                    <div
                      className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white mr-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Availability Status */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="font-semibold text-green-800 dark:text-green-400">
                    Available for new projects
                  </span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Currently accepting new freelance projects and full-time
                  opportunities.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-8">
                <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Send Message
                </h3>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="text-green-800 dark:text-green-200">
                    Message sent successfully!
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                      placeholder="Your name"
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.message}
                    </p>
                  )}
                  <div className="flex flex-col">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                  {validationErrors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white"
                    placeholder="What's this about?"
                  />
                  {validationErrors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.subject}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-800 dark:text-white"
                    placeholder="Tell me about your project..."
                  />
                  {validationErrors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
