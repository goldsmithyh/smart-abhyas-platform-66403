
import React, { useState } from 'react';

const LegacyMainForm = () => {
  const [paperType, setPaperType] = useState('Question');
  const [selectedClass, setSelectedClass] = useState('Select Class..');
  const [selectedExam, setSelectedExam] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <section className="w3l-form-main py-5" id="book">
      <div className="container py-lg-5 py-md-4 py-2">
        <div className="row">
          <div className="col-lg-6 g-0">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="radio-toolbar">
                        <input 
                          value="Question" 
                          name="radioType" 
                          type="radio" 
                          id="type_question" 
                          checked={paperType === 'Question'}
                          onChange={(e) => setPaperType(e.target.value)}
                        />
                        <label htmlFor="type_question">प्रश्नपत्रिका</label>
                        <input 
                          value="Answer" 
                          name="radioType" 
                          type="radio" 
                          id="type_answer" 
                          checked={paperType === 'Answer'}
                          onChange={(e) => setPaperType(e.target.value)}
                        />
                        <label htmlFor="type_answer">उत्तरपत्रिका</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <label htmlFor="class_select" className="form-label">इयत्ता</label>
                      <select 
                        name="class" 
                        id="class_select" 
                        className="form-control"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="Select Class..">इयत्ता निवडा</option>
                        <option value="Class X">दहावी</option>
                        <option value="Class XI">अकरावी</option>
                        <option value="Class XII">बारावी</option>
                      </select>
                    </div>
                    <div className="col-lg-6">
                      <label htmlFor="exam_select" className="form-label">परीक्षा निवडा</label>
                      <select 
                        name="exam" 
                        id="exam_select" 
                        className="form-control"
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                      >
                        <option value="">परीक्षा निवडा</option>
                      </select>
                    </div>
                    <div className="col-lg-12">
                      <label htmlFor="school_name" className="form-label">विद्यालय / कॉलेज नाव</label>
                      <input 
                        name="school_name" 
                        type="text" 
                        id="school_name" 
                        className="form-control"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-12 pt-4">
                      <h5>वैयक्तिक माहिती</h5>
                    </div>
                    <div className="col-lg-12 pt-2">
                      <label htmlFor="full_name" className="form-label">नाव</label>
                      <input 
                        name="full_name" 
                        type="text" 
                        id="full_name" 
                        className="form-control"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 pt-2">
                      <label htmlFor="email" className="form-label">ई-मेल</label>
                      <input 
                        name="email" 
                        type="email" 
                        id="email" 
                        required 
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 pt-2">
                      <label htmlFor="mobile" className="form-label">मोबाईल</label>
                      <input 
                        name="mobile" 
                        type="text" 
                        id="mobile" 
                        className="form-control"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-12 pt-5 text-center">
                      <div className="d-inline-block">
                        <input 
                          type="submit" 
                          value="    Download    " 
                          className="btn btn-primary" 
                          style={{backgroundColor: '#D648D7', fontWeight: 'bold', color: '#fff'}}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100">
              <div className="card-body">
                <h3 style={{color: '#D648D7', marginBottom: '20px'}}>HighLights Of Smart Abhyas</h3>
                <ul style={{listStyle: 'none', padding: 0}}>
                  <li style={{marginBottom: '15px'}}>
                    <span style={{color: '#27ae60', marginRight: '10px'}}>
                      <i className="fa fa-arrow-right"></i>
                    </span>
                    Maharashtra State Board Syllabus
                  </li>
                  <li style={{marginBottom: '15px'}}>
                    <span style={{color: '#27ae60', marginRight: '10px'}}>
                      <i className="fa fa-arrow-right"></i>
                    </span>
                    Question Papers of All Exams Available
                  </li>
                  <li style={{marginBottom: '15px'}}>
                    <span style={{color: '#27ae60', marginRight: '10px'}}>
                      <i className="fa fa-arrow-right"></i>
                    </span>
                    Que. Papers With School/College/Institute Name
                  </li>
                  <li style={{marginBottom: '15px'}}>
                    <span style={{color: '#27ae60', marginRight: '10px'}}>
                      <i className="fa fa-arrow-right"></i>
                    </span>
                    Fully Solved Answers
                  </li>
                  <li style={{marginBottom: '15px'}}>
                    <span style={{color: '#27ae60', marginRight: '10px'}}>
                      <i className="fa fa-arrow-right"></i>
                    </span>
                    High Quality PDF Format
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacyMainForm;
