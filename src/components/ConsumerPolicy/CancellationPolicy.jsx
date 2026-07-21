import React from 'react';

const CancellationPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Cancellation Policy</h1>
      
      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">
            We understand that plans change. Our cancellation policy is designed to be fair to both 
            our customers and our business operations.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Cancellation Timeframes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancellation Availability</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Order Placed (Not Processed)</td>
                  <td className="px-4 py-3 text-sm text-green-600">✅ Yes</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Full Refund</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Order Processing</td>
                  <td className="px-4 py-3 text-sm text-yellow-600">⚠️ May be possible</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Partial Refund</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Shipped/In Transit</td>
                  <td className="px-4 py-3 text-sm text-red-600">❌ Not possible</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Use Return Policy</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Delivered</td>
                  <td className="px-4 py-3 text-sm text-red-600">❌ Not possible</td>
                  <td className="px-4 py-3 text-sm text-gray-900">Use Return Policy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Cancel an Order</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-gray-700">Log Into Your Account</h3>
                <p className="text-gray-600 text-sm">Go to "My Orders" in your account dashboard</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-gray-700">Select Order to Cancel</h3>
                <p className="text-gray-600 text-sm">Choose the order you wish to cancel</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-gray-700">Click "Cancel Order"</h3>
                <p className="text-gray-600 text-sm">Select reason for cancellation from dropdown</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold text-gray-700">Confirmation</h3>
                <p className="text-gray-600 text-sm">You'll receive email confirmation of cancellation</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cancellation Fees</h2>
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> If your order has already entered the processing stage, 
              a cancellation fee may apply to cover processing costs.
            </p>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>No fee for cancellations made within 1 hour of ordering</li>
            <li>5% processing fee for cancellations after processing begins</li>
            <li>Customized or personalized items may have higher cancellation fees</li>
            <li>Express/same-day delivery orders may not be cancellable</li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Refund After Cancellation</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Refund Method</span>
              <span className="font-medium text-gray-900">Original payment method</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Processing Time</span>
              <span className="font-medium text-gray-900">3-10 business days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Bank/Credit Card Posting</span>
              <span className="font-medium text-gray-900">Additional 2-5 business days</span>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Circumstances</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-700">Backordered Items</h3>
              <p className="text-gray-600 text-sm">Can be cancelled anytime before shipping</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-700">Pre-orders</h3>
              <p className="text-gray-600 text-sm">Cancellable until item is released/shipped</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-700">Digital Products</h3>
              <p className="text-gray-600 text-sm">Non-refundable once accessed/downloaded</p>
            </div>
          </div>
        </section>

        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800">
            <strong>Need Immediate Assistance?</strong> For urgent cancellation requests outside 
            business hours, email us at cancellations@example.com with your order number in the 
            subject line.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;