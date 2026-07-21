// ShippingDetails.jsx
import React from 'react';

const ShippingDetails = () => {
  const shippingSteps = [
    {
      step: 1,
      title: 'Add to Cart',
      description: 'Select your items and add them to your shopping cart.',
      time: 'Immediate'
    },
    {
      step: 2,
      title: 'Checkout Process',
      description: 'Proceed to checkout, enter your shipping address, and select payment method.',
      time: '5-10 minutes'
    },
    {
      step: 3,
      title: 'Order Confirmation',
      description: 'You will receive an email confirmation with your order details and estimated delivery date.',
      time: 'Within 15 minutes'
    },
    {
      step: 4,
      title: 'Order Processing',
      description: 'We verify your order, check inventory, and prepare your items for shipping.',
      time: '1-2 business days'
    },
    {
      step: 5,
      title: 'Package Preparation',
      description: 'Your items are carefully packed and labeled for shipment.',
      time: '1 business day'
    },
    {
      step: 6,
      title: 'Handover to Courier',
      description: 'Package is handed over to our shipping partner for delivery.',
      time: 'Same day after 5 PM'
    },
    {
      step: 7,
      title: 'In Transit',
      description: 'Your package travels through the shipping network to your local delivery center.',
      time: '2-5 business days'
    },
    {
      step: 8,
      title: 'Out for Delivery',
      description: 'Package is loaded onto delivery vehicle and dispatched to your address.',
      time: '1 business day'
    },
    {
      step: 9,
      title: 'Delivery',
      description: 'Package is delivered to your doorstep. You may need to sign for receipt.',
      time: 'Same day (by 8 PM)'
    },
    {
      step: 10,
      title: 'Delivery Confirmation',
      description: 'You receive email/SMS confirmation of successful delivery.',
      time: 'Within 1 hour of delivery'
    }
  ];

  const deliveryTimeline = {
    standard: '5-7 business days',
    express: '2-3 business days',
    overnight: 'Next business day'
  };

  const importantNotes = [
    'Business days are Monday to Friday, excluding holidays',
    'Delivery times start after order processing is complete',
    'You will receive tracking information once your order ships',
    'Someone must be available to receive the package',
    'For issues, contact support within 48 hours of delivery'
  ];

  return (
    <div className="shipping-details p-9">
      <h2 className="text-xl font-bold mb-4">How Shipping Works</h2>
      
      {/* Quick Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Quick Summary:</h3>
        <p>From cart to delivery, your order typically takes <strong>5-10 business days</strong> depending on your location and shipping method.</p>
      </div>

      {/* Step-by-Step Process */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Step-by-Step Shipping Process:</h3>
        <div className="space-y-4">
          {shippingSteps.map((step) => (
            <div key={step.step} className="flex items-start border-l-4 border-blue-500 pl-4 py-2">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                {step.step}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
                <span className="text-xs text-gray-500 mt-1 block">Time: {step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Timeline */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Estimated Delivery Times:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-3">
            <h4 className="font-medium">Standard Shipping</h4>
            <p className="text-blue-600 font-bold">{deliveryTimeline.standard}</p>
            <p className="text-sm text-gray-600">Free on orders over $50</p>
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium">Express Shipping</h4>
            <p className="text-blue-600 font-bold">{deliveryTimeline.express}</p>
            <p className="text-sm text-gray-600">$9.99 flat rate</p>
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium">Overnight Shipping</h4>
            <p className="text-blue-600 font-bold">{deliveryTimeline.overnight}</p>
            <p className="text-sm text-gray-600">$19.99 flat rate</p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 p-6 m-4 rounded-lg">
        <h3 className="font-semibold mb-2">Important Notes:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {importantNotes.map((note, index) => (
            <li key={index} className="text-sm">{note}</li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      {/* <div className="mt-6 text-center text-sm text-gray-600">
        <p>Need help? Contact our shipping team at <strong>shipping@example.com</strong> or call <strong>1-800-SHIP-123</strong></p>
      </div> */}
    </div>
  );
};

export default ShippingDetails;