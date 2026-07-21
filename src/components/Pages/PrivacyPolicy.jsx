import MetaData from '../Layouts/MetaData';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GppGoodIcon from '@mui/icons-material/GppGood';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    const privacySections = [
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Information We Collect",
            content: [
                "Personal identification information (Name, email, phone number, address)",
                "Medical information required for prescription processing",
                "Payment and billing information for order processing",
                "Device and browser information for website optimization",
                "Order history and preferences to improve your experience"
            ]
        },
        {
            icon: <LockIcon sx={{ fontSize: 40 }} />,
            title: "How We Use Your Information",
            content: [
                "Process and fulfill your medical equipment and dental product orders",
                "Verify prescriptions and ensure safe medication delivery",
                "Communicate order updates, delivery status, and important health notifications",
                "Improve our dental and medical services based on your feedback",
                "Maintain compliance with healthcare regulations and legal requirements"
            ]
        },
        {
            icon: <VisibilityOffIcon sx={{ fontSize: 40 }} />,
            title: "Data Protection & Security",
            content: [
                "End-to-end encryption for all sensitive medical and personal data",
                "Secure payment processing through certified payment gateways",
                "Regular security audits to protect your health information",
                "Strict access controls limiting who can view your medical records",
                "Compliance with healthcare data protection standards"
            ]
        },
        {
            icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
            title: "Your Rights & Choices",
            content: [
                "Access, update, or delete your personal and medical information",
                "Opt-out of promotional communications at any time",
                "Request a copy of all data we hold about you",
                "Withdraw consent for non-essential data processing",
                "Lodge complaints with relevant data protection authorities"
            ]
        },
        {
            icon: <GppGoodIcon sx={{ fontSize: 40 }} />,
            title: "Data Sharing & Third Parties",
            content: [
                "We never sell your personal or medical information to third parties",
                "Data is shared only with verified healthcare partners for prescription verification",
                "Delivery partners receive only necessary shipping information",
                "Legal authorities may access data when required by law",
                "Third-party service providers are bound by strict confidentiality agreements"
            ]
        },
        {
            icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />,
            title: "Medical Data Handling",
            content: [
                "Prescription data is handled by licensed pharmacists only",
                "Medical records are stored in secure, HIPAA-compliant systems",
                "Health information is never used for marketing without explicit consent",
                "Dental and medical product recommendations are based on verified prescriptions",
                "Emergency contact information is kept confidential and used only when necessary"
            ]
        }
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="Privacy Policy | Sri Chakra India Dental & Medical Equipments Mfg" />

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
                            <SecurityIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Privacy <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Policy
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            At Sri Chakra India Dental & Medical Equipments Mfg, your privacy and the security of your medical information is our top priority.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Last Updated: February 2025</p>
                    </div>

                    {/* Introduction Card */}
                    <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white mb-12 hover:from-green-700 hover:to-blue-500 transition-all duration-300">
                        <h2 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h2>
                        <p className="leading-relaxed mb-4">
                            Sri Chakra India Dental & Medical Equipments Mfg is committed to protecting your personal and medical information.
                            This Privacy Policy explains how we collect, use, store, and protect your data when you use our dental and
                            medical equipment services, medicine delivery, and healthcare consultation platforms.
                        </p>
                        <p className="leading-relaxed">
                            We understand that your health information is sensitive and personal. Our privacy practices are designed to
                            comply with all applicable healthcare data protection regulations and ensure your complete peace of mind.
                        </p>
                    </div>

                    {/* Privacy Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {privacySections.map((section, index) => (
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

                    {/* Cookie Policy */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>We use cookies and similar technologies to enhance your browsing experience on our dental and medical equipment platform:</p>
                            <p>✓ <span className="font-semibold">Essential Cookies:</span> Required for website functionality, secure login, and order processing.</p>
                            <p>✓ <span className="font-semibold">Analytics Cookies:</span> Help us understand how you use our services to improve your experience.</p>
                            <p>✓ <span className="font-semibold">Preference Cookies:</span> Remember your settings and preferences for future visits.</p>
                            <p className="text-sm text-gray-500 mt-4">You can manage cookie preferences through your browser settings at any time.</p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-400 rounded-2xl shadow-xl p-8 sm:p-12 text-white">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
                            <p className="mb-6">If you have any questions about this Privacy Policy or how we handle your medical data, please contact us:</p>
                            <div className="space-y-2">
                                <p>📧 Email: privacy@srichakraindia.com</p>
                                <p>📞 Phone: 80509 62861</p>
                                <p>🏢 Address: Sri Chakra India Dental & Medical Equipments Mfg, Medical Plaza & Wellness Complex</p>
                            </div>
                            <Link
                                to="/contact"
                                className="inline-block mt-6 px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;
