import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Download, Search, Filter, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Paper {
  id: string;
  title: string;
  paper_type: 'question' | 'answer';
  standard: string;
  class_level: string;
  exam_type: string;
  subject: string;
  file_url: string;
  file_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  display_order: number;
}

const AdminAllPDFs = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStandard, setFilterStandard] = useState<string>('all');
  const [filterExamType, setFilterExamType] = useState<string>('all');
  const [filterPaperType, setFilterPaperType] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    filterPapers();
  }, [papers, searchTerm, filterStandard, filterExamType, filterPaperType, filterSubject]);

  const fetchPapers = async () => {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to match our interface with proper type casting
      const mappedPapers: Paper[] = (data || []).map(paper => ({
        ...paper,
        paper_type: paper.paper_type as 'question' | 'answer',
        display_order: paper.display_order || 0,
        standard: paper.standard || (paper.class_level === 'Class X' ? '10th' : 
                 paper.class_level === 'Class XI' ? '11th' : 
                 paper.class_level === 'Class XII' ? '12th' : paper.class_level)
      }));

      setPapers(mappedPapers);
      
      // Extract unique subjects for filter
      const uniqueSubjects = [...new Set(mappedPapers.map(paper => paper.subject))];
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast.error('Failed to fetch papers');
    } finally {
      setIsLoading(false);
    }
  };

  const filterPapers = () => {
    let filtered = papers;

    if (searchTerm) {
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStandard !== 'all') {
      filtered = filtered.filter(paper => paper.standard === filterStandard);
    }

    if (filterExamType !== 'all') {
      filtered = filtered.filter(paper => paper.exam_type === filterExamType);
    }

    if (filterPaperType !== 'all') {
      filtered = filtered.filter(paper => paper.paper_type === filterPaperType);
    }

    if (filterSubject !== 'all') {
      filtered = filtered.filter(paper => paper.subject === filterSubject);
    }

    setFilteredPapers(filtered);
  };

  const handleDelete = async (paperId: string) => {
    try {
      const { error } = await supabase
        .from('papers')
        .update({ is_active: false })
        .eq('id', paperId);

      if (error) throw error;

      toast.success('Paper deactivated');
      fetchPapers();
    } catch (error) {
      console.error('Error deactivating paper:', error);
      toast.error('Failed to deactivate paper');
    }
  };

  const handleDownload = (paper: Paper) => {
    if (paper.file_url) {
      window.open(paper.file_url, '_blank');
    } else {
      toast.error('File URL not available');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStandard('all');
    setFilterExamType('all');
    setFilterPaperType('all');
    setFilterSubject('all');
  };

  const getPaperTypeColor = (type: string) => {
    return type === 'question' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getExamTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      unit1: 'bg-purple-100 text-purple-800',
      term1: 'bg-orange-100 text-orange-800',
      unit2: 'bg-pink-100 text-pink-800',
      final: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading papers...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All PDFs</h1>
          <p className="text-gray-600">Manage all uploaded question papers and answer keys</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <Input
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={filterStandard} onValueChange={setFilterStandard}>
                <SelectTrigger>
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Standards</SelectItem>
                  <SelectItem value="10th">10th</SelectItem>
                  <SelectItem value="11th">11th</SelectItem>
                  <SelectItem value="12th">12th</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Exam Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exam Types</SelectItem>
                  <SelectItem value="unit1">Unit 1</SelectItem>
                  <SelectItem value="term1">Term 1</SelectItem>
                  <SelectItem value="unit2">Unit 2</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPaperType} onValueChange={setFilterPaperType}>
                <SelectTrigger>
                  <SelectValue placeholder="Paper Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="question">Question Paper</SelectItem>
                  <SelectItem value="answer">Answer Key</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={clearFilters} variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredPapers.length} of {papers.length} papers
          </p>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getPaperTypeColor(paper.paper_type)}>
                    {paper.paper_type === 'question' ? 'Question Paper' : 'Answer Key'}
                  </Badge>
                  <Badge variant="outline">{paper.standard}</Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
                <CardDescription>
                  <div className="space-y-1">
                    <p><strong>Subject:</strong> {paper.subject}</p>
                    <p><strong>Exam:</strong> 
                      <Badge className={`ml-2 ${getExamTypeColor(paper.exam_type)}`}>
                        {paper.exam_type.toUpperCase()}
                      </Badge>
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(paper.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{paper.title}</DialogTitle>
                        <DialogDescription>
                          <div className="space-y-2 text-left">
                            <p><strong>Subject:</strong> {paper.subject}</p>
                            <p><strong>Standard:</strong> {paper.standard}</p>
                            <p><strong>Exam Type:</strong> {paper.exam_type}</p>
                            <p><strong>Paper Type:</strong> {paper.paper_type}</p>
                            <p><strong>File Name:</strong> {paper.file_name}</p>
                            <p><strong>Created:</strong> {new Date(paper.created_at).toLocaleString()}</p>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => handleDownload(paper)} className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(paper)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate Paper?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will deactivate "{paper.title}". The paper will no longer be visible to users.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(paper.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Deactivate
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">No papers found matching your criteria</p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminAllPDFs;
