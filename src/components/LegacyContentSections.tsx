
import React from 'react';

const LegacyContentSections = () => {
  return (
    <>
      <div className="container py-5" style={{color: '#000'}}>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card mb-4">
              <div className="card-body">
                <h3 style={{color: '#D648D7'}}>Exams Covered </h3>
                <ul className="list-unstyled">
                  <li className="mb-3"><i className="fa fa-check"></i>Unit Test Exam</li>
                  <li className="mb-3"><i className="fa fa-check"></i>First Term Exam</li>
                  <li className="mb-3"><i className="fa fa-check"></i>Prelim/Practice Exam</li>
                  <li className="mb-3"><i className="fa fa-check"></i>Second Term Exam</li>
                  <li className="mb-3"><i className="fa fa-check"></i>Internal Evaluation Exam</li>
                  <li className="mb-3"><i className="fa fa-check"></i>Chapter Test Questions & Answers</li>
                </ul>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 style={{color: '#D648D7'}}>Additional Study Material</h3>
                <ul className="list-unstyled">
                  <li className="mb-3"><i className="fa fa-check"></i>PCMB MCQ Test and Answer Keys</li>
                  <li className="mb-3"><i className="fa fa-check"></i>PCMB IMP Formulae & Smart Notes</li>
                  <li className="mb-3"><i className="fa fa-check"></i>PCMB Chapter Solutions</li>
                  <li className="mb-3"><i className="fa fa-check"></i>MHT-CET Preparation Material</li>
                  <li className="mb-3"><i className="fa fa-check"></i>Scholarship Exam Papers & Answer Keys</li>
                  <li className="mb-3"><i className="fa fa-check"></i>Competitive Exam Papers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="text-center mb-5">
              <h2 style={{fontSize: '2.5rem', color: '#2c3e50', fontWeight: 'bold'}}>Smart Question Paper</h2>
            </div>

            <div className="feature-section">
              <h3>Why Choose Smart Question Papers</h3>
              <ul className="list-unstyled feature-list">
                <li><i className="fas fa-check-circle"></i>Expert-Curated Content</li>
                <li><i className="fas fa-check-circle"></i>Updated with Latest Format</li>
                <li><i className="fas fa-check-circle"></i>Comprehensive Coverage</li>
                <li><i className="fas fa-check-circle"></i>Quality Assured Study Material</li>
              </ul>
            </div>

            <div className="feature-section">
              <h3>Smart Abhyas Features</h3>
              <ul className="list-unstyled feature-list">
                <li><i className="fas fa-star"></i>Interactive Learning Format</li>
                <li><i className="fas fa-star"></i>Detailed Solutions</li>
                <li><i className="fas fa-star"></i>Performance Analytics</li>
                <li><i className="fas fa-star"></i>Practice Exercises</li>
                <li><i className="fas fa-star"></i>Annual Planner</li>
              </ul>
            </div>

            <div className="feature-section">
              <h3>Additional Exam Papers</h3>
              <ul className="list-unstyled feature-list">
                <li><i className="fas fa-file-alt"></i>10th Standard Question Papers</li>
                <li><i className="fas fa-file-alt"></i>MHT-CET Preparation Materials</li>
                <li><i className="fas fa-file-alt"></i>Competitive Exam Question Papers</li>
                <li><i className="fas fa-file-alt"></i>Scholarship Exam Materials</li>
              </ul>
            </div>

            <div className="feature-section">
              <h3>Available Subjects</h3>
              <div className="subject-grid">
                <div className="subject-item">
                  <i className="fas fa-language"></i>Marathi
                </div>
                <div className="subject-item">
                  <i className="fas fa-language"></i>Hindi
                </div>
                <div className="subject-item">
                  <i className="fas fa-language"></i>English
                </div>
                <div className="subject-item">
                  <i className="fas fa-landmark"></i>History
                </div>
                <div className="subject-item">
                  <i className="fas fa-globe-asia"></i>Geography
                </div>
                <div className="subject-item">
                  <i className="fas fa-landmark"></i>Political Science
                </div>
                <div className="subject-item">
                  <i className="fas fa-users"></i>Sociology
                </div>
                <div className="subject-item">
                  <i className="fas fa-chalkboard-teacher"></i>Education
                </div>
                <div className="subject-item">
                  <i className="fas fa-brain"></i>Psychology
                </div>
                <div className="subject-item">
                  <i className="fas fa-chart-line"></i>Economics
                </div>
                <div className="subject-item">
                  <i className="fas fa-handshake"></i>Cooperation
                </div>
                <div className="subject-item">
                  <i className="fas fa-file-signature"></i>Secretarial Procedure
                </div>
                <div className="subject-item">
                  <i className="fas fa-building"></i>Organization Of Commerce and Management
                </div>
                <div className="subject-item">
                  <i className="fas fa-book-open"></i>Book Keeping & Accountancy
                </div>
                <div className="subject-item">
                  <i className="fas fa-atom"></i>Physics
                </div>
                <div className="subject-item">
                  <i className="fas fa-flask"></i>Chemistry
                </div>
                <div className="subject-item">
                  <i className="fas fa-dna"></i>Biology
                </div>
                <div className="subject-item">
                  <i className="fas fa-calculator"></i>Mathematics
                </div>
                <div className="subject-item">
                  <i className="fas fa-desktop"></i>I.T.
                </div>
                <div className="subject-item">
                  <i className="fas fa-heartbeat"></i>Health and Ph. Education-Project
                </div>
                <div className="subject-item">
                  <i className="fas fa-seedling"></i>E.V.S.-Project
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegacyContentSections;
