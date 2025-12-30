import React, { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
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
import { downloadActualPDF } from '@/utils/pdfUtils'
import { toast } from "sonner"

interface DownloadLog {
  id: string
  downloaded_at: string
  paper_id: string
  user_email: string
  school_name: string
  mobile: string
}

interface Paper {
  id: string
  title: string
  paper_type: string
  standard: string
  exam_type: string
  subject: string
  file_url: string
  file_name: string
}

const MyAccount = () => {
  const [userEmail, setUserEmail] = useState('')
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDownloadLogs = async () => {
    if (!userEmail.trim()) {
      toast.error("Please enter your email")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('download_logs')
        .select('*')
        .eq('user_email', userEmail.trim())
        .order('downloaded_at', { ascending: false })

      if (error) {
        console.error(error)
        toast.error("Failed to fetch downloads")
        setDownloadLogs([])
        return
      }

      if (!data || data.length === 0) {
        toast.info("No downloads found for this email")
        setDownloadLogs([])
        return
      }

      setDownloadLogs(data)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (log: DownloadLog) => {
    try {
      const { data: paperData, error } = await supabase
        .from('papers')
        .select('*')
        .eq('id', log.paper_id)
        .single()

      if (error || !paperData) {
        toast.error("Failed to fetch paper")
        return
      }

      const paper: Paper = {
        id: paperData.id,
        title: paperData.title,
        paper_type: paperData.paper_type,
        standard: paperData.standard,
        exam_type: paperData.exam_type,
        subject: paperData.subject,
        file_url: paperData.file_url,
        file_name: paperData.file_name,
      }

      const userInfo = {
        collegeName: log.school_name || 'Unknown School',
        email: log.user_email,
        phone: log.mobile || '',
      }

      await downloadActualPDF(paper, userInfo)
    } catch (err) {
      console.error(err)
      toast.error("Download failed")
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Downloads - Smart Abhyas</h1>

      {/* EMAIL INPUT */}
      <div className="max-w-md mx-auto space-y-4 mb-8">
        <Input
          type="email"
          placeholder="Enter your email used for download"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <Button onClick={fetchDownloadLogs} className="w-full">
          {isLoading ? "Loading..." : "View My PDFs"}
        </Button>
      </div>

      {/* DOWNLOAD TABLE */}
      {downloadLogs.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Your downloaded PDFs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Paper ID</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloadLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.downloaded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{log.school_name}</TableCell>
                  <TableCell>{log.user_email}</TableCell>
                  <TableCell>{log.paper_id}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
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
    </div>
  )
}

export default MyAccount
