import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Check } from "lucide-react";

interface VerificationData {
  email: string;
  code: string;
  timestamp: number;
}

const EmailVerification = () => {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);

  const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (userEmail: string, verificationCode: string) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': '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'
      },
      body: JSON.stringify({
        sender: {
          name: "Smart Creations",
          email: "smartshikshans@gmail.com"
        },
        to: [
          {
            email: userEmail,
            name: userEmail.split('@')[0]
          }
        ],
        subject: "Your Email Verification Code",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Smart Creations</h1>
                <p style="color: #666; margin: 10px 0 0 0;">Email Verification Service</p>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 15px;">Verify Your Email Address</h2>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">
                  Please use the following 6-digit verification code to complete your email verification:
                </p>
                
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px dashed #2563eb;">
                  <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${verificationCode}
                  </div>
                </div>
                
                <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #92400e; margin: 0; font-weight: 500;">
                    ⏰ This code will expire in 10 minutes
                  </p>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-top: 20px;">
                  If you didn't request this verification code, you can safely ignore this email.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © 2024 Smart Creations. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send email: ${response.status} ${errorText}`);
    }

    return await response.json();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const verificationCode = generateCode();
      const timestamp = Date.now();

      // Store verification data temporarily
      const data: VerificationData = {
        email: email.trim().toLowerCase(),
        code: verificationCode,
        timestamp
      };

      // Store in localStorage for persistence across page reloads
      localStorage.setItem('emailVerification', JSON.stringify(data));
      setVerificationData(data);

      // Send email via Brevo API
      await sendVerificationEmail(email.trim(), verificationCode);

      setStep('code');
      toast.success('Verification code sent to your email!');
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    if (code.length !== 6) {
      toast.error('Verification code must be 6 digits');
      return;
    }

    const storedData = verificationData || JSON.parse(localStorage.getItem('emailVerification') || '{}');
    
    if (!storedData.code) {
      toast.error('No verification code found. Please request a new one.');
      setStep('email');
      return;
    }

    // Check if code has expired (10 minutes = 600,000 ms)
    const currentTime = Date.now();
    const codeAge = currentTime - storedData.timestamp;
    if (codeAge > 600000) {
      toast.error('Verification code has expired. Please request a new one.');
      localStorage.removeItem('emailVerification');
      setStep('email');
      return;
    }

    // Verify code
    if (code.trim() === storedData.code) {
      setStep('success');
      toast.success('Email verified successfully!');
      localStorage.removeItem('emailVerification');
    } else {
      toast.error('Invalid verification code. Please try again.');
      setCode('');
    }
  };

  const resetFlow = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setVerificationData(null);
    localStorage.removeItem('emailVerification');
  };

  // Check for existing verification data on component mount
  useEffect(() => {
    const stored = localStorage.getItem('emailVerification');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const codeAge = Date.now() - data.timestamp;
        if (codeAge <= 600000) {
          setVerificationData(data);
          setEmail(data.email);
          setStep('code');
        } else {
          localStorage.removeItem('emailVerification');
        }
      } catch (error) {
        localStorage.removeItem('emailVerification');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Email Verification
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Enter your email to receive a verification code'}
            {step === 'code' && 'Enter the 6-digit code sent to your email'}
            {step === 'success' && 'Your email has been verified successfully!'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center tracking-widest font-mono text-lg"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Code sent to: <strong>{email}</strong>
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  ⏰ Code expires in 10 minutes
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={code.length !== 6}
                >
                  Verify Code
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={resetFlow}
                >
                  Reset
                </Button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">Email Verified!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your email <strong>{email}</strong> has been successfully verified.
                </p>
              </div>
              <Button onClick={resetFlow} variant="outline" className="w-full">
                Verify Another Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;