import MetaData from '../Layouts/MetaData';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MedicationIcon from '@mui/icons-material/Medication';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import { Link } from 'react-router-dom';

const MedicineDelivery = () => {
    const deliveryFeatures = [
        {
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            title: "Fast Delivery",
            description: "Get your medicines delivered within 24-48 hours across all major cities"
        },
        {
            icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
            title: "Same Day Delivery",
            description: "Express delivery available for urgent medical requirements"
        },
        {
            icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
            title: "Genuine Products",
            description: "100% authentic medicines sourced directly from certified manufacturers"
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Safe Packaging",
            description: "Temperature-controlled and tamper-proof packaging for all medicines"
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            title: "24/7 Support",
            description: "Round-the-clock customer support for all delivery queries"
        },
        {
            icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
            title: "Pan India Coverage",
            description: "Delivering across all states with reliable logistics partners"
        }
    ];

    const deliverySteps = [
        {
            step: "1",
            title: "Search & Select",
            description: "Browse our extensive catalog and add medicines to your cart"
        },
        {
            step: "2",
            title: "Upload Prescription",
            description: "Upload valid prescription for prescription medicines (if required)"
        },
        {
            step: "3",
            title: "Place Order",
            description: "Review your order and proceed to secure checkout"
        },
        {
            step: "4",
            title: "Track & Receive",
            description: "Track your order in real-time and receive at your doorstep"
        }
    ];

    const deliveryOptions = [
        {
            type: "Standard Delivery",
            time: "2-3 Business Days",
            price: "₹49",
            features: ["Pan India Coverage", "Order Tracking", "Safe Packaging"]
        },
        {
            type: "Express Delivery",
            time: "Same Day",
            price: "₹99",
            features: ["Select Cities Only", "Priority Handling", "Real-time Updates"]
        },
        {
            type: "Free Delivery",
            time: "3-5 Business Days",
            price: "FREE",
            features: ["Orders above ₹499", "All Products", "Standard Tracking"],
            highlight: true
        }
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="Medicine Delivery | Sri Chakra India Dental & Medical Equipments Mfg" />

            {/* Back to Home Link */}
            <div className="px-16 pt-16">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                >
                    &lt;&lt; Back to Home
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-blue-400 mb-4 shadow-lg">
                            <LocalShippingIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Medicine    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Delivery Services
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Fast, reliable, and safe medicine delivery to your doorstep. We ensure your health essentials reach you on time, every time.
                        </p>
                    </div>

                    {/* Main Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <MedicationIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                <h2 className="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors duration-300">Our Delivery Promise</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                At Sri Chakra India Dental & Medical Equipments Mfg, we understand that timely access to medicines is crucial for your health. Our delivery network is designed to ensure you receive your orders quickly and safely.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                From prescription medicines to healthcare products, we handle all items with utmost care and maintain the cold chain for temperature-sensitive medicines.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white hover:from-green-700 hover:to-blue-500 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <SpeedIcon sx={{ fontSize: 32, color: 'white' }} />
                                <h2 className="text-2xl font-bold hover:text-green-100 transition-colors duration-300">Quick Delivery Stats</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">98%</p>
                                    <p className="text-green-100 text-sm">On-time Delivery</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">500+</p>
                                    <p className="text-green-100 text-sm">Cities Covered</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">24hrs</p>
                                    <p className="text-green-100 text-sm">Express Delivery</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">100%</p>
                                    <p className="text-green-100 text-sm">Safe Packaging</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Our Delivery</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {deliveryFeatures.map((feature, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                                    <div className="text-green-600 mb-4 flex justify-center">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-center text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {deliverySteps.map((item, index) => (
                                <div key={index} className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 hover:scale-105">
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {item.step}
                                    </div>
                                    <div className="pt-4">
                                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{item.title}</h3>
                                        <p className="text-gray-600 text-center text-sm">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Options Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Delivery Options</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {deliveryOptions.map((option, index) => (
                                <div key={index} className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 hover:scale-105 ${option.highlight ? 'bg-gradient-to-br from-green-600 to-blue-400 text-white border-transparent' : 'bg-white border-gray-100 hover:border-green-200'}`}>
                                    <div className="text-center mb-4">
                                        <h3 className={`text-xl font-bold mb-2 ${option.highlight ? 'text-white' : 'text-gray-900'}`}>{option.type}</h3>
                                        <p className={`text-3xl font-bold ${option.highlight ? 'text-white' : 'text-green-600'}`}>{option.price}</p>
                                        <p className={`text-sm ${option.highlight ? 'text-green-100' : 'text-gray-500'}`}>{option.time}</p>
                                    </div>
                                    <ul className="space-y-2">
                                        {option.features.map((feature, idx) => (
                                            <li key={idx} className={`flex items-center gap-2 text-sm ${option.highlight ? 'text-green-100' : 'text-gray-600'}`}>
                                                <span className={option.highlight ? 'text-white' : 'text-green-600'}>✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coverage Stats */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-400 rounded-2xl shadow-xl p-8 sm:p-12 text-white mb-12">
                        <h2 className="text-2xl font-bold text-center mb-8">Our Delivery Coverage</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">28+</p>
                                <p className="text-green-100">States Covered</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">500+</p>
                                <p className="text-green-100">Cities Served</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">15K+</p>
                                <p className="text-green-100">Pin Codes</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">1M+</p>
                                <p className="text-green-100">Orders Delivered</p>
                            </div>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <LocalPharmacyIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                            <h2 className="text-3xl font-bold text-gray-900">Important Delivery Information</h2>
                        </div>
                        <div className="space-y-4 text-gray-700">
                            <p>✓ <span className="font-semibold">Prescription Required:</span> Prescription medicines will only be dispatched after prescription verification.</p>
                            <p>✓ <span className="font-semibold">Temperature Control:</span> Cold chain medicines are shipped in temperature-controlled packaging.</p>
                            <p>✓ <span className="font-semibold">Tracking Available:</span> Track your order in real-time through our website or app.</p>
                            <p>✓ <span className="font-semibold">Contactless Delivery:</span> Safe and hygienic contactless delivery options available.</p>
                            <p>✓ <span className="font-semibold">Return Policy:</span> Easy returns for damaged or incorrect items within 7 days.</p>
                            <p>✓ <span className="font-semibold">Customer Support:</span> 24/7 helpline available for delivery-related queries at 80509 62861.</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Order?</h3>
                        <p className="text-gray-600 mb-6">Browse our products and get your medicines delivered to your doorstep</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <MedicationIcon />
                            Browse Products
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MedicineDelivery;
