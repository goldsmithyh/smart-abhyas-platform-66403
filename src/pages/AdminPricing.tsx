import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Paper {
  id: string;
  title: string;
  paper_type: string;
  class_level: string;
  exam_type: string;
  subject: string;
  is_active: boolean;
  created_at: string;
}

interface PaperWithPricing extends Paper {
  pricing: {
    id: string;
    price: number;
    is_free: boolean;
  } | null;
}

const AdminPricing = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [papers, setPapers] = useState<PaperWithPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user && isAdmin) {
      fetchPapersWithPricing();
    }
  }, [user, isAdmin]);

  const fetchPapersWithPricing = async () => {
    try {
      // First, get all papers
      const { data: papersData, error: papersError } = await supabase
        .from('papers')
        .select('*')
        .order('created_at', { ascending: false });

      if (papersError) throw papersError;

      // Then, get pricing for each paper
      const papersWithPricing: PaperWithPricing[] = await Promise.all(
        (papersData || []).map(async (paper) => {
          const { data: pricingData, error: pricingError } = await supabase
            .from('paper_pricing')
            .select('id, price, is_free')
            .eq('paper_id', paper.id)
            .maybeSingle();

          if (pricingError) {
            console.error('Error fetching pricing for paper:', paper.id, pricingError);
          }

          return {
            ...paper,
            pricing: pricingData || null
          };
        })
      );

      setPapers(papersWithPricing);
    } catch (error) {
      console.error('Error fetching papers with pricing:', error);
      toast({
        title: "Error",
        description: "Failed to fetch papers with pricing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPricingIfNotExists = async (paperId: string) => {
    try {
      const { data, error } = await supabase
        .from('paper_pricing')
        .insert({
          paper_id: paperId,
          price: 0,
          is_free: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating pricing:', error);
      throw error;
    }
  };

  const updatePricing = async (paperId: string, price: number, isFree: boolean) => {
    try {
      // Find the paper
      const paper = papers.find(p => p.id === paperId);
      if (!paper) return;

      let pricingId = paper.pricing?.id;

      // If no pricing exists, create it
      if (!pricingId) {
        const newPricing = await createPricingIfNotExists(paperId);
        pricingId = newPricing.id;
      }

      // Update the pricing
      const { error } = await supabase
        .from('paper_pricing')
        .update({ 
          price: isFree ? 0 : price, 
          is_free: isFree 
        })
        .eq('id', pricingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });

      fetchPapersWithPricing();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update pricing: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handlePriceChange = async (paperId: string, newPrice: string) => {
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
      const price = parseFloat(newPrice) || 0;
      await updatePricing(paperId, price, paper.pricing?.is_free || false);
    }
  };

  const handleFreeToggle = async (paperId: string, isFree: boolean) => {
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
      await updatePricing(paperId, paper.pricing?.price || 0, isFree);
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-primary hover:underline"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-content">
          <div className="text-center">Loading pricing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Paper Pricing</h1>
          <p className="admin-subtitle">Manage pricing for all papers ({papers.length} papers)</p>
        </div>
        
        <div className="admin-main-content">
          <Card>
            <CardHeader>
              <CardTitle>Paper Pricing Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paper Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Free</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell>
                        <Switch
                          checked={paper.pricing?.is_free || false}
                          onCheckedChange={(checked) => handleFreeToggle(paper.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={paper.pricing?.price || 0}
                          onChange={(e) => handlePriceChange(paper.id, e.target.value)}
                          disabled={paper.pricing?.is_free || false}
                          className="w-24"
                          onBlur={(e) => handlePriceChange(paper.id, e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          paper.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {paper.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {papers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No papers found
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

export default AdminPricing;