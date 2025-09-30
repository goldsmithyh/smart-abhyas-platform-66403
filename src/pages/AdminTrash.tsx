
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

const AdminTrash = () => {
  const { user, loading: authLoading } = useAuth();
  const [inactivePapers, setInactivePapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInactivePapers();
  }, []);

  const fetchInactivePapers = async () => {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('is_active', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInactivePapers(data || []);
    } catch (error) {
      console.error('Error fetching inactive papers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch inactive papers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const restorePaper = async (paperId: string) => {
    try {
      const { error } = await supabase
        .from('papers')
        .update({ is_active: true })
        .eq('id', paperId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Paper restored successfully",
      });

      fetchInactivePapers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to restore paper: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const permanentlyDeletePaper = async (paperId: string) => {
    if (!confirm("Are you sure you want to permanently delete this paper? This action cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from('papers')
        .delete()
        .eq('id', paperId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Paper permanently deleted",
      });

      fetchInactivePapers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete paper: ${error.message}`,
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
          <div className="text-center">Loading trash...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Trash</h1>
          <p className="admin-subtitle">Manage deleted/inactive papers ({inactivePapers.length} items)</p>
        </div>
        
        <div className="admin-main-content">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Papers</CardTitle>
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
                  {inactivePapers.map((paper) => (
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
                            variant="default"
                            onClick={() => restorePaper(paper.id)}
                          >
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => permanentlyDeletePaper(paper.id)}
                          >
                            Delete Forever
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
                  {inactivePapers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No inactive papers found
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

export default AdminTrash;
