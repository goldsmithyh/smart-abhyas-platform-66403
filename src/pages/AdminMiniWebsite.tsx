import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { downloadActualPDF } from "@/utils/pdfUtils";
import { getExamTypeDisplayName } from "@/utils/examTypeMapping";

interface Paper {
  id: string;
  title: string;
  paper_type: string;
  standard: string;
  exam_type: string;
  subject: string;
  file_url: string;
  file_name: string;
}

interface ExamType {
  id: string;
  name: string;
  standard_id: string;
  is_active: boolean;
  display_order: number;
}

const AdminMiniWebsite = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [standard, setStandard] = useState<string>("");
  const [examType, setExamType] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [collegeName, setCollegeName] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [standards, setStandards] = useState<Array<{id: string, code: string}>>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
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
      if (!standard) {
        setExamTypes([]);
        return;
      }

      // First get the standard ID for the selected class
      const { data: standardData, error: standardError } = await supabase
        .from('standards')
        .select('id')
        .eq('code', standard)
        .single();

      if (standardError || !standardData) {
        console.error('Error loading standard:', standardError);
        setExamTypes([]);
        return;
      }

      // Then get exam types for this standard
      const { data, error } = await supabase
        .from('exam_types')
        .select('id, name, standard_id, is_active, display_order')
        .eq('standard_id', standardData.id)
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error loading exam types:', error);
        setExamTypes([]);
        return;
      }

      setExamTypes(data || []);
    };

    loadExamTypes();
  }, [standard]);

  // Fetch subjects when standard or examType changes
  useEffect(() => {
    if (standard && examType) {
      // Reset selections when criteria change
      setSelectedSubjects([]);
      setPapers([]);
      fetchSubjects();
    } else {
      setSubjects([]);
      setSelectedSubjects([]);
      setPapers([]);
    }
  }, [standard, examType]);

  useEffect(() => {
    if (standard && examType && selectedSubjects.length > 0) {
      fetchPapers();
    }
  }, [standard, examType, selectedSubjects]);

  const fetchSubjects = async () => {
    try {
      // Get the exam type name from the selected ID
      const selectedExamType = examTypes.find(et => et.id === examType);
      if (!selectedExamType) {
        console.log('Exam type not found for ID:', examType);
        return;
      }

      console.log('Fetching subjects with criteria:', { standard, examTypeName: selectedExamType.name });

      const { data, error } = await supabase
        .from('papers')
        .select('subject')
        .eq('standard', standard)
        .eq('exam_type', selectedExamType.name)
        .eq('is_active', true);

      console.log('Subjects query result:', { data, error });

      if (error) throw error;

      const uniqueSubjects = [...new Set(data?.map(paper => paper.subject) || [])];
      console.log('Unique subjects found:', uniqueSubjects);
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subjects",
        variant: "destructive"
      });
    }
  };

  const fetchPapers = async () => {
    try {
      // Get the exam type name from the selected ID
      const selectedExamType = examTypes.find(et => et.id === examType);
      if (!selectedExamType) {
        console.log('Exam type not found for ID:', examType);
        return;
      }

      console.log('Fetching papers with criteria:', {
        standard,
        examTypeName: selectedExamType.name,
        selectedSubjects
      });

      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('standard', standard)
        .eq('exam_type', selectedExamType.name)
        .in('subject', selectedSubjects)
        .eq('is_active', true);

      console.log('Database query result:', { data, error });

      if (error) throw error;
      
      // Map database results to Paper interface
      const typedPapers: Paper[] = (data || []).map(paper => ({
        id: paper.id,
        title: paper.title,
        paper_type: paper.paper_type,
        standard: paper.standard,
        exam_type: paper.exam_type,
        subject: paper.subject,
        file_url: paper.file_url,
        file_name: paper.file_name,
      }));
      
      console.log('Typed papers:', typedPapers);
      setPapers(typedPapers);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch papers",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (paper: Paper) => {
    if (!collegeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter college name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const userInfo = {
        collegeName: collegeName.trim(),
        email: user?.email || 'admin@smartabhyas.com',
        phone: '9999999999'
      };

      await downloadActualPDF(paper, userInfo);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully with watermark",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDownload = async () => {
    if (!collegeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter college name",
        variant: "destructive"
      });
      return;
    }

    if (papers.length === 0) {
      toast({
        title: "Error",
        description: "No papers available to download",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const userInfo = {
        collegeName: collegeName.trim(),
        email: user?.email || 'admin@smartabhyas.com',
        phone: '9999999999'
      };

      for (const paper of papers) {
        await downloadActualPDF(paper, userInfo);
      }
      
      toast({
        title: "Success",
        description: `${papers.length} PDFs downloaded successfully with watermark`,
      });
    } catch (error) {
      console.error('Error downloading PDFs:', error);
      toast({
        title: "Error",
        description: "Failed to download some PDFs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-primary hover:underline"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Mini Website</h1>
          <p className="admin-subtitle">Select papers and download with custom college name and watermark</p>
        </div>
        
        <div className="admin-main-content">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Paper Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="standard">Standard</Label>
                    <Select value={standard} onValueChange={setStandard}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {standards.map((std) => (
                          <SelectItem key={std.id} value={std.code}>
                            {std.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="examType">Exam Type</Label>
                    <Select value={examType} onValueChange={setExamType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Exam Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {getExamTypeDisplayName(exam.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {subjects.length > 0 && (
                  <div>
                    <Label>Select Subjects (Multiple Selection)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {subjects.map((subj) => (
                        <div key={subj} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <input
                            type="checkbox"
                            id={`subject-${subj}`}
                            checked={selectedSubjects.includes(subj)}
                            onChange={(e) => {
                              console.log('Checkbox changed:', subj, e.target.checked);
                              if (e.target.checked) {
                                const newSelection = [...selectedSubjects, subj];
                                console.log('Adding subject, new selection:', newSelection);
                                setSelectedSubjects(newSelection);
                              } else {
                                const newSelection = selectedSubjects.filter(s => s !== subj);
                                console.log('Removing subject, new selection:', newSelection);
                                setSelectedSubjects(newSelection);
                              }
                            }}
                            className="w-4 h-4 text-primary border-2 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                          />
                          <Label 
                            htmlFor={`subject-${subj}`} 
                            className="text-sm cursor-pointer flex-1 font-medium"
                          >
                            {subj}
                          </Label>
                          {selectedSubjects.includes(subj) && (
                            <span className="text-xs text-green-600 font-medium">✓ Selected</span>
                          )}
                        </div>
                      ))}
                    </div>
                    {selectedSubjects.length > 0 && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-foreground">
                          {selectedSubjects.length} subject(s) selected:
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedSubjects.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input
                    id="collegeName"
                    placeholder="Enter college name for watermark"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {papers.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Available Papers ({papers.length})</CardTitle>
                  <Button
                    onClick={handleBulkDownload}
                    disabled={loading || !collegeName.trim()}
                    className="ml-auto"
                    variant="outline"
                  >
                    {loading ? "Downloading..." : "Download All Papers"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {papers.map((paper) => (
                      <Card key={paper.id} className="border">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{paper.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground mb-4">
                            <p>Type: <span className="capitalize">{paper.paper_type}</span></p>
                            <p>Standard: {paper.standard}</p>
                            <p>Subject: {paper.subject}</p>
                          </div>
                          <Button
                            onClick={() => handleDownload(paper)}
                            disabled={loading || !collegeName.trim()}
                            className="w-full"
                          >
                            {loading ? "Downloading..." : "Download PDF"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {standard && examType && subjects.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No subjects found for the selected standard and exam type.</p>
                </CardContent>
              </Card>
            )}

            {standard && examType && selectedSubjects.length > 0 && papers.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No papers found for the selected criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMiniWebsite;
