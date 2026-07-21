import React from 'react';
import { Link } from 'react-router-dom';

const Payments = () => {
    return (
        <div className="min-h-screen pt-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">Payment Options</h1>
                    <p className="text-gray-600 text-lg">Secure, convenient, and flexible payment methods for your medical needs</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-9">
                    {/* Left Column - Payment Methods */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-3 border-b">Accepted Payment Methods</h2>

                            <div className="space-y-6">
                                {/* Credit/Debit Cards */}
                                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Credit & Debit Cards</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">We accept all major credit and debit cards including Visa, MasterCard, American Express, and RuPay.</p>
                                    <div className="flex space-x-4">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">VISA</span>
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">MasterCard</span>
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">American Express</span>
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">RuPay</span>
                                    </div>
                                </div>

                                {/* UPI */}
                                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18 10h-2V8h2v2zm0-4h-2V4h2v2zm-4 4h-2V8h2v2zm0-4h-2V4h2v2zm-4 4H8V8h2v2zm0-4H8V4h2v2zm8 8H6v-2h12v2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">UPI Payments</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">Quick and secure payments using your favorite UPI apps like Google Pay, PhonePe, Paytm, and BHIM.</p>
                                    <div className="flex space-x-3 flex-wrap gap-2">
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Google Pay</span>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">PhonePe</span>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Paytm</span>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">BHIM UPI</span>
                                    </div>
                                </div>

                                {/* Net Banking */}
                                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Net Banking</h3>
                                    </div>
                                    <p className="text-gray-600">Direct bank transfers from all major Indian banks including SBI, HDFC, ICICI, Axis, and more.</p>
                                </div>

                                {/* Cash on Delivery */}
                                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Cash on Delivery (COD)</h3>
                                    </div>
                                    <p className="text-gray-600">Pay in cash when your medicine/equipment is delivered. Available for orders up to ₹5,000.</p>
                                    <p className="text-sm text-gray-500 mt-2">Note: Additional ₹30 COD charges apply.</p>
                                </div>

                                {/* Digital Wallets */}
                                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-center mb-3">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-9 6H8v1h3v1.67C10.33 13 9.67 14 8 14v2h3c0-1.11.89-2 2-2v-2c-1.11 0-2-.89-2-2zm8 0h-3v1h3v1.67C18.33 13 17.67 14 16 14v2h3c0-1.11.89-2 2-2v-2c-1.11 0-2-.89-2-2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">Digital Wallets</h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">Use your digital wallets for quick payments.</p>
                                    <div className="flex space-x-3 flex-wrap gap-2">
                                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">Amazon Pay</span>
                                        <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">Mobikwik</span>
                                        <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">FreeCharge</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-3 border-b">Payment Security</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">SSL Encrypted</h3>
                                        <p className="text-gray-600 text-sm">All transactions are protected with 256-bit SSL encryption.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">PCI DSS Compliant</h3>
                                        <p className="text-gray-600 text-sm">We adhere to the highest security standards for card payments.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Fraud Protection</h3>
                                        <p className="text-gray-600 text-sm">Advanced fraud detection systems monitor all transactions.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Secure Login</h3>
                                        <p className="text-gray-600 text-sm">Two-factor authentication for account security.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - FAQ & Help */}
                    <div className="lg:col-span-1">
                        {/* Payment FAQ */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-3 border-b">Payment FAQ</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Is it safe to pay online?</h3>
                                    <p className="text-gray-600 text-sm">Yes, we use bank-level encryption and never store your card details.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Are there any transaction charges?</h3>
                                    <p className="text-gray-600 text-sm">No, we don't charge any extra fees for online payments. Only COD has ₹30 charge.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">When will I get my refund?</h3>
                                    <p className="text-gray-600 text-sm">Refunds are processed within 5-7 business days to your original payment method.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Can I change payment method after ordering?</h3>
                                    <p className="text-gray-600 text-sm">Yes, contact customer support before your order is shipped.</p>
                                </div>
                            </div>
                        </div>

                        {/* Need Help Card */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Need Help with Payments?</h2>
                            <p className="text-gray-700 mb-4">Our support team is here to assist you with any payment-related queries.</p>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-bold">📞</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Call Us</p>
                                        <a
                                            href="tel:+918050962861"
                                            className="text-blue-600 font-semibold"
                                            aria-label="Call us at 80509 62861"
                                        >
                                            +91 80509 62861
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-bold">✉️</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Email Us</p>
                                        <a
                                            href="mailto:info@srichakraindia.com"
                                            className="text-blue-600 font-semibold"
                                            aria-label="Email us at info@srichakraindia.com"
                                        >
                                            info@srichakraindia.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                                        <span className="text-blue-600 font-bold">💬</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Emergency</p>
                                        <p className="text-blue-600 font-semibold">Available 24/7</p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/contact" className="mt-6 block">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02]">
                                    Contact Support
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;