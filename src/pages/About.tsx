
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            About Smart Creations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering students across Maharashtra with quality question papers and study materials
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Smart Creations is dedicated to providing high-quality educational resources to students preparing for Maharashtra State Board examinations. We understand the importance of having access to well-structured question papers and comprehensive study materials.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform offers a vast collection of question papers covering all major subjects across Class X, XI, and XII, helping students prepare effectively for their examinations.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-primary mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-3"></i>
                  <span className="text-foreground">Maharashtra State Board Syllabus Aligned</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-3"></i>
                  <span className="text-foreground">Comprehensive Question Bank</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-3"></i>
                  <span className="text-foreground">Expert Curated Content</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-3"></i>
                  <span className="text-foreground">Regular Updates</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle text-green-500 mr-3"></i>
                  <span className="text-foreground">Multiple Language Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-alt text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Quality Papers</h3>
              <p className="text-muted-foreground">
                High-quality question and answer papers prepared by experienced educators
              </p>
            </div>
            <div className="text-center bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-download text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Easy Download</h3>
              <p className="text-muted-foreground">
                Simple and fast download process with customized college headers
              </p>
            </div>
            <div className="text-center bg-card p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-language text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Multi-Language</h3>
              <p className="text-muted-foreground">
                Support for Hindi, Marathi, and English languages
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
