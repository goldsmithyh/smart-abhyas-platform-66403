import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ImportData = () => {
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<string>('');

  const loadSqlFiles = async () => {
    setStatus('Loading SQL files...');
    
    const [adminUsersRes, papersRes, pricingRes, transactionsRes, logsRes] = await Promise.all([
      fetch('/import-data/admin_users.sql'),
      fetch('/import-data/papers.sql'),
      fetch('/import-data/paper_pricing.sql'),
      fetch('/import-data/payment_transactions.sql'),
      fetch('/import-data/download_logs.sql')
    ]);

    return {
      adminUsers: await adminUsersRes.text(),
      papers: await papersRes.text(),
      paperPricing: await pricingRes.text(),
      paymentTransactions: await transactionsRes.text(),
      downloadLogs: await logsRes.text()
    };
  };

  const handleImport = async () => {
    setImporting(true);
    setStatus('');
    
    try {
      setStatus('Loading SQL files from server...');
      const sqlFiles = await loadSqlFiles();

      setStatus('Sending data to import function...');
      const { data, error } = await supabase.functions.invoke('import-old-data', {
        body: { sqlFiles }
      });

      if (error) throw error;

      setStatus('Import complete!');
      toast.success('Data imported successfully!', {
        description: `
          Admin Users: ${data.stats.adminUsers.inserted} ✓, ${data.stats.adminUsers.errors} errors
          Papers: ${data.stats.papers.inserted} ✓, ${data.stats.papers.errors} errors
          Pricing: ${data.stats.paperPricing.inserted} ✓, ${data.stats.paperPricing.errors} errors
          Transactions: ${data.stats.paymentTransactions.inserted} ✓, ${data.stats.paymentTransactions.errors} errors
          Logs: ${data.stats.downloadLogs.inserted} ✓, ${data.stats.downloadLogs.errors} errors
        `,
        duration: 10000
      });

    } catch (error: any) {
      console.error('Import error:', error);
      setStatus(`Error: ${error.message}`);
      toast.error('Import failed', {
        description: error.message
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Import Old Database Data</CardTitle>
          <CardDescription>
            Click the button below to import all your data from the old Supabase project. 
            This will import admin users, papers, pricing, transactions, and download logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Data to be imported:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Admin Users (4 users)</li>
              <li>Papers (all question & answer papers)</li>
              <li>Paper Pricing (pricing info for all papers)</li>
              <li>Payment Transactions (all revenue data)</li>
              <li>Download Logs (all download history)</li>
            </ul>
          </div>

          {status && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm">
              {status}
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={importing}
            size="lg"
            className="w-full"
          >
            {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {importing ? 'Importing Data...' : 'Start Import'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            This process may take a few minutes depending on the amount of data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportData;
