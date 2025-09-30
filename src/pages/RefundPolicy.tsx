
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Refund Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read our refund policy carefully before making any purchases
          </p>
        </div>
      </section>

      {/* Refund Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {/* No Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">1. No Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">
                  <strong>Please Note:</strong> All purchases on ExamPaper PDF are final and non-refundable. 
                  Once a purchase is made, no refund will be provided under any circumstances.
                </p>
                <p className="text-muted-foreground">
                  We encourage all users to carefully review the exam paper details and preview (if available) 
                  before making a purchase decision. This policy is in place to protect our digital content 
                  and maintain the integrity of our services.
                </p>
              </CardContent>
            </Card>

            {/* Before Making a Purchase */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">2. Before Making a Purchase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  To ensure you make an informed decision, please:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Carefully review the exam paper description and details</li>
                  <li>Check the preview content when available</li>
                  <li>Ensure the exam paper matches your requirements</li>
                  <li>Verify your selection before completing the purchase</li>
                  <li>Contact our support team if you have any questions before purchasing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Technical Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">3. Technical Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  While we do not provide refunds, we are committed to resolving any technical issues you may encounter:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>If you experience problems accessing your purchased content</li>
                  <li>If the download link is not working</li>
                  <li>If the content is not displaying correctly</li>
                  <li>Any other technical difficulties related to accessing your purchase</li>
                </ul>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">4. Customer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our customer support team is available to assist you with any questions or technical issues:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> goldsmith.sir@gmail.com</p>
                  <p><strong>Response Time:</strong> Within 24-48 business hours</p>
                  <p><strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">5. Payment Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We ensure secure transactions through:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>SSL-encrypted payment processing</li>
                  <li>Secure payment gateways</li>
                  <li>Protected customer information</li>
                  <li>Verified transaction systems</li>
                </ul>
              </CardContent>
            </Card>

            {/* Policy Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">6. Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to modify this refund policy at any time. Any changes will be 
                  effective immediately upon posting on this page. Your continued use of our services 
                  following any changes indicates your acceptance of the new refund policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
