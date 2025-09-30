
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
  papers: {
    title: string;
    subject: string;
    class_level: string;
    file_url: string;
    file_name: string;
    paper_type: string;
    exam_type: string;
  };
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
        .select(`
          *,
          papers:paper_id (
            title,
            subject,
            class_level,
            file_url,
            file_name,
            paper_type,
            exam_type
          )
        `)
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
      if (!log.papers?.file_url) {
        toast({
          title: "Error",
          description: "File URL not found",
          variant: "destructive"
        });
        return;
      }

      // Create paper object for PDF utils
      const paper = {
        id: log.paper_id,
        title: log.papers.title,
        paper_type: log.papers.paper_type as 'question' | 'answer',
        standard: log.papers.class_level as '10th' | '11th' | '12th',
        exam_type: log.papers.exam_type as 'unit1' | 'term1' | 'unit2' | 'final',
        subject: log.papers.subject,
        file_url: log.papers.file_url,
        file_name: log.papers.file_name
      };

      // Create user info object with college name from school_name
      const userInfo = {
        collegeName: log.school_name || 'Unknown College',
        email: log.user_email,
        phone: log.mobile || ''
      };

      await downloadActualPDF(paper, userInfo);

      toast({
        title: "Success",
        description: "Admin download started with user's college watermark",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Download failed",
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
                          <div className="font-medium">{log.papers?.title}</div>
                          <div className="text-sm text-gray-500">
                            {log.papers?.class_level} - {log.papers?.subject}
                          </div>
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
