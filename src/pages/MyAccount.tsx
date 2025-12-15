import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { downloadPDFForMobile } from '@/utils/pdfUtils';
import { toast } from "sonner";
import { LogOut } from 'lucide-react';

interface DownloadLog {
  id: string;
  downloaded_at: string;
  paper_id: string;
  user_email: string;
  user_name: string;
  school_name: string;
  mobile: string;
  file_url: string;
  file_name: string;
}

interface Paper {
  id: string;
  title: string;
  paper_type: 'question' | 'answer';
  standard: '10th' | '11th' | '12th';
  exam_type: 'unit1' | 'term1' | 'unit2' | 'final';
  subject: string;
  file_url: string;
  file_name: string;
}

const MyAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        fetchDownloadLogs(session.user.email || '');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        fetchDownloadLogs(session.user.email || '');
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchDownloadLogs = async (email: string) => {
    if (!email.trim()) {
      setDownloadLogs([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('download_logs')
        .select('*')
        .eq('user_email', email.trim())
        .order('downloaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching download logs:', error);
        setDownloadLogs([]);
      } else {
        const logsWithFileData = await Promise.all(
          data.map(async (log) => {
            const { data: paperData, error: paperError } = await supabase
              .from('papers')
              .select('file_url, file_name')
              .eq('id', log.paper_id)
              .single();

            if (paperError) {
              return { ...log, file_url: null, file_name: null };
            } else {
              return { ...log, file_url: paperData?.file_url, file_name: paperData?.file_name };
            }
          })
        );

        setDownloadLogs(logsWithFileData as DownloadLog[]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const handleDownload = async (log: DownloadLog) => {
    try {
      toast.info('Preparing PDF download...');
      
      const { data: paperData, error: paperError } = await supabase
        .from('papers')
        .select('*')
        .eq('id', log.paper_id)
        .single();

      if (paperError) {
        console.error('Error fetching paper data:', paperError);
        toast.error('Failed to fetch paper data');
        return;
      }

      const paper: Paper = {
        id: paperData.id,
        title: paperData.title,
        paper_type: paperData.paper_type as 'question' | 'answer',
        standard: paperData.standard as '10th' | '11th' | '12th',
        exam_type: paperData.exam_type as 'unit1' | 'term1' | 'unit2' | 'final',
        subject: paperData.subject,
        file_url: paperData.file_url,
        file_name: paperData.file_name,
      };

      const userInfo = {
        collegeName: log.school_name || 'Unknown School',
        email: log.user_email,
        phone: log.mobile || '',
      };

      await downloadPDFForMobile(paper, userInfo);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download PDF');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Downloads - Smart Creations</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Logged in as: <strong>{user?.email}</strong>
        </p>
      </div>

      {downloadLogs.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Your recent downloads from Smart Creations.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>School Name</TableHead>
                <TableHead>Paper ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloadLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {new Date(log.downloaded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{log.school_name}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{log.paper_id}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(log)}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No downloads found for this account.
        </div>
      )}
    </div>
  );
};

export default MyAccount;
