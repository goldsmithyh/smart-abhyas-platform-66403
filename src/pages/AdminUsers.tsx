
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { downloadActualPDF } from "@/utils/pdfUtils";

interface DownloadLog {
  id: string;
  user_name: string | null;
  user_email: string;
  mobile: string | null;
  school_name: string | null;
  downloaded_at: string;
  paper_id: string;
}

const AdminUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDownloadLogs();
  }, []);

  const fetchDownloadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('download_logs')
        .select('*')
        .order('downloaded_at', { ascending: false });

      if (error) throw error;
      setDownloadLogs(data || []);
    } catch (error) {
      console.error('Error fetching download logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadUserPaper = async (log: DownloadLog) => {
    try {
      // Fetch paper details from papers table
      const { data: paper, error } = await supabase
        .from('papers')
        .select('*')
        .eq('id', log.paper_id)
        .single();

      if (error) throw error;
      
      if (!paper) {
        toast({
          title: "Error",
          description: "Paper not found",
          variant: "destructive"
        });
        return;
      }

      // Download the paper with user info from the log
      await downloadActualPDF(
        {
          id: paper.id,
          title: paper.title,
          paper_type: paper.paper_type as 'question' | 'answer',
          standard: paper.standard as '10th' | '11th' | '12th',
          exam_type: paper.exam_type as 'unit1' | 'term1' | 'unit2' | 'final' | 'prelim1' | 'prelim2' | 'prelim3' | 'term2' | 'chapter' | 'internal',
          subject: paper.subject,
          file_url: paper.file_url,
          file_name: paper.file_name
        },
        {
          collegeName: log.school_name || '',
          email: log.user_email,
          phone: log.mobile || ''
        }
      );

      toast({
        title: "Success",
        description: "Paper download started",
      });
    } catch (error) {
      console.error('Error downloading paper:', error);
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
          <div className="text-center">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Users</h1>
          <p className="admin-subtitle">Users who have downloaded papers ({downloadLogs.length} downloads)</p>
        </div>
        
        <div className="admin-main-content">
          <Card>
            <CardHeader>
              <CardTitle>Download History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Downloaded Paper</TableHead>
                    <TableHead>Download Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloadLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.user_name || 'N/A'}
                      </TableCell>
                      <TableCell>{log.user_email}</TableCell>
                      <TableCell>{log.mobile || 'N/A'}</TableCell>
                      <TableCell>{log.school_name || 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.paper_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(log.downloaded_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => downloadUserPaper(log)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                    {downloadLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No download records found
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

export default AdminUsers;
