import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { downloadActualPDF } from "@/utils/pdfUtils";
import { initiatePayment } from "@/utils/razorpay";

interface DatabasePaper {
  id: string;
  title: string;
  paper_type: string;
  class_level: string;
  exam_type: string;
  subject: string;
  file_url: string;
  file_name: string;
  is_active: boolean;
  created_at: string;
  standard: string;
  display_order: number;
}

interface PDFPaper {
  id: string;
  title: string;
  paper_type: 'question' | 'answer';
  standard: '10th' | '11th' | '12th';
  exam_type: 'unit1' | 'term1' | 'unit2' | 'prelim1' | 'prelim2' | 'prelim3' | 'term2' | 'internal' | 'chapter';
  subject: string;
  file_url: string;
  file_name: string;
  pricing?: {
    price: number;
    is_free: boolean;
  };
}

interface PaperWithPricing {
  id: string;
  subject: string;
  paper_pricing: Array<{
    price: number;
    is_free: boolean;
  }>;
}

const MainForm = () => {
  const [paperType, setPaperType] = useState("question");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string[]>([]);
  const [standards, setStandards] = useState<Array<{id: string, code: string, display_order: number, is_active: boolean, created_at: string, updated_at: string}>>([]);
  const [examTypes, setExamTypes] = useState<Array<{id: string, name: string, standard_id: string | null, display_order: number, is_active: boolean, created_at: string, updated_at: string}>>([]);
  const [paperPricing, setPaperPricing] = useState<{[key: string]: {price: number, is_free: boolean}}>({});
  const [formData, setFormData] = useState({
    schoolName: "",
    fullName: "",
    email: "",
    mobile: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Fetch catalog data on component mount
  useEffect(() => {
    const fetchCatalogData = async () => {
      const { data: standardsData, error: standardsError } = await supabase
        .from('standards')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (standardsError) {
        console.error('Error loading standards:', standardsError);
      } else if (standardsData) {
        setStandards(standardsData);
      }
    };
    
    fetchCatalogData();
  }, []);

  // Load exam types based on selected class
  useEffect(() => {
    const loadExamTypes = async () => {
      if (!selectedClass || selectedClass === 'Select Class..') {
        setExamTypes([]);
        return;
      }

      // First get the standard ID for the selected class
      const { data: standardData, error: standardError } = await supabase
        .from('standards')
        .select('id')
        .eq('code', selectedClass)
        .single();

      if (standardError || !standardData) {
        console.error('Error loading standard:', standardError);
        setExamTypes([]);
        return;
      }

      // Then get exam types for this standard
      const { data, error } = await supabase
        .from('exam_types')
        .select('*')
        .eq('standard_id', standardData.id)
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error loading exam types:', error);
        toast({
          title: "Error",
          description: "Error loading exam types",
          variant: "destructive"
        });
        return;
      }

      setExamTypes(data || []);
    };

    loadExamTypes();
  }, [selectedClass]);

  // Load subjects that have actual papers uploaded for the selected combination
  useEffect(() => {
    const loadAvailableSubjects = async () => {
      if (!selectedClass || !selectedExam || !paperType) {
        setAvailableSubjects([]);
        setPaperPricing({});
        return;
      }

      console.log('Checking paper availability for:', { selectedClass, selectedExam, paperType });

      // Get papers for this specific combination - now using the exam ID directly
      const { data, error } = await supabase
        .from('papers')
        .select(`
          subject,
          id,
          paper_pricing(price, is_free)
        `)
        .eq('standard', selectedClass)
        .eq('exam_type', selectedExam) // Use the exam ID directly instead of mapping
        .eq('paper_type', paperType)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching papers:', error);
        setAvailableSubjects([]);
        setPaperPricing({});
        return;
      }

      console.log('Found papers:', data);

      // Extract unique subjects that have active papers uploaded
      const uniqueSubjects = [...new Set(data?.map(paper => paper.subject) || [])];
      console.log('Available subjects:', uniqueSubjects);
      setAvailableSubjects(uniqueSubjects);

      // Store pricing information for subjects that have papers
      const pricingMap: {[key: string]: {price: number, is_free: boolean}} = {};
      data?.forEach(paper => {
        const paperData = paper as PaperWithPricing;
        if (paperData.paper_pricing && paperData.paper_pricing.length > 0) {
          const key = `${selectedClass}-${selectedExam}-${paperType}-${paperData.subject}`;
          pricingMap[key] = {
            price: paperData.paper_pricing[0].price,
            is_free: paperData.paper_pricing[0].is_free
          };
        } else {
          // Default to free if no pricing info found
          const key = `${selectedClass}-${selectedExam}-${paperType}-${paperData.subject}`;
          pricingMap[key] = {
            price: 0,
            is_free: true
          };
        }
      });
      setPaperPricing(pricingMap);
    };

    if (examTypes.length > 0) {
      loadAvailableSubjects();
    }
  }, [selectedClass, selectedExam, paperType, examTypes]);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(prev => {
      if (prev.includes(subject)) {
        // Remove if already selected
        return prev.filter(s => s !== subject);
      } else {
        // Add if not selected
        return [...prev, subject];
      }
    });
  };

  const getPaperPricing = (subject: string) => {
    const key = `${selectedClass}-${selectedExam}-${paperType}-${subject}`;
    const pricing = paperPricing[key];
    
    // Since we're only showing subjects with papers, they should all be available
    if (!pricing) {
      return { price: 0, is_free: true, available: true };
    }
    
    return { ...pricing, available: true };
  };

  const getTotalAmount = () => {
    if (!selectedSubject.length) return 0;
    return selectedSubject.reduce((total, subject) => {
      const pricing = getPaperPricing(subject);
      return total + (pricing.is_free ? 0 : pricing.price);
    }, 0);
  };

  const handlePaymentSuccess = async (paymentId: string, orderId: string) => {
    try {
      // Create multiple payment records for each subject
      for (const subject of selectedSubject) {
        const pricing = getPaperPricing(subject);
        const { error: transactionError } = await supabase
          .from('payment_transactions')
          .insert({
            user_email: formData.email,
            user_name: formData.fullName,
            school_name: formData.schoolName,
            mobile: formData.mobile,
            paper_id: subject,
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            amount: pricing.is_free ? 0 : pricing.price,
            status: 'completed'
          });
        if (transactionError) {
          console.error('Error creating payment record for subject:', subject, transactionError);
        }
      }

      // Proceed with download
      await processDownloads();
      
      toast({
        title: "Payment Successful!",
        description: "Your payment was successful. Downloads will start now.",
      });
    } catch (error) {
      console.error('Error processing payment success:', error);
      toast({
        title: "Error",
        description: "Payment successful but download failed. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    toast({
      title: "Payment Failed",
      description: "Your payment could not be processed. Please try again.",
      variant: "destructive"
    });
  };

  const processDownloads = async () => {
    if (!selectedSubject.length) return;
    
    // Process downloads for each selected subject
    for (const subject of selectedSubject) {
      // Get papers for this specific combination using the exam ID directly
      const { data: papers, error } = await supabase
        .from('papers')
        .select('*')
        .eq('standard', selectedClass)
        .eq('exam_type', selectedExam) // Use the exam ID directly
        .eq('paper_type', paperType)
        .eq('subject', subject)
        .eq('is_active', true)
        .order('display_order')
        .limit(1);

      if (error || !papers || papers.length === 0) {
        console.error('Error fetching paper for subject:', subject, error);
        continue;
      }

      const paper = papers[0] as DatabasePaper;
    
    const selectedStandardData = standards.find(s => s.code === selectedClass);
    const standard = selectedStandardData?.code as '10th' | '11th' | '12th' || '10th';
    
    const pdfPaper: PDFPaper = {
      id: paper.id,
      title: paper.title,
      paper_type: paperType as 'question' | 'answer',
      standard: standard,
      exam_type: selectedExam as 'unit1' | 'term1' | 'unit2' | 'prelim1' | 'prelim2' | 'prelim3' | 'term2' | 'internal' | 'chapter',
      subject: paper.subject,
      file_url: paper.file_url,
      file_name: paper.file_name
    };

    const userInfo = {
      collegeName: formData.schoolName,
      email: formData.email,
      phone: formData.mobile || ''
    };

    const { error: logError } = await supabase
      .from('download_logs')
      .insert({
        paper_id: paper.id,
        user_email: formData.email,
        user_name: formData.fullName,
        school_name: formData.schoolName,
        mobile: formData.mobile
      });

    if (logError) {
      console.error('Error logging download:', logError);
    }

    await downloadActualPDF(pdfPaper, userInfo);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClass || !selectedExam || !selectedSubject.length || !formData.email || !formData.schoolName) {
      toast({
        title: "कृपया सर्व आवश्यक माहिती भरा",
        description: "सर्व आवश्यक फील्ड भरणे आवश्यक आहे",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = getTotalAmount();
    
    // If total amount is 0 (all free papers), proceed directly with download
    if (totalAmount === 0) {
      setIsLoading(true);
      try {
        await processDownloads();
        toast({
          title: "Download सुरू केली गेली!",
          description: "तुमची PDFs watermark सह download होत आहेत...",
        });
      } catch (error) {
        console.error('Error processing downloads:', error);
        toast({
          title: "Error",
          description: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If there are paid papers, initiate payment
    setIsLoading(true);

    try {
      const totalAmount = getTotalAmount();
      console.log('Total amount for payment:', totalAmount);
      console.log('Selected subject:', selectedSubject);
      
      if (totalAmount <= 0) {
        throw new Error('Invalid payment amount');
      }

      await initiatePayment(
        totalAmount,
        selectedSubject.join(', '), // Convert array to string
        {
          name: formData.fullName || 'User',
          email: formData.email,
          phone: formData.mobile || '',
          schoolName: formData.schoolName
        },
        handlePaymentSuccess,
        handlePaymentError
      );
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: "Error",
        description: "Payment could not be initiated. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-5">
      <div className="row">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="card h-100">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="radio-toolbar">
                  <input 
                    type="radio" 
                    id="type_question" 
                    name="paper_type" 
                    value="question"
                    checked={paperType === "question"}
                    onChange={(e) => {
                      setPaperType(e.target.value);
                      setSelectedSubject([]);
                      setAvailableSubjects([]);
                    }}
                  />
                  <label htmlFor="type_question">प्रश्नपत्रिका</label>
                  
                  <input 
                    type="radio" 
                    id="type_answer" 
                    name="paper_type" 
                    value="answer"
                    checked={paperType === "answer"}
                    onChange={(e) => {
                      setPaperType(e.target.value);
                      setSelectedSubject([]);
                      setAvailableSubjects([]);
                    }}
                  />
                  <label htmlFor="type_answer">उत्तरपत्रिका</label>
                </div>

                <div className="mb-3">
                  <label htmlFor="class" className="form-label">इयत्ता</label>
                  <select 
                    id="class" 
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedExam("");
                      setSelectedSubject([]);
                      setAvailableSubjects([]);
                    }}
                  >
                    <option value="">इयत्ता निवडा</option>
                    {standards.map((standard) => (
                      <option key={standard.id} value={standard.code}>
                        {standard.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="exam" className="form-label">परीक्षा निवडा</label>
                  <select 
                    id="exam" 
                    className="form-select"
                    value={selectedExam}
                    onChange={(e) => {
                      setSelectedExam(e.target.value);
                      setSelectedSubject([]);
                    }}
                    disabled={!selectedClass}
                  >
                    <option value="">परीक्षा निवडा</option>
                    {examTypes.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.name}
                      </option>
                    ))}
                  </select>
                </div>

                {availableSubjects.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">उपलब्ध विषय निवडा</label>
                    <div className="subject-grid">
                      {availableSubjects.map((subject) => {
                        const pricing = getPaperPricing(subject);
                        return (
                          <div key={subject} className="subject-checkbox">
                            <input
                              type="checkbox"
                              id={subject}
                              checked={selectedSubject.includes(subject)}
                              onChange={() => handleSubjectChange(subject)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={subject}>
                              {subject}
                              {!pricing.is_free ? (
                                <span className="text-green-600 font-semibold ml-2">
                                  (₹{pricing.price})
                                </span>
                              ) : (
                                <span className="text-blue-600 font-semibold ml-2">
                                  (Free)
                                </span>
                              )}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {availableSubjects.length === 0 && selectedClass && selectedExam && (
                  <div className="mb-3">
                    <p className="text-muted">या परीक्षेसाठी कोणतेही विषय उपलब्ध नाहीत.</p>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="school_name" className="form-label">विद्यालय / कॉलेज नाव</label>
                  <input 
                    type="text" 
                    id="school_name" 
                    className="form-control"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    required
                  />
                </div>

                <h5 className="mt-4 mb-3">वैयक्तिक माहिती</h5>

                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label">नाव</label>
                  <input 
                    type="text" 
                    id="full_name" 
                    className="form-control"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">ई-मेल</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="mobile" className="form-label">मोबाईल</label>
                    <input 
                      type="tel" 
                      id="mobile" 
                      className="form-control"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                </div>

                {selectedSubject.length > 0 && (
                  <div className="mb-3 p-3 bg-gray-50 rounded">
                    <h6 className="font-semibold mb-2">Selected Papers ({selectedSubject.length}):</h6>
                    <div className="space-y-2">
                      {selectedSubject.map(subject => {
                        const pricing = getPaperPricing(subject);
                        return (
                          <div key={subject} className="flex justify-between items-center">
                            <span>{subject}</span>
                            <span className={pricing.is_free ? "text-blue-600" : "text-green-600"}>
                              {pricing.is_free ? "Free" : `₹${pricing.price}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{getTotalAmount()}</span>
                    </div>
                  </div>
                )}

                <div className="text-center mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg px-4"
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : getTotalAmount() > 0 ? `Pay ₹${getTotalAmount()} & Download` : "Download करा"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="text-primary mb-4">Highlights Of Smart Abhyas</h3>
              <ul className="feature-list">
                <li><i className="fas fa-check-circle"></i> Maharashtra State Board Syllabus</li>
                <li><i className="fas fa-check-circle"></i> Question Papers of All Exams Available</li>
                <li><i className="fas fa-check-circle"></i> Que. Papers With School/College/Institute Name</li>
                <li><i className="fas fa-check-circle"></i> Fully Solved Answers</li>
                <li><i className="fas fa-check-circle"></i> High Quality PDF Format</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainForm;
