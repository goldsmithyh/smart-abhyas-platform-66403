
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Paper {
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
}

const AdminDownloads = () => {
  const { user, loading: authLoading } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch papers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPaper = async (paper: Paper) => {
    try {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = paper.file_url;
      link.download = paper.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Paper download started",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download paper",
        variant: "destructive"
      });
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

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="text-center">Loading papers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Admin Downloads</h1>
          <p className="admin-subtitle">Download papers directly as admin ({papers.length} papers available)</p>
        </div>
        
        <div className="admin-main-content">
          <Card>
            <CardHeader>
              <CardTitle>Available Papers for Download</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {papers.map((paper) => (
                    <TableRow key={paper.id}>
                      <TableCell className="font-medium">{paper.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          paper.paper_type === 'question' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {paper.paper_type === 'question' ? 'Question' : 'Answer'}
                        </span>
                      </TableCell>
                      <TableCell>{paper.class_level}</TableCell>
                      <TableCell>{paper.subject}</TableCell>
                      <TableCell>{paper.exam_type}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => downloadPaper(paper)}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(paper.file_url, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {papers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No papers available for download
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDownloads;
