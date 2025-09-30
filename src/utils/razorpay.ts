interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RAZORPAY_KEY_ID = 'rzp_live_PyaKPT1dVoYKhE';

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, paperId: string, userInfo: any) => {
  try {
    console.log('Calling Supabase edge function to create order...');
    
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        amount,
        paperId,
        userInfo
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to create order: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from order creation');
    }

    console.log('Order created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const initiatePayment = async (
  amount: number,
  paperId: string,
  userInfo: {
    name: string;
    email: string;
    phone: string;
    schoolName: string;
  },
  onSuccess: (paymentId: string, orderId: string) => void,
  onError: (error: any) => void
) => {
  try {
    console.log('Initiating payment with amount:', amount);
    console.log('User info:', userInfo);

    // Load Razorpay script
    console.log('Loading Razorpay script...');
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      console.error('Failed to load Razorpay script');
      throw new Error('Failed to load Razorpay script');
    }
    console.log('Razorpay script loaded successfully');

    // Create order
    console.log('Creating Razorpay order...');
    const order = await createRazorpayOrder(amount, paperId, userInfo);
    console.log('Order created:', order);

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Smart Abhyas',
      description: 'Question Paper Purchase',
      order_id: order.id,
      handler: (response: any) => {
        console.log('Payment successful:', response);
        onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      theme: {
        color: '#D648D7',
      },
    };

    console.log('Razorpay options:', options);

    if (!window.Razorpay) {
      console.error('Razorpay not available on window');
      throw new Error('Razorpay not loaded properly');
    }

    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      onError(response.error);
    });

    console.log('Opening Razorpay checkout...');
    razorpay.open();
  } catch (error) {
    console.error('Error in initiatePayment:', error);
    onError(error);
  }
};