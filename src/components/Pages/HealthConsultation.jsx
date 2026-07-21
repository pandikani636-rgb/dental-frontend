import MetaData from '../Layouts/MetaData';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Link } from 'react-router-dom';

const HealthConsultation = () => {
    const consultationFeatures = [
        {
            icon: <PersonIcon sx={{ fontSize: 40 }} />,
            title: "Expert Doctors",
            description: "Consult with experienced and certified healthcare professionals"
        },
        {
            icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
            title: "24/7 Availability",
            description: "Get medical advice anytime, day or night"
        },
        {
            icon: <VideocamIcon sx={{ fontSize: 40 }} />,
            title: "Video Consultation",
            description: "Face-to-face consultations from the comfort of your home"
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Private & Secure",
            description: "Your health information is always kept confidential"
        },
        {
            icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />,
            title: "E-Prescriptions",
            description: "Digital prescriptions sent directly to your registered email"
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            title: "Follow-up Support",
            description: "Continuous support and follow-up consultations"
        }
    ];

    const consultationTypes = [
        {
            title: "General Consultation",
            description: "For common health issues, wellness advice, and general medical queries",
            duration: "15-20 mins",
            price: "₹299",
            icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "Specialist Consultation",
            description: "Connect with specialists for specific health conditions",
            duration: "20-30 mins",
            price: "₹499",
            icon: <MedicalServicesIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "Dental Consultation",
            description: "Expert advice for dental issues and oral health care",
            duration: "15-25 mins",
            price: "₹399",
            icon: <HealthAndSafetyIcon sx={{ fontSize: 32 }} />
        }
    ];

    const consultationModes = [
        {
            icon: <VideocamIcon sx={{ fontSize: 48 }} />,
            title: "Video Call",
            description: "High-quality video consultation with doctors"
        },
        {
            icon: <PhoneIcon sx={{ fontSize: 48 }} />,
            title: "Voice Call",
            description: "Quick phone consultations for urgent queries"
        },
        {
            icon: <ChatIcon sx={{ fontSize: 48 }} />,
            title: "Chat",
            description: "Text-based consultation for non-urgent matters"
        }
    ];

    const howItWorks = [
        {
            step: "1",
            title: "Choose Specialist",
            description: "Select the type of doctor or specialist you need"
        },
        {
            step: "2",
            title: "Book Appointment",
            description: "Pick a convenient time slot for your consultation"
        },
        {
            step: "3",
            title: "Make Payment",
            description: "Secure payment through multiple options"
        },
        {
            step: "4",
            title: "Start Consultation",
            description: "Connect with your doctor via video, call, or chat"
        }
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="Health Consultation | Sri Chakra India Dental & Medical Equipments Mfg" />

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
                            <HealthAndSafetyIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Health    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Consultation Services
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Connect with qualified healthcare professionals from anywhere. Get expert medical advice, prescriptions, and follow-up care – all online.
                        </p>
                    </div>

                    {/* Main Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <LocalHospitalIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                <h2 className="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors duration-300">Why Online Consultation?</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Skip the waiting room hassle and consult with doctors from the comfort of your home. Our online consultation service connects you with verified healthcare professionals who can diagnose, advice, and prescribe medications.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Whether it's a minor health concern or you need specialist advice, our platform makes healthcare accessible and convenient for everyone.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white hover:from-green-700 hover:to-blue-500 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <VerifiedUserIcon sx={{ fontSize: 32, color: 'white' }} />
                                <h2 className="text-2xl font-bold hover:text-green-100 transition-colors duration-300">Our Doctors</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">50+</p>
                                    <p className="text-green-100 text-sm">Verified Doctors</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">15+</p>
                                    <p className="text-green-100 text-sm">Specializations</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">10K+</p>
                                    <p className="text-green-100 text-sm">Consultations</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">4.8/5</p>
                                    <p className="text-green-100 text-sm">Patient Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Modes */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Choose Your Consultation Mode</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {consultationModes.map((mode, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200 hover:scale-105 text-center">
                                    <div className="text-green-600 mb-4 flex justify-center">
                                        {mode.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{mode.title}</h3>
                                    <p className="text-gray-600 text-sm">{mode.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Consultation Types */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Consultation Packages</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {consultationTypes.map((type, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-green-200 hover:scale-105">
                                    <div className="text-green-600 mb-4 flex justify-center">
                                        {type.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{type.title}</h3>
                                    <p className="text-gray-600 text-center text-sm mb-4">{type.description}</p>
                                    <div className="text-center border-t border-gray-100 pt-4">
                                        <p className="text-3xl font-bold text-green-600">{type.price}</p>
                                        <p className="text-gray-500 text-sm">{type.duration}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">How It Works</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {howItWorks.map((item, index) => (
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

                    {/* Features Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Our Consultation</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {consultationFeatures.map((feature, index) => (
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

                    {/* Stats Section */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-400 rounded-2xl shadow-xl p-8 sm:p-12 text-white mb-12">
                        <h2 className="text-2xl font-bold text-center mb-8">Our Consultation Stats</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">10K+</p>
                                <p className="text-green-100">Consultations Done</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">98%</p>
                                <p className="text-green-100">Patient Satisfaction</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">24/7</p>
                                <p className="text-green-100">Availability</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">5 min</p>
                                <p className="text-green-100">Avg. Wait Time</p>
                            </div>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <EventAvailableIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                            <h2 className="text-3xl font-bold text-gray-900">Important Information</h2>
                        </div>
                        <div className="space-y-4 text-gray-700">
                            <p>✓ <span className="font-semibold">Verified Doctors:</span> All our doctors are registered medical practitioners with valid credentials.</p>
                            <p>✓ <span className="font-semibold">E-Prescriptions:</span> Digital prescriptions are valid and can be used at any pharmacy.</p>
                            <p>✓ <span className="font-semibold">Medical Records:</span> Your consultation history and prescriptions are securely stored for future reference.</p>
                            <p>✓ <span className="font-semibold">Refund Policy:</span> Full refund if consultation doesn't happen within scheduled time.</p>
                            <p>✓ <span className="font-semibold">Emergency Cases:</span> For medical emergencies, please visit the nearest hospital immediately.</p>
                            <p>✓ <span className="font-semibold">Support:</span> For consultation queries, contact us at 80509 62861.</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Consult?</h3>
                        <p className="text-gray-600 mb-6">Book your consultation now and get expert medical advice</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <EventAvailableIcon />
                                Book Consultation
                            </Link>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-green-600"
                            >
                                <MedicalServicesIcon />
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HealthConsultation;
