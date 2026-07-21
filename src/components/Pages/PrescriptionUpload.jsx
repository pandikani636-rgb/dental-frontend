import MetaData from '../Layouts/MetaData';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Link } from 'react-router-dom';

const PrescriptionUpload = () => {
    const uploadFeatures = [
        {
            icon: <CloudUploadIcon sx={{ fontSize: 40 }} />,
            title: "Easy Upload",
            description: "Simply upload a photo or scan of your prescription"
        },
        {
            icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
            title: "Quick Verification",
            description: "Our pharmacists verify your prescription within minutes"
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Safe & Secure",
            description: "Your prescription data is encrypted and protected"
        },
        {
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            title: "Fast Delivery",
            description: "Get your medicines delivered to your doorstep"
        },
        {
            icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
            title: "24/7 Service",
            description: "Upload prescriptions anytime, we process them round the clock"
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
            title: "Expert Support",
            description: "Our pharmacists are available for any queries"
        }
    ];

    const uploadSteps = [
        {
            step: "1",
            title: "Upload Prescription",
            description: "Take a clear photo or upload a scanned copy of your prescription"
        },
        {
            step: "2",
            title: "Verification",
            description: "Our licensed pharmacist verifies your prescription"
        },
        {
            step: "3",
            title: "Order Confirmation",
            description: "We confirm availability and share the order details"
        },
        {
            step: "4",
            title: "Delivery",
            description: "Medicines are packed safely and delivered to you"
        }
    ];

    const acceptedFormats = [
        "JPEG / JPG Images",
        "PNG Images",
        "PDF Documents",
        "HEIC / HEIF Images",
        "Scanned Documents"
    ];

    const prescriptionGuidelines = [
        "Prescription should be clearly visible and readable",
        "Include doctor's name, signature, and registration number",
        "Patient name and date should be clearly mentioned",
        "Medicine names and dosage should be legible",
        "Prescription should not be older than 6 months",
        "Valid prescriptions from registered medical practitioners only"
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="Prescription Upload | Sri Chakra India Dental & Medical Equipments Mfg" />

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
                            <DescriptionIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Prescription    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Upload Service
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Upload your prescription and get your medicines delivered to your doorstep. Quick, easy, and secure prescription processing.
                        </p>
                    </div>

                    {/* Main Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <CloudUploadIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                <h2 className="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors duration-300">How It Works</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Simply upload a clear photo or scan of your doctor's prescription, and we'll take care of the rest. Our licensed pharmacists will verify your prescription and prepare your order for quick delivery.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                No more waiting in long pharmacy queues. Get your prescription medicines delivered safely to your home with our hassle-free service.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white hover:from-green-700 hover:to-blue-500 transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircleIcon sx={{ fontSize: 32, color: 'white' }} />
                                <h2 className="text-2xl font-bold hover:text-green-100 transition-colors duration-300">Service Benefits</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">Free</p>
                                    <p className="text-green-100 text-sm">Upload Service</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">30 min</p>
                                    <p className="text-green-100 text-sm">Verification Time</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">100%</p>
                                    <p className="text-green-100 text-sm">Secure Process</p>
                                </div>
                                <div className="text-center p-4 bg-white/10 rounded-xl">
                                    <p className="text-3xl font-bold">24/7</p>
                                    <p className="text-green-100 text-sm">Available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Steps */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Upload Process</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {uploadSteps.map((item, index) => (
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

                    {/* Upload Section */}
                    <div className="mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-dashed border-green-300 hover:border-green-500 transition-colors duration-300">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                                    <PhotoCameraIcon sx={{ fontSize: 40, color: '#16a34a' }} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Prescription</h2>
                                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                    Take a clear photo of your prescription or upload a scanned copy. Make sure all details are clearly visible.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4 mb-6">
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <CloudUploadIcon />
                                        Contact to Upload
                                    </Link>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Accepted formats: JPG, PNG, PDF, HEIC (Max 10MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Accepted Formats & Guidelines */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <DescriptionIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                <h2 className="text-2xl font-bold text-gray-900">Accepted Formats</h2>
                            </div>
                            <ul className="space-y-3">
                                {acceptedFormats.map((format, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-700">
                                        <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a' }} />
                                        {format}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <MedicalServicesIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                <h2 className="text-2xl font-bold text-gray-900">Prescription Guidelines</h2>
                            </div>
                            <ul className="space-y-3">
                                {prescriptionGuidelines.map((guideline, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-700">
                                        <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a', marginTop: '2px' }} />
                                        {guideline}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Upload With Us</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {uploadFeatures.map((feature, index) => (
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
                        <h2 className="text-2xl font-bold text-center mb-8">Our Prescription Service Stats</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">50K+</p>
                                <p className="text-green-100">Prescriptions Processed</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">99%</p>
                                <p className="text-green-100">Accuracy Rate</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">30 min</p>
                                <p className="text-green-100">Avg. Verification</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">100%</p>
                                <p className="text-green-100">Secure Process</p>
                            </div>
                        </div>
                    </div>

                    {/* Important Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <SecurityIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                            <h2 className="text-3xl font-bold text-gray-900">Important Information</h2>
                        </div>
                        <div className="space-y-4 text-gray-700">
                            <p>✓ <span className="font-semibold">Valid Prescription:</span> Only valid prescriptions from registered medical practitioners are accepted.</p>
                            <p>✓ <span className="font-semibold">Verification Required:</span> All prescriptions are verified by our licensed pharmacists before processing.</p>
                            <p>✓ <span className="font-semibold">Privacy Protection:</span> Your prescription data is encrypted and stored securely.</p>
                            <p>✓ <span className="font-semibold">Controlled Medicines:</span> Schedule H and H1 drugs require valid prescription for every order.</p>
                            <p>✓ <span className="font-semibold">Prescription Validity:</span> Prescriptions older than 6 months may not be accepted.</p>
                            <p>✓ <span className="font-semibold">Support:</span> For prescription upload queries, contact us at 80509 62861.</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Have a Prescription?</h3>
                        <p className="text-gray-600 mb-6">Contact us to upload your prescription and get your medicines delivered</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <CloudUploadIcon />
                                Contact to Upload
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

export default PrescriptionUpload;
