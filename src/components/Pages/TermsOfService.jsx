import MetaData from '../Layouts/MetaData';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import WarningIcon from '@mui/icons-material/Warning';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    const termsSections = [
        {
            icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
            title: "Medical Products & Services",
            content: [
                "All dental and medical equipment sold are certified and authentic from verified manufacturers",
                "Prescription medicines require valid prescription from a licensed healthcare professional",
                "Medical equipment specifications and usage guidelines must be followed as provided",
                "Dental products are intended for professional use or as directed by dental professionals",
                "Healthcare consultations are provided by qualified medical professionals only"
            ]
        },
        {
            icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
            title: "Ordering & Purchase Terms",
            content: [
                "Orders are subject to product availability and prescription verification (where applicable)",
                "Prices are displayed in Indian Rupees and include applicable taxes unless stated otherwise",
                "We reserve the right to cancel orders if products are unavailable or pricing errors occur",
                "Bulk orders for dental clinics and hospitals may be subject to special terms and pricing",
                "Account registration is required for placing orders and tracking deliveries"
            ]
        },
        {
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            title: "Delivery Terms",
            content: [
                "Delivery times are estimated and may vary based on location and product availability",
                "Medical equipment deliveries include installation guidance where applicable",
                "Temperature-sensitive medicines are shipped in appropriate cold-chain packaging",
                "Recipient must verify product condition upon delivery and report damages immediately",
                "Delivery to certain remote areas may incur additional charges or extended timelines"
            ]
        },
        {
            icon: <PaymentIcon sx={{ fontSize: 40 }} />,
            title: "Payment Terms",
            content: [
                "We accept major credit/debit cards, UPI, net banking, and cash on delivery (where available)",
                "All online payments are processed through secure, encrypted payment gateways",
                "Invoices are generated for all purchases and sent to your registered email",
                "EMI options may be available for high-value dental and medical equipment purchases",
                "Refunds are processed to the original payment method within 7-10 business days"
            ]
        },
        {
            icon: <AssignmentReturnIcon sx={{ fontSize: 40 }} />,
            title: "Returns & Refunds Policy",
            content: [
                "Medical equipment can be returned within 7 days if unopened and in original packaging",
                "Medicines and consumables cannot be returned due to health and safety regulations",
                "Defective products will be replaced or refunded after verification",
                "Custom dental equipment orders are non-refundable once manufacturing begins",
                "Return shipping costs may apply unless the return is due to our error"
            ]
        },
        {
            icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
            title: "Quality Assurance",
            content: [
                "All products undergo quality checks before dispatch",
                "Medical equipment comes with manufacturer warranty as specified",
                "Dental instruments meet ISI/ISO quality standards",
                "Medicines are sourced directly from authorized distributors",
                "Product authenticity can be verified through our customer support"
            ]
        }
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="Terms of Service | Sri Chakra India Dental & Medical Equipments Mfg" />

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
                            <GavelIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Terms of <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Service
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Please read these terms carefully before using Sri Chakra India Dental & Medical Equipments Mfg services.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Last Updated: February 2025</p>
                    </div>

                    {/* Introduction Card */}
                    <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white mb-12 hover:from-green-700 hover:to-blue-500 transition-all duration-300">
                        <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                        <p className="leading-relaxed mb-4">
                            Welcome to Sri Chakra India Dental & Medical Equipments Mfg. By accessing our website and using our
                            dental equipment, medical supplies, medicine delivery, and healthcare consultation services, you agree
                            to be bound by these Terms of Service.
                        </p>
                        <p className="leading-relaxed">
                            These terms govern your use of our platform for purchasing dental instruments, medical equipment,
                            prescription medicines, and accessing our healthcare services. If you do not agree with any part of
                            these terms, please refrain from using our services.
                        </p>
                    </div>

                    {/* Terms Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {termsSections.map((section, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 hover:scale-105">
                                <div className="text-green-600 mb-4 flex justify-center">
                                    {section.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">{section.title}</h3>
                                <ul className="space-y-2">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} className="text-gray-600 text-sm flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer Section */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-8 mb-12">
                        <div className="flex items-start gap-4">
                            <WarningIcon sx={{ fontSize: 40, color: '#ca8a04' }} />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Medical Disclaimer</h2>
                                <div className="space-y-3 text-gray-700">
                                    <p>✓ <span className="font-semibold">Not Medical Advice:</span> Information on this platform is for general guidance only and should not replace professional medical consultation.</p>
                                    <p>✓ <span className="font-semibold">Prescription Requirement:</span> Prescription medicines will only be dispensed against valid prescriptions from licensed medical practitioners.</p>
                                    <p>✓ <span className="font-semibold">Professional Use:</span> Certain dental and medical equipment is intended for use by trained healthcare professionals only.</p>
                                    <p>✓ <span className="font-semibold">Emergency Situations:</span> In case of medical emergencies, please contact emergency services immediately rather than relying on our platform.</p>
                                    <p>✓ <span className="font-semibold">Product Usage:</span> Always follow manufacturer guidelines and consult healthcare professionals for proper usage of medical equipment.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Responsibilities */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>✓ <span className="font-semibold">Account Security:</span> You are responsible for maintaining the confidentiality of your account credentials.</p>
                            <p>✓ <span className="font-semibold">Accurate Information:</span> Provide accurate personal, medical, and prescription information when using our services.</p>
                            <p>✓ <span className="font-semibold">Legal Compliance:</span> Use our platform in compliance with all applicable Indian laws and healthcare regulations.</p>
                            <p>✓ <span className="font-semibold">Proper Usage:</span> Use purchased medical equipment and dental products as intended and directed.</p>
                            <p>✓ <span className="font-semibold">Timely Communication:</span> Report any issues, defects, or concerns to our customer support promptly.</p>
                        </div>
                    </div>

                    {/* Limitation of Liability */}
                    <div className="bg-gray-100 rounded-2xl shadow-lg p-8 mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Sri Chakra India Dental & Medical Equipments Mfg shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages arising from your use of our services, products, or platform.
                            Our maximum liability is limited to the amount paid for the specific product or service in question.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We are not responsible for any adverse health effects resulting from improper use of medical equipment
                            or medicines, or failure to follow prescribed guidelines and professional medical advice.
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-400 rounded-2xl shadow-xl p-8 sm:p-12 text-white">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
                            <p className="mb-6">If you have any questions about these Terms of Service, please contact our legal and support team:</p>
                            <div className="space-y-2">
                                <p>📧 Email: legal@srichakraindia.com</p>
                                <p>📞 Phone: 80509 62861</p>
                                <p>🏢 Address: Sri Chakra India Dental & Medical Equipments Mfg, Medical Plaza & Wellness Complex</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4 mt-6">
                                <Link
                                    to="/contact"
                                    className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-300"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    to="/privacy-policy"
                                    className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
                                >
                                    View Privacy Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TermsOfService;
