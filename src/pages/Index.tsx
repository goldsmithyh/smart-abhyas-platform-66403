
import React, { useEffect } from 'react';
import MainForm from '@/components/MainForm';
import LegacyContentSections from '@/components/LegacyContentSections';
import LegacyFooter from '@/components/LegacyFooter';
import LegacyWhatsAppFloat from '@/components/LegacyWhatsAppFloat';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  useEffect(() => {
    // Animation script for cards and sections
    const animateElements = () => {
      // Animate cards
      const cards = document.querySelectorAll('.card, .feature-section');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animated');
          
          // Animate list items within cards
          const listItems = card.querySelectorAll('.feature-list li');
          listItems.forEach((item, itemIndex) => {
            setTimeout(() => {
              item.classList.add('animated');
            }, 100 * itemIndex);
          });
        }, 100 * index);
      });
      
      // Animate subject items
      const subjectItems = document.querySelectorAll('.subject-item');
      subjectItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animated');
        }, 50 * index);
      });
    };

    // Run animations when component mounts
    animateElements();
  }, []);

  return (
    <div className="bg-light min-h-screen">
      {/* Main Content */}
      <main className="container py-5">
        {/* Title Section - Removed */}

        {/* Language Translator */}
        <div className="text-center mb-4">
          <div id="google_translate_element"></div>
        </div>
        
        <MainForm />
        
        {/* Exams Covered Section */}
        <section className="mb-5">
          <div className="card">
            <div className="card-body">
              <h3 className="text-primary mb-4">Exams Covered</h3>
              <div className="row">
                <div className="col-md-6">
                  <ul className="feature-list">
                    <li><i className="fas fa-check"></i> Unit Test Exam</li>
                    <li><i className="fas fa-check"></i> First Term Exam</li>
                    <li><i className="fas fa-check"></i> Prelim/Practice Exam</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="feature-list">
                    <li><i className="fas fa-check"></i> Second Term Exam</li>
                    <li><i className="fas fa-check"></i> Internal Evaluation Exam</li>
                    <li><i className="fas fa-check"></i> Chapter Test Questions & Answers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Additional Study Material Section */}
        <section className="mb-5">
          <div className="card">
            <div className="card-body">
              <h3 className="text-primary mb-4">Additional Study Material</h3>
              <div className="row">
                <div className="col-md-6">
                  <ul className="feature-list">
                    <li><i className="fas fa-check"></i> PCMB MCQ Test and Answer Keys</li>
                    <li><i className="fas fa-check"></i> PCMB IMP Formulae & Smart Notes</li>
                    <li><i className="fas fa-check"></i> PCMB Chapter Solutions</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="feature-list">
                    <li><i className="fas fa-check"></i> MHT-CET Preparation Material</li>
                    <li><i className="fas fa-check"></i> Scholarship Exam Papers & Answer Keys</li>
                    <li><i className="fas fa-check"></i> Competitive Exam Papers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Sections */}
        <div className="text-center mb-5">
          <h2 className="text-dark">Smart Question Paper</h2>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="feature-section" id="why-choose">
              <h3>Why Choose Smart Question Papers</h3>
              <ul className="feature-list">
                <li><i className="fas fa-check-circle"></i> Expert-Curated Content</li>
                <li><i className="fas fa-check-circle"></i> Updated with Latest Format</li>
                <li><i className="fas fa-check-circle"></i> Comprehensive Coverage</li>
                <li><i className="fas fa-check-circle"></i> Quality Assured Study Material</li>
              </ul>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="feature-section">
              <h3>Smart Abhyas Features</h3>
              <ul className="feature-list">
                <li><i className="fas fa-star"></i> Interactive Learning Format</li>
                <li><i className="fas fa-star"></i> Detailed Solutions</li>
                <li><i className="fas fa-star"></i> Performance Analytics</li>
                <li><i className="fas fa-star"></i> Practice Exercises</li>
                <li><i className="fas fa-star"></i> Annual Planner</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Additional Exam Papers */}
        <div className="feature-section mb-5">
          <h3>Additional Exam Papers</h3>
          <ul className="feature-list">
            <li><i className="fas fa-file-alt"></i> 10th Standard Question Papers</li>
            <li><i className="fas fa-file-alt"></i> MHT-CET Preparation Materials</li>
            <li><i className="fas fa-file-alt"></i> Competitive Exam Question Papers</li>
            <li><i className="fas fa-file-alt"></i> Scholarship Exam Materials</li>
          </ul>
        </div>
        
        {/* Available Subjects */}
        <div className="feature-section">
          <h3>Available Subjects</h3>
          <div className="subject-grid">
            <div className="subject-item">
              <i className="fas fa-language"></i> Marathi
            </div>
            <div className="subject-item">
              <i className="fas fa-language"></i> Hindi
            </div>
            <div className="subject-item">
              <i className="fas fa-language"></i> English
            </div>
            <div className="subject-item">
              <i className="fas fa-landmark"></i> History
            </div>
            <div className="subject-item">
              <i className="fas fa-globe-asia"></i> Geography
            </div>
            <div className="subject-item">
              <i className="fas fa-landmark"></i> Political Science
            </div>
            <div className="subject-item">
              <i className="fas fa-users"></i> Sociology
            </div>
            <div className="subject-item">
              <i className="fas fa-chalkboard-teacher"></i> Education
            </div>
            <div className="subject-item">
              <i className="fas fa-brain"></i> Psychology
            </div>
            <div className="subject-item">
              <i className="fas fa-chart-line"></i> Economics
            </div>
            <div className="subject-item">
              <i className="fas fa-handshake"></i> Cooperation
            </div>
            <div className="subject-item">
              <i className="fas fa-file-signature"></i> Secretarial Procedure
            </div>
            <div className="subject-item">
              <i className="fas fa-building"></i> Organization Of Commerce and Management
            </div>
            <div className="subject-item">
              <i className="fas fa-book-open"></i> Book Keeping & Accountancy
            </div>
            <div className="subject-item">
              <i className="fas fa-atom"></i> Physics
            </div>
            <div className="subject-item">
              <i className="fas fa-flask"></i> Chemistry
            </div>
            <div className="subject-item">
              <i className="fas fa-dna"></i> Biology
            </div>
            <div className="subject-item">
              <i className="fas fa-calculator"></i> Mathematics
            </div>
            <div className="subject-item">
              <i className="fas fa-desktop"></i> I.T.
            </div>
            <div className="subject-item">
              <i className="fas fa-heartbeat"></i> Health and Ph. Education-Project
            </div>
            <div className="subject-item">
              <i className="fas fa-seedling"></i> E.V.S.-Project
            </div>
          </div>
        </div>
      </main>

      <LegacyFooter />
      <LegacyWhatsAppFloat />
      <ScrollToTop />
    </div>
  );
};

export default Index;
