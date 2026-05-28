import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="size-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-foreground">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to A&S (Aman & Sons) ("we," "us," "our," or "Company"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and mobile application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (www.amanandsons.com), mobile application, and related services.
            </p>
            <p className="leading-relaxed">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services. By accessing and using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>
          </section>

          {/* Information Collection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">2.1 Information You Provide Directly</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Registration Information:</strong> When you create an account, we collect your name, email address, phone number, password, and profile information.</li>
                  <li><strong>Address Information:</strong> Shipping and billing addresses, including street address, city, state, postal code, and country.</li>
                  <li><strong>Payment Information:</strong> Credit/debit card details, UPI information, and other payment method details (processed securely through third-party payment providers).</li>
                  <li><strong>Order Information:</strong> Details about products you purchase, including quantity, price, color, size, and delivery preferences.</li>
                  <li><strong>Communication:</strong> Messages, reviews, ratings, feedback, and customer support inquiries you send to us.</li>
                  <li><strong>Preferences:</strong> Wishlist items, product preferences, size preferences, and communication preferences.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2.2 Information Collected Automatically</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address, and device identifiers.</li>
                  <li><strong>Usage Information:</strong> Pages visited, time spent on pages, search queries, clicks, and navigation patterns.</li>
                  <li><strong>Location Information:</strong> General location derived from IP address (not precise GPS location without permission).</li>
                  <li><strong>Cookies and Tracking:</strong> Information collected through cookies, pixels, web beacons, and similar technologies.</li>
                  <li><strong>Log Data:</strong> Server logs containing access times, pages viewed, referrer information, and error messages.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2.3 Information from Third Parties</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Payment processors and financial institutions</li>
                  <li>Shipping and delivery partners</li>
                  <li>Social media platforms (if you link your account)</li>
                  <li>Third-party analytics providers</li>
                  <li>Customer service platforms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use of Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="leading-relaxed">We use the collected information for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Order Processing:</strong> To process, fulfill, and deliver your orders</li>
              <li><strong>Account Management:</strong> To manage your account, provide customer support, and respond to inquiries</li>
              <li><strong>Communication:</strong> To send order confirmations, shipping updates, and customer service communications</li>
              <li><strong>Personalization:</strong> To personalize your experience and recommend products based on preferences</li>
              <li><strong>Marketing:</strong> To send promotional emails, newsletters, and marketing communications (with your consent)</li>
              <li><strong>Analytics:</strong> To analyze usage patterns, improve our services, and conduct market research</li>
              <li><strong>Security:</strong> To detect, prevent, and address fraud, abuse, and security issues</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms and conditions</li>
              <li><strong>Cookies:</strong> To enhance user experience, remember preferences, and track website performance</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. How We Share Your Information</h2>
            
            <div className="space-y-4 ml-4">
              <p className="leading-relaxed">We do not sell, trade, or rent your personal information to third parties. However, we may share information in the following circumstances:</p>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">4.1 Service Providers</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We share information with third-party service providers who perform services on our behalf, including payment processors, shipping companies, email service providers, customer support platforms, and analytics providers. These providers are contractually obligated to use your information only as necessary to provide services to us.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4.2 Business Transfers</h3>
                <p className="leading-relaxed text-muted-foreground">
                  If we are involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change and any choices you may have regarding your information.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4.3 Legal Requirements</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We may disclose your information if required by law or if we have a good faith belief that disclosure is necessary to protect our rights, your safety, or the safety of others.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4.4 With Your Consent</h3>
                <p className="leading-relaxed text-muted-foreground">
                  We may share your information with third parties when you explicitly consent to such sharing.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical, administrative, and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Secure password storage using encryption algorithms</li>
              <li>Regular security audits and assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Firewalls and intrusion detection systems</li>
              <li>Employee training on data protection practices</li>
            </ul>
            <p className="leading-relaxed mt-4">
              However, no method of transmission over the Internet is completely secure. While we strive to protect your information, we cannot guarantee absolute security. You use our services at your own risk.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Cookies and Tracking Technologies</h2>
            <p className="leading-relaxed">
              We use cookies, web beacons, and similar tracking technologies to enhance your experience, remember preferences, and analyze website usage. Types of cookies include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Essential Cookies:</strong> Necessary for core functionality and security</li>
              <li><strong>Performance Cookies:</strong> Track usage patterns to improve performance</li>
              <li><strong>Functional Cookies:</strong> Remember preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Used for targeted advertising and campaigns</li>
            </ul>
            <p className="leading-relaxed mt-4">
              You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our services.
            </p>
          </section>

          {/* User Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Your Privacy Rights and Choices</h2>
            <p className="leading-relaxed">Depending on your location, you may have certain rights regarding your personal information:</p>
            
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Right to Access:</strong> You can request a copy of the personal information we hold about you</li>
              <li><strong>Right to Correction:</strong> You can request corrections to inaccurate or incomplete information</li>
              <li><strong>Right to Deletion:</strong> You can request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Right to Opt-Out:</strong> You can opt-out of marketing communications and certain data uses</li>
              <li><strong>Right to Data Portability:</strong> You can request your data in a portable format</li>
              <li><strong>Right to Object:</strong> You can object to certain processing activities</li>
              <li><strong>Right to Withdraw Consent:</strong> You can withdraw previously given consent</li>
            </ul>

            <p className="leading-relaxed mt-4">
              To exercise these rights, contact us at helloamanbhati@gmail.com. We will respond within 30 days of receiving your request.
            </p>
          </section>

          {/* Retention */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods vary depending on the purpose:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Account Information:</strong> For the duration of your account or as required by law</li>
              <li><strong>Transaction Data:</strong> For at least 7 years for accounting and tax purposes</li>
              <li><strong>Marketing Communications:</strong> Until you opt-out or request deletion</li>
              <li><strong>Log Data:</strong> Typically retained for 90 days unless required longer</li>
            </ul>
            <p className="leading-relaxed mt-4">
              Once the retention period expires, we securely delete or anonymize your information unless further retention is required by law.
            </p>
          </section>

          {/* Children */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will promptly delete such information. If you believe we have collected information from a child under 13, please contact us immediately at helloamanbhati@gmail.com.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Third-Party Links</h2>
            <p className="leading-relaxed">
              Our website and application may contain links to third-party websites and services that are not operated by us. This Privacy Policy applies only to information collected through our services. We are not responsible for the privacy practices of third-party websites or services. We encourage you to review the privacy policies of any third-party sites before providing your information.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. International Data Transfers</h2>
            <p className="leading-relaxed">
              Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country. By using our services, you consent to the transfer of your information to countries outside your country of residence, which may not have the same data protection laws.
            </p>
          </section>

          {/* Updates */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Changes to This Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by updating the "Last updated" date at the top of this policy and, where appropriate, by providing you with additional notice (such as adding a notice on our homepage or sending you an email). Your continued use of our services after changes become effective constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-2 ml-4 mt-4">
              <p><strong>A&S (Aman & Sons)</strong></p>
              <p className="text-muted-foreground">
                Email: helloamanbhati@gmail.com<br/>
                Email: support@amanandsons.com<br/>
                Phone: +91-9358587006<br/>
                Address: Rajasthan, Jodhpur
              </p>
            </div>
            <p className="leading-relaxed mt-4">
              We will endeavor to respond to your inquiry within 30 days. If you are not satisfied with our response, you may have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>

          {/* Footer */}
          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy is effective as of the date last updated and applies to all users of A&S services. Thank you for trusting us with your information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
