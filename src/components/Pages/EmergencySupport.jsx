import MetaData from '../Layouts/MetaData';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SpeedIcon from '@mui/icons-material/Speed';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link } from 'react-router-dom';

const EmergencySupport = () => {
    const emergencyFeatures = [
        {
            icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
            title: "24/7 Availability",
            description: "Round-the-clock emergency support every day of the year"
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40 }} />,
            title: "Rapid Response",
            description: "Quick response time for all emergency medical needs"
        },
        {
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            title: "Express Delivery",
            description: "Priority delivery for urgent medical supplies"
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            title: "Expert Guidance",
            description: "Professional medical guidance during emergencies"
        },
        {
            icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />,
            title: "Emergency Medicines",
            description: "Critical medicines available for immediate dispatch"
        },
        {
            icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
            title: "Pan India Coverage",
            description: "Emergency services available across all major cities"
        }
    ];

    const emergencyServices = [
        {
            title: "Emergency Medicine Delivery",
            description: "Get critical medicines delivered within hours for life-saving needs",
            availability: "Available 24/7",
            icon: <LocalShippingIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "Medical Equipment Support",
            description: "Emergency repair and replacement of essential medical equipment",
            availability: "Response within 4 hours",
            icon: <MedicalServicesIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "Phone Consultation",
            description: "Immediate phone consultation with medical professionals",
            availability: "Always Available",
            icon: <PhoneIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "First Aid Guidance",
            description: "Step-by-step first aid instructions for emergency situations",
            availability: "24/7 Support",
            icon: <HealthAndSafetyIcon sx={{ fontSize: 32 }} />
        }
    ];

    const emergencyContacts = [
        {
            title: "Emergency Helpline",
            number: "80509 62861",
            description: "For urgent medicine and equipment needs"
        },
        {
            title: "Customer Support",
            number: "80509 62861",
            description: "For general queries and order support"
        },
        {
            title: "Technical Support",
            number: "80509 62861",
            description: "For equipment issues and repairs"
        }
    ];

    const emergencyTips = [
        "Keep a list of essential medicines and their dosages handy",
        "Store emergency contact numbers in an easily accessible place",
        "Maintain a basic first aid kit at home and workplace",
        "Know the location of nearest hospitals and pharmacies",
        "Keep prescription copies saved digitally for quick access",
        "Check expiry dates of medicines in your emergency kit regularly"
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="Emergency Support | Sri Chakra India Dental & Medical Equipments Mfg" />

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
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 mb-4 shadow-lg animate-pulse">
                            <ReportProblemIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Emergency    <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                                Support Services
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            When every second counts, we're here for you. Get immediate medical support, emergency medicine delivery, and expert guidance 24/7.
                        </p>
                    </div>

                    {/* Emergency Hotline */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-xl p-8 mb-12 text-white text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <PhoneIcon sx={{ fontSize: 40 }} className="animate-bounce" />
                            <h2 className="text-2xl sm:text-3xl font-bold">Emergency Hotline</h2>
                        </div>
                        <p className="text-5xl sm:text-6xl font-bold mb-4">80509 62861</p>
                        <p className="text-red-100 text-lg">Available 24 hours, 7 days a week</p>
                    </div>

                    {/* Main Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <LocalHospitalIcon sx={{ fontSize: 32, color: '#dc2626' }} />
                                <h2 className="text-2xl font-bold text-gray-900 hover:text-red-600 transition-colors duration-300">Our Emergency Promise</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                At Sri Chakra India Dental & Medical Equipments Mfg, we understand that medical emergencies can occur at any time. Our dedicated emergency support team is available round-the-clock to ensure you receive critical medical supplies when you need them most.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                From life-saving medicines to essential medical equipment, we prioritize your emergency needs with express delivery and immediate support.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white hover:from-green-700 hover:to-blue-500 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <SpeedIcon sx={{ fontSize: 32, color: 'white' }} />
                                <h2 className="text-2xl font-bold hover:text-green-100 transition-colors duration-300">Emergency Response Stats</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">15 min</p>
                                    <p className="text-green-100 text-sm">Avg. Response Time</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">24/7</p>
                                    <p className="text-green-100 text-sm">Always Available</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">99%</p>
                                    <p className="text-green-100 text-sm">Success Rate</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">500+</p>
                                    <p className="text-green-100 text-sm">Cities Covered</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Services */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Emergency Services</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {emergencyServices.map((service, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-red-200 hover:scale-105">
                                    <div className="text-red-500 mb-4 flex justify-center">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-center text-sm mb-3">{service.description}</p>
                                    <p className="text-center text-xs font-semibold text-green-600 bg-green-50 rounded-full py-1 px-3">{service.availability}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Our Emergency Support</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {emergencyFeatures.map((feature, index) => (
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

                    {/* Emergency Contacts */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Contact Numbers</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {emergencyContacts.map((contact, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-green-200 hover:scale-105 text-center">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                                        <PhoneIcon sx={{ fontSize: 28, color: '#16a34a' }} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                                    <p className="text-2xl font-bold text-green-600 mb-2">{contact.number}</p>
                                    <p className="text-gray-600 text-sm">{contact.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-400 rounded-2xl shadow-xl p-8 sm:p-12 text-white mb-12">
                        <h2 className="text-2xl font-bold text-center mb-8">Our Emergency Support Stats</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">5000+</p>
                                <p className="text-green-100">Emergencies Handled</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">99%</p>
                                <p className="text-green-100">Response Success</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">15 min</p>
                                <p className="text-green-100">Avg. Response</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">365</p>
                                <p className="text-green-100">Days Availability</p>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Tips */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <WarningAmberIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                            <h2 className="text-3xl font-bold text-gray-900">Emergency Preparedness Tips</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                            {emergencyTips.map((tip, index) => (
                                <p key={index} className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    {tip}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-red-50 rounded-2xl shadow-lg p-8 border border-red-200">
                        <div className="flex items-center gap-3 mb-6">
                            <ReportProblemIcon sx={{ fontSize: 32, color: '#dc2626' }} />
                            <h2 className="text-3xl font-bold text-red-700">Important Notice</h2>
                        </div>
                        <div className="space-y-4 text-gray-700">
                            <p>⚠️ <span className="font-semibold">Life-Threatening Emergencies:</span> For severe medical emergencies, immediately call 108 (Ambulance) or visit the nearest hospital.</p>
                            <p>⚠️ <span className="font-semibold">Our Service:</span> We provide emergency support for medical supplies, equipment, and guidance – not ambulance or hospital services.</p>
                            <p>⚠️ <span className="font-semibold">Prescription Required:</span> Emergency prescription medicines require a valid prescription for dispatch.</p>
                            <p>⚠️ <span className="font-semibold">Self-Medication Warning:</span> Do not self-medicate in emergencies. Always seek professional medical advice.</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                        <p className="text-gray-600 mb-6">Contact our emergency support team now or browse our medical products</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="tel:8050962861"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <PhoneIcon />
                                Call Now: 80509 62861
                            </a>
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

export default EmergencySupport;
