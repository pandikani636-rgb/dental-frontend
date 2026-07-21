import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Return Policy</h1>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Return Policy</h2>
          <p className="text-gray-600 mb-4">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, 
            we offer a 30-day return policy from the date of delivery for most items.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Eligibility for Returns</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Items must be returned within 30 days of delivery</li>
            <li>Products must be unused, in original packaging with all tags attached</li>
            <li>Items must be in the same condition as received</li>
            <li>Proof of purchase (order number) is required</li>
            <li>Personalized or customized items cannot be returned</li>
            <li>Perishable goods and sealed consumables are not returnable</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-3 text-gray-600">
            <li>Log into your account and go to "Order History"</li>
            <li>Select the item(s) you wish to return</li>
            <li>Choose the reason for return</li>
            <li>Print the prepaid return shipping label (if applicable)</li>
            <li>Package the item securely with original packaging</li>
            <li>Drop off at designated carrier location</li>
          </ol>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Refund Process</h2>
          <p className="text-gray-600 mb-3">
            Once we receive your return and verify its condition:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Refunds are processed within 5-7 business days</li>
            <li>Refunds are issued to the original payment method</li>
            <li>Shipping charges are non-refundable (unless the return is due to our error)</li>
            <li>You will receive email confirmation once refund is processed</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Damaged or Defective Items</h2>
          <p className="text-gray-600">
            If you receive a damaged or defective item, please contact our customer service within 
            48 hours of delivery. We will arrange for a replacement or refund at no additional cost.
          </p>
        </section>

        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800">
            <strong>Need Help?</strong> Contact our customer service at returns@example.com 
            or call +1 (800) 123-4567 for assistance with returns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;