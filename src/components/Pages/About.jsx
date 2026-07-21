import MetaData from '../Layouts/MetaData';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const About = () => {
    const values = [
        {
            icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
            title: "Quality Care",
            description: "Trusted medical products sourced from certified suppliers"
        },
        {
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            title: "Fast Delivery",
            description: "Quick and reliable shipping to your doorstep"
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: "Secure Transactions",
            description: "Safe and encrypted payment processing"
        },
        {
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            title: "Expert Support",
            description: "24/7 customer assistance from healthcare professionals"
        },
        {
            icon: <ThumbUpIcon sx={{ fontSize: 40 }} />,
            title: "Customer First",
            description: "Your satisfaction is our top priority"
        },
        {
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            title: "Award Winning",
            description: "Recognized for excellence in healthcare retail"
        }
    ];

    return (
        <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <MetaData title="About Us | Dental Smart Dental & Medical Equipments Mfg" />

            {/* Back to Home Link */}
            {/* <div className="px-16 pt-16">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                >
                    &lt;&lt; Back to Home
                </Link>
            </div> */}

            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-blue-400 mb-4 shadow-lg">
                            <LocalHospitalIcon sx={{ fontSize: 32, color: 'white' }} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            About    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Dental Smart Dental & Medical Equipments Mfg
                            </span>
                        </h1>



                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your trusted partner in healthcare, delivering quality medical products and professional support since day one.
                        </p>
                    </div>

                    {/* Main About Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 border border-green-100 hover:border-green-200 transition-all duration-300 hover:scale-105">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-green-600 transition-colors duration-300">Our Story</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Dental Smart Dental & Medical Equipments Mfg was founded with a simple yet powerful mission: to make quality healthcare products accessible to everyone. We understand that healthcare is personal, which is why we're committed to providing exceptional service and trusted products.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                With years of experience in the pharmaceutical industry, our team brings expertise, dedication, and a genuine care for our customers' well-being.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600 to-blue-400 rounded-2xl shadow-lg hover:shadow-xl p-8 text-white hover:from-green-700 hover:to-blue-500 transition-all duration-300 hover:scale-105">
                            <h2 className="text-2xl font-bold mb-4 hover:text-green-100 transition-colors duration-300">Our Mission</h2>
                            <p className="leading-relaxed mb-6">
                                To make healthcare accessible and affordable by delivering trusted medical products, professional advice, and exceptional customer service.
                            </p>
                            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                            <p className="leading-relaxed">
                                To be the most trusted online pharmacy platform, improving lives through quality healthcare solutions and expert support.
                            </p>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Us</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {values.map((value, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                                    <div className="text-green-600 mb-4 flex justify-center">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{value.title}</h3>
                                    <p className="text-gray-600 text-center text-sm">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="bg-gradient-to-r from-green-600 to-blue-400 rounded-2xl shadow-xl p-8 sm:p-12 text-white mb-12">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">10K+</p>
                                <p className="text-green-100">Products Available</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">50K+</p>
                                <p className="text-green-100">Happy Customers</p>
                            </div>
                            <div>
                                <p className="text-4xl sm:text-5xl font-bold mb-2">24/7</p>
                                <p className="text-green-100">Customer Support</p>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
                        <div className="space-y-4 text-gray-700">
                            <p>✓ <span className="font-semibold">Quality Assurance:</span> All products are sourced from licensed suppliers and verified for authenticity.</p>
                            <p>✓ <span className="font-semibold">Expert Guidance:</span> Our qualified pharmacists and healthcare professionals are available to assist you.</p>
                            <p>✓ <span className="font-semibold">Fast Delivery:</span> We deliver across the country with reliable and timely service.</p>
                            <p>✓ <span className="font-semibold">Privacy & Safety:</span> Your personal and health information is protected with highest security standards.</p>
                            <p>✓ <span className="font-semibold">Affordable Prices:</span> We offer competitive pricing without compromising on quality.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;

