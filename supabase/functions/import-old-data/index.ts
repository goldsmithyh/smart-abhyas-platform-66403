import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportStats {
  adminUsers: { inserted: number; errors: number };
  papers: { inserted: number; errors: number };
  paperPricing: { inserted: number; errors: number };
  paymentTransactions: { inserted: number; errors: number };
  downloadLogs: { inserted: number; errors: number };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { sqlFiles } = await req.json();

    const stats: ImportStats = {
      adminUsers: { inserted: 0, errors: 0 },
      papers: { inserted: 0, errors: 0 },
      paperPricing: { inserted: 0, errors: 0 },
      paymentTransactions: { inserted: 0, errors: 0 },
      downloadLogs: { inserted: 0, errors: 0 }
    };

    // Parse and import admin_users
    if (sqlFiles.adminUsers) {
      console.log('Importing admin users...');
      const adminUsers = parseInsertStatement(sqlFiles.adminUsers);
      for (const user of adminUsers) {
        const { error } = await supabaseClient
          .from('admin_users')
          .insert({
            id: user.id,
            user_id: user.user_id,
            role: user.role,
            created_at: user.created_at
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting admin user:', error);
          stats.adminUsers.errors++;
        } else {
          stats.adminUsers.inserted++;
        }
      }
    }

    // Parse and import papers
    if (sqlFiles.papers) {
      console.log('Importing papers...');
      const papers = parseInsertStatement(sqlFiles.papers);
      for (const paper of papers) {
        const { error } = await supabaseClient
          .from('papers')
          .insert({
            id: paper.id,
            title: paper.title,
            paper_type: paper.paper_type,
            class_level: paper.class_level,
            exam_type: paper.exam_type,
            subject: paper.subject,
            file_url: paper.file_url,
            file_name: paper.file_name,
            created_at: paper.created_at,
            updated_at: paper.updated_at,
            is_active: paper.is_active === 'true',
            standard: paper.standard,
            display_order: paper.display_order ? parseInt(paper.display_order) : null
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting paper:', error.message);
          stats.papers.errors++;
        } else {
          stats.papers.inserted++;
        }
      }
    }

    // Parse and import paper_pricing
    if (sqlFiles.paperPricing) {
      console.log('Importing paper pricing...');
      const pricings = parseInsertStatement(sqlFiles.paperPricing);
      for (const pricing of pricings) {
        const { error } = await supabaseClient
          .from('paper_pricing')
          .insert({
            id: pricing.id,
            paper_id: pricing.paper_id,
            price: parseFloat(pricing.price),
            is_free: pricing.is_free === 'true',
            created_at: pricing.created_at,
            updated_at: pricing.updated_at
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting pricing:', error.message);
          stats.paperPricing.errors++;
        } else {
          stats.paperPricing.inserted++;
        }
      }
    }

    // Parse and import payment_transactions
    if (sqlFiles.paymentTransactions) {
      console.log('Importing payment transactions...');
      const transactions = parseInsertStatement(sqlFiles.paymentTransactions);
      for (const txn of transactions) {
        const { error } = await supabaseClient
          .from('payment_transactions')
          .insert({
            id: txn.id,
            user_email: txn.user_email,
            user_name: txn.user_name,
            school_name: txn.school_name,
            mobile: txn.mobile,
            paper_id: txn.paper_id,
            razorpay_payment_id: txn.razorpay_payment_id,
            razorpay_order_id: txn.razorpay_order_id,
            amount: parseFloat(txn.amount),
            status: txn.status,
            created_at: txn.created_at,
            updated_at: txn.updated_at
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting transaction:', error.message);
          stats.paymentTransactions.errors++;
        } else {
          stats.paymentTransactions.inserted++;
        }
      }
    }

    // Parse and import download_logs
    if (sqlFiles.downloadLogs) {
      console.log('Importing download logs...');
      const logs = parseInsertStatement(sqlFiles.downloadLogs);
      for (const log of logs) {
        const { error } = await supabaseClient
          .from('download_logs')
          .insert({
            id: log.id,
            paper_id: log.paper_id,
            user_email: log.user_email,
            user_name: log.user_name,
            school_name: log.school_name,
            mobile: log.mobile,
            downloaded_at: log.downloaded_at
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting download log:', error.message);
          stats.downloadLogs.errors++;
        } else {
          stats.downloadLogs.inserted++;
        }
      }
    }

    console.log('Import completed:', stats);

    return new Response(
      JSON.stringify({ success: true, stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Import error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function parseInsertStatement(sql: string): any[] {
  const results: any[] = [];
  
  // Extract column names
  const columnMatch = sql.match(/INSERT INTO.*?\((.*?)\)/);
  if (!columnMatch) return results;
  
  const columns = columnMatch[1].split(',').map(c => c.trim().replace(/"/g, ''));
  
  // Extract VALUES
  const valuesMatch = sql.match(/VALUES\s+(.*)/s);
  if (!valuesMatch) return results;
  
  let valuesStr = valuesMatch[1];
  
  // Split by '), (' to get individual rows
  const rows = valuesStr.split(/\),\s*\(/);
  
  for (let row of rows) {
    row = row.replace(/^\(/, '').replace(/\);?\s*$/, '');
    
    const values: string[] = [];
    let current = '';
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (escapeNext) {
        current += char;
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === "'" && !escapeNext) {
        inString = !inString;
        continue;
      }
      
      if (char === ',' && !inString) {
        values.push(current.trim());
        current = '';
        continue;
      }
      
      current += char;
    }
    
    if (current) {
      values.push(current.trim());
    }
    
    const obj: any = {};
    for (let i = 0; i < columns.length && i < values.length; i++) {
      let value = values[i];
      
      // Handle NULL values
      if (value === 'NULL' || value === 'null') {
        obj[columns[i]] = null;
      } else {
        obj[columns[i]] = value;
      }
    }
    
    results.push(obj);
  }
  
  return results;
}
