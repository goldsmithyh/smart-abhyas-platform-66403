import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We collect information that you provide directly to us when using our services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>School or college name</li>
                  <li>Payment information (processed securely through payment gateways)</li>
                  <li>Download history and usage patterns</li>
                  <li>Device and browser information</li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and deliver the products and services you request</li>
                  <li>To process payments and send transaction confirmations</li>
                  <li>To send you PDF documents via email</li>
                  <li>To communicate with you about updates, offers, and important notices</li>
                  <li>To improve our website and services</li>
                  <li>To prevent fraud and ensure security</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>With payment processors to complete transactions</li>
                  <li>With email service providers to deliver PDFs to you</li>
                  <li>When required by law or to protect our rights</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We take reasonable measures to protect your information from unauthorized access, use, or disclosure:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Secure Socket Layer (SSL) encryption for data transmission</li>
                  <li>Secure storage of personal information</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information by authorized personnel only</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies and Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">5. Cookies and Tracking Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand how you use our site</li>
                  <li>Preference cookies to remember your settings</li>
                </ul>
                <p className="text-muted-foreground">
                  You can control cookie preferences through your browser settings.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">6. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access and review your personal information</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We retain your personal information for as long as necessary to provide our services 
                  and comply with legal obligations. Transaction records are maintained for accounting 
                  and legal purposes as required by law.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">8. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our services are intended for use by students and educators. We do not knowingly 
                  collect personal information from children under 13 without parental consent. If you 
                  believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">9. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
                  Your continued use of our services after such modifications constitutes your acknowledgment 
                  and acceptance of the updated Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">10. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> goldsmith.sir@gmail.com</p>
                  <p><strong>Phone:</strong> +91 9730100160</p>
                  <p><strong>Response Time:</strong> Within 24-48 business hours</p>
                  <p><strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="text-center text-sm text-muted-foreground mt-8">
              <p>Last Updated: November 26, 2025</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
