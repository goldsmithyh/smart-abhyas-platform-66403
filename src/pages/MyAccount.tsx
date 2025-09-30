
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { downloadActualPDF } from '@/utils/pdfUtils';
import { toast } from "sonner";

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
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const fetchDownloadLogs = async (email: string) => {
    if (!email.trim()) {
      setDownloadLogs([]);
      return;
    }

    setIsLoading(true);
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
        // Fetch additional data (file_url and file_name) for each log
        const logsWithFileData = await Promise.all(
          data.map(async (log) => {
            const { data: paperData, error: paperError } = await supabase
              .from('papers')
              .select('file_url, file_name')
              .eq('id', log.paper_id)
              .single();

            if (paperError) {
              console.error('Error fetching paper data:', paperError);
              return { ...log, file_url: null, file_name: null };
            } else {
              return { ...log, file_url: paperData?.file_url, file_name: paperData?.file_name };
            }
          })
        );

        setDownloadLogs(logsWithFileData as DownloadLog[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!userEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    console.log('Sending verification code to:', userEmail.trim());
    setIsSendingCode(true);
    
    try {
      // Check if user has downloaded anything before
      const { data: downloadData, error: downloadError } = await supabase
        .from('download_logs')
        .select('user_email')
        .eq('user_email', userEmail.trim())
        .limit(1);

      if (downloadError) {
        console.error('Error checking downloads:', downloadError);
        throw new Error('Failed to verify email. Please try again.');
      }

      if (!downloadData || downloadData.length === 0) {
        throw new Error('No downloads found for this email address. Please use the email you used to download papers.');
      }

      // Call edge function to send verification email
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: { email: userEmail.trim() }
      });

      if (error) {
        console.error('Error calling send-verification-email:', error);
        throw new Error('Failed to send verification code. Please try again.');
      }

      console.log('Verification email response:', data);
      
      if (data?.success) {
        setIsVerificationSent(true);
        toast.success('Verification code sent to your email! Check your inbox.');
      } else {
        throw new Error(data?.error || 'Failed to send verification code');
      }
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast.error(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCodeAndFetchLogs = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsVerifyingCode(true);
    try {
      // Call edge function to verify the code
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: { 
          email: userEmail.trim(),
          code: verificationCode.trim()
        }
      });

      if (error) {
        console.error('Error calling verify-email-code:', error);
        throw new Error('Failed to verify code. Please try again.');
      }

      console.log('Verification response:', data);

      if (data?.success) {
        setIsEmailVerified(true);
        toast.success('Email verified successfully!');
        
        // Now fetch the download logs
        fetchDownloadLogs(userEmail);
      } else {
        throw new Error(data?.error || 'Invalid or expired verification code');
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast.error(error.message || 'Invalid or expired verification code');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const resetVerification = () => {
    setIsEmailVerified(false);
    setIsVerificationSent(false);
    setVerificationCode('');
    setDownloadLogs([]);
    setUserEmail('');
  };

  const handleDownload = async (log: DownloadLog) => {
    try {
      // Fetch complete paper data for proper watermarking
      const { data: paperData, error: paperError } = await supabase
        .from('papers')
        .select('*')
        .eq('id', log.paper_id)
        .single();

      if (paperError) {
        console.error('Error fetching paper data:', paperError);
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

      // Use the same function as main site for consistent watermarking
      await downloadActualPDF(paper, userInfo);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Downloads - Smart Abhyas</h1>
      
      {!isEmailVerified ? (
        <div className="max-w-md mx-auto space-y-6">
          {!isVerificationSent ? (
            // Step 1: Enter email and send verification code
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Enter the email you used to download papers:
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                onClick={sendVerificationCode}
                disabled={isSendingCode || !userEmail.trim()}
                className="w-full"
              >
                {isSendingCode ? 'Sending Code...' : 'Send Verification Code'}
              </Button>
            </div>
          ) : (
            // Step 2: Enter verification code
            <form onSubmit={verifyCodeAndFetchLogs} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  Enter the 6-digit code sent to your email by Smart Abhyas:
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Code sent to: {userEmail}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  ⏰ Code expires in 10 minutes
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit"
                  disabled={isVerifyingCode || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isVerifyingCode ? 'Verifying...' : 'Verify & Access Downloads'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={resetVerification}
                >
                  Reset
                </Button>
              </div>
              <Button 
                type="button"
                variant="link"
                onClick={sendVerificationCode}
                disabled={isSendingCode}
                className="w-full text-sm"
              >
                {isSendingCode ? 'Sending...' : 'Resend Code'}
              </Button>
            </form>
          )}
        </div>
      ) : (
        // Step 3: Show downloads after verification
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing downloads for: <strong>{userEmail}</strong>
            </p>
            <Button 
              variant="outline"
              onClick={resetVerification}
              size="sm"
            >
              Change Email
            </Button>
          </div>

          {downloadLogs.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Your recent downloads from Smart Abhyas.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>School Name</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead>Paper ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloadLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{new Date(log.downloaded_at).toLocaleDateString()}</TableCell>
                      <TableCell>{log.school_name}</TableCell>
                      <TableCell>{log.user_email}</TableCell>
                      <TableCell>{log.paper_id}</TableCell>
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
          )}

          {!isLoading && downloadLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No downloads found for this email address.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAccount;
