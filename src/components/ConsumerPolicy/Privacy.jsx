import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Privacy</h1>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">
            Your privacy is important to us. This privacy policy explains what personal data we collect 
            from you and how we use it.
          </p>
          <p className="text-gray-600">
            <strong>Effective Date:</strong> January 1, 2024
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Name, email address, and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Account credentials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on site</li>
                <li>Referring website or search terms</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Order Processing</h3>
              <p className="text-gray-600 text-sm">To process and fulfill your purchases</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Customer Service</h3>
              <p className="text-gray-600 text-sm">To provide support and respond to inquiries</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Personalization</h3>
              <p className="text-gray-600 text-sm">To customize your shopping experience</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Marketing</h3>
              <p className="text-gray-600 text-sm">To send promotional emails (with your consent)</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Information Sharing</h2>
          <p className="text-gray-600 mb-3">
            We do not sell your personal information. We may share information with:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Shipping carriers to deliver your orders</li>
            <li>Payment processors to complete transactions</li>
            <li>Service providers who assist in our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cookies and Tracking Technologies</h2>
          <p className="text-gray-600 mb-3">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Remember your preferences and login information</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Provide personalized recommendations</li>
            <li>Improve our services</li>
          </ul>
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-blue-800 text-sm">
              You can control cookie settings through your browser. However, disabling cookies 
              may affect your ability to use certain features of our website.
            </p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h2>
          <p className="text-gray-600 mb-3">
            Depending on your location, you may have the following rights regarding your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to request deletion of your data</li>
            <li>Right to opt-out of marketing communications</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Retention</h2>
          <p className="text-gray-600">
            We retain your personal information only for as long as necessary to fulfill the purposes 
            for which it was collected, comply with legal obligations, resolve disputes, and enforce 
            our agreements.
          </p>
        </section>

        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700">
            <strong>Contact Us:</strong> For privacy-related questions or to exercise your rights, 
            please contact our Privacy Officer at privacy@example.com or write to us at:
            <br/><br/>
            Privacy Office<br/>
            123 Commerce Street<br/>
            City, State 12345<br/>
            United States
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;