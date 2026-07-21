import MetaData from '../Layouts/MetaData';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const CustomerCare = () => {
    return (
        <main className="min-h-screen pt-16 bg-gradient-to-b from-dental-50 to-white">

            <MetaData title="Customer Care | Sri Chakra India Dental & Medical Equipments Mfg" />

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-1 text-dental-600 hover:text-dental-800 transition-colors duration-200 text-sm font-medium">
                        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Home
                    </Link>

                </div>

                <header className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Customer Care</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Dedicated support for dental professionals and medical institutes. We're here to ensure your practice runs smoothly with our equipments.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-dental-100 rounded-full flex items-center justify-center mx-auto mb-6 text-dental-600">
                            <PhoneIcon />
                        </div>

                        <h3 className="text-xl font-bold mb-2">Call Support</h3>
                        <p className="text-gray-500 text-sm mb-4">Direct contact for sales and urgent equipment support.</p>
                        <a href="tel:+918050962861" className="text-dental-600 font-bold text-lg hover:underline">+91 80509 62861</a>

                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <EmailIcon />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Email Us</h3>
                        <p className="text-gray-500 text-sm mb-4">Send us your inquiries or clinical equipment requirements.</p>
                        <a href="mailto:info@srichakraindia.com" className="text-dental-600 font-bold hover:underline">info@srichakraindia.com</a>

                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                            <BusinessIcon />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Corporate Office</h3>
                        <p className="text-gray-500 text-sm mb-2">Sri Chakra India Dental & Medical Equipments Mfg.</p>
                        <p className="text-gray-900 font-medium text-sm">Medical Plaza & Wellness Complex, India</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 sm:p-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Support Hours</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Monday - Friday</span>
                                <span className="font-bold">9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Saturday</span>
                                <span className="font-bold">10:00 AM - 4:00 PM</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Sunday</span>
                                <span className="font-bold text-red-600 italic">Emergency Only</span>
                            </div>
                        </div>
                        <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                            <p className="text-sm text-yellow-800">
                                <span className="font-bold">Technical Emergency:</span> For breakdown of critical ICU or Dental Surgery equipment, our field engineers are available 24/7. Call our emergency hotline.
                            </p>
                        </div>
                    </div>
                    <div className="bg-dental-600 p-8 sm:p-12 text-white flex flex-col justify-center">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm self-start mb-6">
                            <HeadsetMicIcon sx={{ fontSize: 40 }} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Dedicated Desk</h2>
                        <p className="text-dental-50 mb-8">Every registered clinic is assigned a dedicated relationship manager to handle all equipment maintenance and supply needs.</p>

                        <div className="flex items-center gap-4">
                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=100&h=100" alt="Support" className="w-12 h-12 rounded-full object-cover border-2 border-white" />
                            <div>
                                <p className="font-bold leading-none">Meghna Sharma</p>
                                <p className="text-xs text-dental-100">Head of Customer Success</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CustomerCare;
