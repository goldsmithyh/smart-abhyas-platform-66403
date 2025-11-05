import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit, Plus } from "lucide-react";
import { getExamTypeDisplayName } from "@/utils/examTypeMapping";

interface Standard {
  id: string;
  code: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ExamType {
  id: string;
  name: string;
  standard_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Subject {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  standard_id: string;
}

const AdminCatalog = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [standards, setStandards] = useState<Standard[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [selectedStandardForSubjects, setSelectedStandardForSubjects] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [standardForm, setStandardForm] = useState({ code: "", display_order: 0 });
  const [examTypeForm, setExamTypeForm] = useState({ name: "", standard_id: "", display_order: 0 });
  const [subjectForm, setSubjectForm] = useState({ name: "", standard_id: "", display_order: 0 });
  
  const [editingStandard, setEditingStandard] = useState<string | null>(null);
  const [editingExamType, setEditingExamType] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Filter subjects when selected standard changes
  useEffect(() => {
    if (selectedStandardForSubjects) {
      const filtered = subjects.filter(subject => subject.standard_id === selectedStandardForSubjects);
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjects);
    }
  }, [selectedStandardForSubjects, subjects]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [standardsRes, examTypesRes, subjectsRes] = await Promise.all([
        supabase.from('standards').select('*').order('display_order'),
        supabase.from('exam_types').select('*').order('display_order'),
        supabase.from('subjects_catalog').select('*').order('display_order')
      ]);

      if (standardsRes.data) setStandards(standardsRes.data);
      if (examTypesRes.data) setExamTypes(examTypesRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!standardForm.code) return;

    try {
      if (editingStandard) {
        const { error } = await supabase
          .from('standards')
          .update(standardForm)
          .eq('id', editingStandard);
        if (error) throw error;
        setEditingStandard(null);
      } else {
        const { error } = await supabase
          .from('standards')
          .insert(standardForm);
        if (error) throw error;
      }
      
      setStandardForm({ code: "", display_order: 0 });
      await fetchData();
      toast({ title: "Success", description: "Standard saved successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleExamTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTypeForm.name) return;

    try {
      if (editingExamType) {
        const { error } = await supabase
          .from('exam_types')
          .update(examTypeForm)
          .eq('id', editingExamType);
        if (error) throw error;
        setEditingExamType(null);
      } else {
        const { error } = await supabase
          .from('exam_types')
          .insert(examTypeForm);
        if (error) throw error;
      }
      
      setExamTypeForm({ name: "", standard_id: "", display_order: 0 });
      await fetchData();
      toast({ title: "Success", description: "Exam type saved successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.standard_id) return;

    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects_catalog')
          .update(subjectForm)
          .eq('id', editingSubject);
        if (error) throw error;
        setEditingSubject(null);
      } else {
        const { error } = await supabase
          .from('subjects_catalog')
          .insert(subjectForm);
        if (error) throw error;
      }
      
      setSubjectForm({ name: "", standard_id: "", display_order: 0 });
      await fetchData();
      toast({ title: "Success", description: "Subject saved successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleStatus = async (table: 'standards' | 'exam_types' | 'subjects_catalog', id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      await fetchData();
      toast({ title: "Success", description: "Status updated successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
          <h1 className="admin-title">Catalog Management</h1>
          <p className="admin-subtitle">Manage standards, exam types, and subjects</p>
        </div>
        
        <div className="admin-main-content">
          <Tabs defaultValue="standards" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standards">Standards</TabsTrigger>
              <TabsTrigger value="exam-types">Exam Types</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="standards" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{editingStandard ? "Edit Standard" : "Add New Standard"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStandardSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="std-code">Code</Label>
                        <Input
                          id="std-code"
                          value={standardForm.code}
                          onChange={(e) => setStandardForm({...standardForm, code: e.target.value})}
                          placeholder="10th, 11th, 12th"
                          required
                        />
                      </div>
                       <div>
                         <Label htmlFor="std-order">Display Order</Label>
                         <Input
                           id="std-order"
                           type="number"
                           value={standardForm.display_order}
                           onChange={(e) => setStandardForm({...standardForm, display_order: parseInt(e.target.value)})}
                         />
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingStandard ? "Update" : "Add"} Standard
                      </Button>
                      {editingStandard && (
                        <Button type="button" variant="outline" onClick={() => {
                          setEditingStandard(null);
                          setStandardForm({ code: "", display_order: 0 });
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Standards List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                       <TableRow>
                         <TableHead>Code</TableHead>
                         <TableHead>Order</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead>Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standards.map((standard) => (
                         <TableRow key={standard.id}>
                           <TableCell>{standard.code}</TableCell>
                           <TableCell>{standard.display_order}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${standard.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {standard.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => {
                                setEditingStandard(standard.id);
                                 setStandardForm({
                                   code: standard.code,
                                   display_order: standard.display_order
                                 });
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={standard.is_active ? "destructive" : "default"}
                                onClick={() => toggleStatus('standards', standard.id, standard.is_active)}
                              >
                                {standard.is_active ? <Trash2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exam-types" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{editingExamType ? "Edit Exam Type" : "Add New Exam Type"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleExamTypeSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                       <div>
                         <Label htmlFor="exam-name">Name</Label>
                         <Input
                           id="exam-name"
                           value={examTypeForm.name}
                           onChange={(e) => setExamTypeForm({...examTypeForm, name: e.target.value})}
                           placeholder="प्रथम घटक चाचणी परीक्षा"
                           required
                         />
                       </div>
                       <div>
                         <Label htmlFor="exam-standard">Standard</Label>
                         <select
                           id="exam-standard" 
                           className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                           value={examTypeForm.standard_id}
                           onChange={(e) => setExamTypeForm({...examTypeForm, standard_id: e.target.value})}
                         >
                           <option value="">Select Standard</option>
                           {standards.map((standard) => (
                             <option key={standard.id} value={standard.id}>
                               {standard.code}
                             </option>
                           ))}
                         </select>
                       </div>
                      <div>
                        <Label htmlFor="exam-order">Display Order</Label>
                        <Input
                          id="exam-order"
                          type="number"
                          value={examTypeForm.display_order}
                          onChange={(e) => setExamTypeForm({...examTypeForm, display_order: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingExamType ? "Update" : "Add"} Exam Type
                      </Button>
                      {editingExamType && (
                        <Button type="button" variant="outline" onClick={() => {
                          setEditingExamType(null);
                          setExamTypeForm({ name: "", standard_id: "", display_order: 0 });
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exam Types List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                       <TableRow>
                         <TableHead>Name</TableHead>
                         <TableHead>Standard</TableHead>
                         <TableHead>Order</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead>Actions</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {examTypes.map((examType) => (
                         <TableRow key={examType.id}>
                           <TableCell>{getExamTypeDisplayName(examType.name)}</TableCell>
                           <TableCell>{standards.find(s => s.id === examType.standard_id)?.code || 'All'}</TableCell>
                           <TableCell>{examType.display_order}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${examType.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {examType.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => {
                                setEditingExamType(examType.id);
                                 setExamTypeForm({
                                   name: examType.name,
                                   standard_id: examType.standard_id || "",
                                   display_order: examType.display_order
                                 });
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={examType.is_active ? "destructive" : "default"}
                                onClick={() => toggleStatus('exam_types', examType.id, examType.is_active)}
                              >
                                {examType.is_active ? <Trash2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubjectSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="subject-name">Subject Name</Label>
                        <Input
                          id="subject-name"
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                          placeholder="Mathematics, मराठी, etc."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject-standard">Standard</Label>
                        <select
                          id="subject-standard"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={subjectForm.standard_id}
                          onChange={(e) => setSubjectForm({...subjectForm, standard_id: e.target.value})}
                          required
                        >
                          <option value="">Select Standard</option>
                          {standards.map((standard) => (
                            <option key={standard.id} value={standard.id}>
                              {standard.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="subject-order">Display Order</Label>
                        <Input
                          id="subject-order"
                          type="number"
                          value={subjectForm.display_order}
                          onChange={(e) => setSubjectForm({...subjectForm, display_order: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingSubject ? "Update" : "Add"} Subject
                      </Button>
                      {editingSubject && (
                        <Button type="button" variant="outline" onClick={() => {
                          setEditingSubject(null);
                          setSubjectForm({ name: "", standard_id: "", display_order: 0 });
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subjects List</CardTitle>
                  <div className="flex gap-2 mt-4">
                    <Label htmlFor="standard-filter">Filter by Standard:</Label>
                    <select
                      id="standard-filter"
                      className="flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                      value={selectedStandardForSubjects}
                      onChange={(e) => setSelectedStandardForSubjects(e.target.value)}
                    >
                      <option value="">All Standards</option>
                      {standards.map((standard) => (
                        <option key={standard.id} value={standard.id}>
                          {standard.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Standard</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell>{subject.name}</TableCell>
                          <TableCell>{standards.find(s => s.id === subject.standard_id)?.code || 'N/A'}</TableCell>
                          <TableCell>{subject.display_order}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${subject.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {subject.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => {
                                setEditingSubject(subject.id);
                                setSubjectForm({
                                  name: subject.name,
                                  standard_id: subject.standard_id,
                                  display_order: subject.display_order
                                });
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={subject.is_active ? "destructive" : "default"}
                                onClick={() => toggleStatus('subjects_catalog', subject.id, subject.is_active)}
                              >
                                {subject.is_active ? <Trash2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminCatalog;
