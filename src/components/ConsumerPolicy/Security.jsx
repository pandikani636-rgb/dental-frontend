import React from 'react';

const Security = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Security</h1>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Commitment to Security</h2>
          <p className="text-gray-600">
            We take the security of your personal and payment information seriously. We employ 
            industry-standard security measures to protect your data during transmission and storage.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Encryption</h2>
          <div className="flex items-start mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">SSL/TLS Encryption</h3>
              <p className="text-gray-600">
                All data transmitted between your browser and our servers is encrypted using 
                256-bit SSL/TLS encryption, the same technology used by banks and financial institutions.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Security</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>We do not store your complete credit card information on our servers</li>
            <li>Payment processing is handled by PCI-DSS compliant third-party processors</li>
            <li>Tokenization is used for recurring payments</li>
            <li>3D Secure authentication is supported for added protection</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Protection</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Two-Factor Authentication</h3>
              <p className="text-gray-600 text-sm">
                Optional 2FA adds an extra layer of security to your account
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Secure Password Requirements</h3>
              <p className="text-gray-600 text-sm">
                Minimum password complexity requirements enforced
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Session Management</h3>
              <p className="text-gray-600 text-sm">
                Automatic logout after periods of inactivity
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Suspicious Activity Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Automated systems detect and alert on unusual login patterns
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Physical Security</h2>
          <p className="text-gray-600 mb-3">
            Our servers and data centers are protected by:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>24/7 physical security monitoring</li>
            <li>Biometric access controls</li>
            <li>Redundant power and network infrastructure</li>
            <li>Regular security audits and penetration testing</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How You Can Help</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 mb-2"><strong>Security Tips:</strong></p>
            <ul className="list-disc pl-5 space-y-1 text-blue-800 text-sm">
              <li>Never share your password with anyone</li>
              <li>Log out after completing your session, especially on shared computers</li>
              <li>Use strong, unique passwords for your account</li>
              <li>Keep your devices updated with the latest security patches</li>
              <li>Be cautious of phishing emails claiming to be from us</li>
            </ul>
          </div>
        </section>

        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-800">
            <strong>Security Questions?</strong> If you suspect any security issues with your account, 
            please contact us immediately at security@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Security;