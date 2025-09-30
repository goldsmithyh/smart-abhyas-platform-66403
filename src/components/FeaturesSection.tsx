const FeaturesSection = () => {
  const examsCovered = [
    "Unit Test Exam",
    "First Term Exam", 
    "Prelim/Practice Exam",
    "Second Term Exam",
    "Internal Evaluation Exam",
    "Chapter Test Questions & Answers"
  ];

  const additionalMaterial = [
    "PCMB MCQ Test and Answer Keys",
    "PCMB IMP Formulae & Smart Notes",
    "PCMB Chapter Solutions", 
    "MHT-CET Preparation Material",
    "Scholarship Exam Papers & Answer Keys",
    "Competitive Exam Papers"
  ];

  const whyChoose = [
    "Expert-Curated Content",
    "Updated with Latest Format",
    "Comprehensive Coverage",
    "Quality Assured Study Material"
  ];

  const smartFeatures = [
    "Interactive Learning Format",
    "Detailed Solutions",
    "Performance Analytics", 
    "Practice Exercises",
    "Annual Planner"
  ];

  const additionalPapers = [
    "10th Standard Question Papers",
    "MHT-CET Preparation Materials",
    "Competitive Exam Question Papers",
    "Scholarship Exam Materials"
  ];

  const subjects = [
    { name: "Marathi", icon: "fas fa-language" },
    { name: "Hindi", icon: "fas fa-language" },
    { name: "English", icon: "fas fa-language" },
    { name: "History", icon: "fas fa-landmark" },
    { name: "Geography", icon: "fas fa-globe-asia" },
    { name: "Political Science", icon: "fas fa-landmark" },
    { name: "Sociology", icon: "fas fa-users" },
    { name: "Education", icon: "fas fa-chalkboard-teacher" },
    { name: "Psychology", icon: "fas fa-brain" },
    { name: "Economics", icon: "fas fa-chart-line" },
    { name: "Cooperation", icon: "fas fa-handshake" },
    { name: "Secretarial Procedure", icon: "fas fa-file-signature" },
    { name: "Organization Of Commerce and Management", icon: "fas fa-building" },
    { name: "Book Keeping & Accountancy", icon: "fas fa-book-open" },
    { name: "Physics", icon: "fas fa-atom" },
    { name: "Chemistry", icon: "fas fa-flask" },
    { name: "Biology", icon: "fas fa-dna" },
    { name: "Mathematics", icon: "fas fa-calculator" },
    { name: "I.T.", icon: "fas fa-desktop" },
    { name: "Health and Ph. Education-Project", icon: "fas fa-heartbeat" },
    { name: "E.V.S.-Project", icon: "fas fa-seedling" }
  ];

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Exams and Additional Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-6">Exams Covered</h3>
            <ul className="space-y-3">
              {examsCovered.map((exam, index) => (
                <li key={index} className="flex items-center">
                  <i className="fas fa-check text-accent mr-3"></i>
                  <span className="text-foreground">{exam}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-6">Additional Study Material</h3>
            <ul className="space-y-3">
              {additionalMaterial.map((material, index) => (
                <li key={index} className="flex items-center">
                  <i className="fas fa-check text-accent mr-3"></i>
                  <span className="text-foreground">{material}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Smart Question Paper Features */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-8">Smart Question Paper</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="feature-section">
            <h3>Why Choose Smart Question Papers</h3>
            <ul className="list-unstyled feature-list space-y-3">
              {whyChoose.map((item, index) => (
                <li key={index}>
                  <i className="fas fa-check-circle"></i>
                  <span className="ml-3">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="feature-section">
            <h3>Smart Abhyas Features</h3>
            <ul className="list-unstyled feature-list space-y-3">
              {smartFeatures.map((item, index) => (
                <li key={index}>
                  <i className="fas fa-star"></i>
                  <span className="ml-3">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="feature-section">
            <h3>Additional Exam Papers</h3>
            <ul className="list-unstyled feature-list space-y-3">
              {additionalPapers.map((item, index) => (
                <li key={index}>
                  <i className="fas fa-file-alt"></i>
                  <span className="ml-3">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Available Subjects */}
        <div className="feature-section">
          <h3>Available Subjects</h3>
          <div className="subject-grid">
            {subjects.map((subject, index) => (
              <div key={index} className="subject-item">
                <i className={`${subject.icon} mr-3`}></i>
                <span>{subject.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;