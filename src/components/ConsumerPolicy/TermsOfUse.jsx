import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Terms of Use</h1>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">
            Welcome to our website. By accessing and using this website, you accept and agree to be bound 
            by the terms and provision of this agreement.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing this website, you are agreeing to be bound by these website Terms and Conditions 
            of Use, all applicable laws and regulations, and agree that you are responsible for compliance 
            with any applicable local laws.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Use License</h2>
          <p className="text-gray-600 mb-3">
            Permission is granted to temporarily download one copy of the materials on our website for 
            personal, non-commercial transitory viewing only.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
            <li>Transfer the materials to another person or "mirror" the materials</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Account Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>You must provide accurate and complete registration information</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You are responsible for all activities under your account</li>
            <li>You must notify us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Product Information & Pricing</h2>
          <p className="text-gray-600 mb-3">
            We strive to ensure all information on our website is accurate. However:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Prices are subject to change without notice</li>
            <li>Product images are for illustrative purposes only</li>
            <li>We reserve the right to limit quantities</li>
            <li>Errors in pricing or product descriptions may be corrected</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-600">
            In no event shall we or our suppliers be liable for any damages arising out of the use 
            or inability to use the materials on our website, even if we have been notified orally 
            or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Governing Law</h2>
          <p className="text-gray-600">
            These terms and conditions are governed by and construed in accordance with the laws 
            of [Your State/Country] and you irrevocably submit to the exclusive jurisdiction of 
            the courts in that location.
          </p>
        </section>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <p className="text-yellow-800">
            <strong>Last Updated:</strong> January 1, 2024<br/>
            We reserve the right to update these Terms of Use at any time. Please review this page 
            periodically for changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;