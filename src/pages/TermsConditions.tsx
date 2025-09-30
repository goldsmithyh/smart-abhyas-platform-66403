
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Terms and Conditions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our services
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">1. Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Welcome to ExamPaper PDF. By accessing and using our website, you agree to comply 
                  with and be bound by the following terms and conditions of use. Please read these 
                  terms carefully before using our services.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">2. Use License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Permission is granted to temporarily download one copy of the materials (information or software) 
                  on ExamPaper PDF's website for personal, non-commercial transitory viewing only. This is the 
                  grant of a license, not a transfer of title.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Materials may not be modified, copied, distributed, or used for commercial purposes</li>
                  <li>Any unauthorized use automatically terminates the permission granted herein</li>
                  <li>All downloads must be properly cited when used for academic purposes</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">3. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Users are responsible for maintaining the confidentiality of their account information 
                  and for all activities that occur under their account. Users must not misuse, tamper with, 
                  or make unauthorized copies of exam materials.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Maintain the security of your account credentials</li>
                  <li>Report any unauthorized access immediately</li>
                  <li>Ensure all submitted information is accurate and up-to-date</li>
                  <li>Respect intellectual property rights of all materials</li>
                </ul>
              </CardContent>
            </Card>

            {/* Service Modifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">4. Service Modifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to modify, suspend, or discontinue any part of our services at any 
                  time without notice. We shall not be liable to you or any third party for any modification, 
                  suspension, or discontinuance of the services.
                </p>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">5. Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Your use of ExamPaper PDF is also governed by our Privacy Policy. Please review our 
                  Privacy Policy, which also governs the site and informs users of our data collection practices.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>We collect and process personal data in accordance with GDPR and other applicable laws</li>
                  <li>Your data is secured using industry-standard encryption methods</li>
                  <li>We never share your personal information with unauthorized third parties</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">6. Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  All content on this website, including but not limited to text, graphics, logos, images, 
                  and software, is the property of ExamPaper PDF or its content suppliers and is protected 
                  by international copyright laws.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All trademarks and content are property of their respective owners</li>
                  <li>Unauthorized use of materials may violate copyright, trademark, and other laws</li>
                  <li>Users must obtain written permission before reproducing any content</li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  ExamPaper PDF shall not be liable for any direct, indirect, incidental, consequential, 
                  or punitive damages arising from your use of the website or services.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">8. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms and Conditions, please contact us through 
                  our provided contact information on the website.
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> goldsmith.sir@gmail.com</p>
                  <p><strong>Response Time:</strong> Within 24-48 business hours</p>
                  <p><strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
