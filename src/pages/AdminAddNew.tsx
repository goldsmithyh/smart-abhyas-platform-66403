import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getExamTypeDisplayName } from "@/utils/examTypeMapping";

interface Standard {
  id: string;
  code: string;
  display_order: number;
}

interface ExamType {
  id: string;
  name: string;
  standard_id: string | null;
}

interface Subject {
  id: string;
  name: string;
  display_order: number;
  standard_id: string;
}

const AdminAddNew = () => {
  const { user, loading: authLoading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredExamTypes, setFilteredExamTypes] = useState<ExamType[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    paper_type: "",
    class_level: "",
    exam_type: "",
    subject: "",
    display_order: 0,
    file: null as File | null
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (formData.class_level) {
      const selectedStandard = standards.find(s => s.code === getClassLevelCode(formData.class_level));
      if (selectedStandard) {
        const filtered = examTypes.filter(et => 
          et.standard_id === selectedStandard.id || et.standard_id === null
        );
        setFilteredExamTypes(filtered);
        
        const filteredSubs = subjects.filter(s => s.standard_id === selectedStandard.id);
        setFilteredSubjects(filteredSubs);
      }
    } else {
      setFilteredExamTypes([]);
      setFilteredSubjects([]);
    }
    
    // Reset exam type and subject when class level changes
    setFormData(prev => ({ ...prev, exam_type: "", subject: "" }));
  }, [formData.class_level, standards, examTypes, subjects]);

  const fetchData = async () => {
    try {
      const [standardsRes, examTypesRes, subjectsRes] = await Promise.all([
        supabase.from('standards').select('*').eq('is_active', true).order('display_order'),
        supabase.from('exam_types').select('*').eq('is_active', true).order('display_order'),
        supabase.from('subjects_catalog').select('*').eq('is_active', true).order('display_order')
      ]);

      if (standardsRes.data) setStandards(standardsRes.data);
      if (examTypesRes.data) setExamTypes(examTypesRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getStandardFromClass = (classLevel: string): string => {
    switch (classLevel) {
      case "Class X":
        return "10th";
      case "Class XI":
        return "11th";
      case "Class XII":
        return "12th";
      default:
        return "10th";
    }
  };

  const getClassLevelCode = (classLevel: string): string => {
    switch (classLevel) {
      case "Class X":
        return "10th";
      case "Class XI":
        return "11th";
      case "Class XII":
        return "12th";
      default:
        return "10th";
    }
  };

  const classes = [
    { value: "Class X", label: "दहावी (Class X)" },
    { value: "Class XI", label: "अकरावी (Class XI)" },
    { value: "Class XII", label: "बारावी (Class XII)" }
  ];

  const paperTypes = [
    { value: "question", label: "प्रश्नपत्रिका (Question Paper)" },
    { value: "answer", label: "उत्तरपत्रिका (Answer Paper)" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title || !formData.paper_type || !formData.class_level || !formData.exam_type || !formData.subject) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `papers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('study-materials')
        .getPublicUrl(filePath);

      const standard = getStandardFromClass(formData.class_level);
      const dbPaperType = formData.paper_type;

      // Get the next display order
      const { data: maxOrderData } = await supabase
        .from('papers')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      const nextDisplayOrder = formData.display_order || ((maxOrderData?.[0]?.display_order || 0) + 1);

      const { error: insertError } = await supabase
        .from('papers')
        .insert({
          title: formData.title,
          paper_type: dbPaperType,
          class_level: formData.class_level,
          exam_type: formData.exam_type,
          subject: formData.subject,
          file_url: publicUrl,
          file_name: formData.file.name,
          standard: standard,
          is_active: true,
          display_order: nextDisplayOrder
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      toast({
        title: "Success",
        description: "Paper uploaded successfully!",
      });

      setFormData({
        title: "",
        paper_type: "",
        class_level: "",
        exam_type: "",
        subject: "",
        display_order: 0,
        file: null
      });

    } catch (error: any) {
      console.error('Error uploading paper:', error);
      toast({
        title: "Error",
        description: `Failed to upload paper: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
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

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Add New Paper</h1>
          <p className="admin-subtitle">Upload new question and answer papers</p>
        </div>
        
        <div className="admin-main-content">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload New Paper</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Paper Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter paper title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="paper_type">Paper Type *</Label>
                  <Select value={formData.paper_type} onValueChange={(value) => handleInputChange('paper_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select paper type" />
                    </SelectTrigger>
                    <SelectContent>
                      {paperTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class_level">Class Level *</Label>
                  <Select value={formData.class_level} onValueChange={(value) => handleInputChange('class_level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.value} value={cls.value}>
                          {cls.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="exam_type">Exam Type *</Label>
                  <Select 
                    value={formData.exam_type} 
                    onValueChange={(value) => handleInputChange('exam_type', value)}
                    disabled={!formData.class_level}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.class_level ? "Select exam type" : "Select class level first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredExamTypes.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {getExamTypeDisplayName(exam.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => handleInputChange('subject', value)}
                    disabled={!formData.class_level}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.class_level ? "Select subject" : "Select class level first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order (Optional)</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', e.target.value)}
                    placeholder="Leave empty for auto-assignment"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="file">PDF File *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? "Uploading..." : "Upload Paper"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAddNew;