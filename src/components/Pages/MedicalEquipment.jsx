import MetaData from '../Layouts/MetaData';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BuildIcon from '@mui/icons-material/Build';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Link } from 'react-router-dom';

const MedicalEquipment = () => {
    const equipmentFeatures = [
        {
            icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
            title: "Certified Quality",
            description: "All equipment certified by ISO and meets international medical standards"
        },
        {
            icon: <PrecisionManufacturingIcon sx={{ fontSize: 40 }} />,
            title: "Premium Manufacturing",
            description: "State-of-the-art manufacturing with precision engineering"
        },
        {
            icon: <BuildIcon sx={{ fontSize: 40 }} />,
            title: "Installation Support",
            description: "Professional installation and setup by trained technicians"
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            title: "Expert Consultation",
            description: "Free consultation to help you choose the right equipment"
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Warranty Coverage",
            description: "Comprehensive warranty and extended protection plans"
        },
        {
            icon: <EngineeringIcon sx={{ fontSize: 40 }} />,
            title: "Maintenance Service",
            description: "Regular maintenance and repair services available"
        }
    ];

    const equipmentCategories = [
        {
            title: "Dental Equipment",
            items: ["Dental Chairs", "X-Ray Units", "Autoclaves", "Compressors", "Handpieces", "Curing Lights"],
            icon: <MedicalServicesIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "Diagnostic Equipment",
            items: ["Blood Pressure Monitors", "Pulse Oximeters", "ECG Machines", "Ultrasound", "Otoscopes", "Stethoscopes"],
            icon: <HealthAndSafetyIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "Surgical Instruments",
            items: ["Surgical Tools", "Forceps", "Scissors", "Retractors", "Needle Holders", "Scalpels"],
            icon: <BuildIcon sx={{ fontSize: 32 }} />
        },
        {
            title: "Laboratory Equipment",
            items: ["Microscopes", "Centrifuges", "Incubators", "Analyzers", "Lab Consumables", "Test Kits"],
            icon: <PrecisionManufacturingIcon sx={{ fontSize: 32 }} />
        }
    ];

    const whyChooseUs = [
        {
            number: "25+",
            text: "Years of Experience"
        },
        {
            number: "5000+",
            text: "Products Available"
        },
        {
            number: "1000+",
            text: "Happy Clients"
        },
        {
            number: "100%",
            text: "Quality Assured"
        }
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="Medical Equipment | Sri Chakra India Dental & Medical Equipments Mfg" />

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
                            <MedicalServicesIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Medical    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Equipment & Instruments
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Premium quality dental and medical equipment from trusted manufacturers. We provide complete solutions for hospitals, clinics, and healthcare professionals.
                        </p>
                    </div>

                    {/* Main Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <PrecisionManufacturingIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                <h2 className="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors duration-300">Our Manufacturing Excellence</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Sri Chakra India Dental & Medical Equipments Mfg is a leading manufacturer and supplier of high-quality dental and medical equipment. With over 25 years of experience, we have established ourselves as a trusted name in the healthcare industry.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Our products are manufactured using the latest technology and finest materials, ensuring durability, precision, and reliability for healthcare professionals.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white hover:from-green-700 hover:to-blue-500 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <InventoryIcon sx={{ fontSize: 32, color: 'white' }} />
                                <h2 className="text-2xl font-bold hover:text-green-100 transition-colors duration-300">Product Range</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">500+</p>
                                    <p className="text-green-100 text-sm">Dental Products</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">300+</p>
                                    <p className="text-green-100 text-sm">Medical Devices</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">200+</p>
                                    <p className="text-green-100 text-sm">Surgical Tools</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">100+</p>
                                    <p className="text-green-100 text-sm">Lab Equipment</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Equipment Categories */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Equipment Categories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {equipmentCategories.map((category, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 hover:scale-105">
                                    <div className="text-green-600 mb-4 flex justify-center">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">{category.title}</h3>
                                    <ul className="space-y-2">
                                        {category.items.map((item, idx) => (
                                            <li key={idx} className="text-gray-600 text-sm flex items-center gap-2">
                                                <span className="text-green-600">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Our Equipment</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {equipmentFeatures.map((feature, index) => (
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
                        <h2 className="text-2xl font-bold text-center mb-8">Our Achievements</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
                            {whyChooseUs.map((stat, index) => (
                                <div key={index}>
                                    <p className="text-4xl sm:text-5xl font-bold mb-2">{stat.number}</p>
                                    <p className="text-green-100">{stat.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services Offered */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 hover:scale-105 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                                <LocalShippingIcon sx={{ fontSize: 28, color: '#16a34a' }} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Delivery</h3>
                            <p className="text-gray-600 text-sm">Free delivery on all equipment orders above ₹10,000 across India</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 hover:scale-105 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
                                <BuildIcon sx={{ fontSize: 28, color: '#2563eb' }} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Installation</h3>
                            <p className="text-gray-600 text-sm">Professional installation service by certified technicians</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 hover:scale-105 text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                                <EngineeringIcon sx={{ fontSize: 28, color: '#16a34a' }} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Annual Maintenance</h3>
                            <p className="text-gray-600 text-sm">Comprehensive AMC plans for all types of medical equipment</p>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <MedicalServicesIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                            <h2 className="text-3xl font-bold text-gray-900">Equipment Services</h2>
                        </div>
                        <div className="space-y-4 text-gray-700">
                            <p>✓ <span className="font-semibold">Bulk Orders:</span> Special pricing available for hospitals and institutional buyers.</p>
                            <p>✓ <span className="font-semibold">Customization:</span> Custom equipment solutions based on your specific requirements.</p>
                            <p>✓ <span className="font-semibold">Training:</span> Complimentary training sessions for equipment operation.</p>
                            <p>✓ <span className="font-semibold">Spare Parts:</span> Genuine spare parts available for all equipment models.</p>
                            <p>✓ <span className="font-semibold">Technical Support:</span> Dedicated technical support team available 6 days a week.</p>
                            <p>✓ <span className="font-semibold">Contact Us:</span> For inquiries, call us at 80509 62861 or visit our showroom.</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Looking for Medical Equipment?</h3>
                        <p className="text-gray-600 mb-6">Explore our complete range of dental and medical equipment</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <InventoryIcon />
                                Browse Products
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-green-600"
                            >
                                <SupportAgentIcon />
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MedicalEquipment;
