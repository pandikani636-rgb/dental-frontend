import MetaData from '../Layouts/MetaData';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { createContact } from '../../actions/contactusAction';
// import { NEW_CONTACTUS_RESET } from '../../constants/contactUsConstants';
import { NEW_CONTACTUS_RESET } from '../../constants/contactusConstants';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';


const Contact = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, error, success, message } = useSelector(
        (state) => state.newContactus || {}
    );

    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    // Validate single field
    const validateOne = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return "Full Name is required";
                if (!/^[a-zA-Z\s]+$/.test(value)) return "Full Name should contain only letters";
                return "";
            case 'email':
                if (!value.trim()) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address (e.g. you@example.com)";
                return "";
            case 'phone':
                if (!value.trim()) return "Phone Number is required";
                if (!/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) return "Enter a valid 10-digit Indian mobile number";
                return "";
            case 'message':
                if (!value.trim()) return "Message is required";
                if (value.trim().length < 10) return "Message must be at least 10 characters";
                return "";
            default: return "";
        }
    };

    const handleChange = (e) => {
        let value = e.target.value;

        // Validation for Name: Allow only letters and spaces
        if (e.target.name === 'name') {
            value = value.replace(/[^a-zA-Z\s]/g, '');
        }

        // Format phone number as user types (digits only, max 10)
        if (e.target.name === 'phone') {
            value = value.replace(/\D/g, '').slice(0, 10);
        }

        setFormData({ ...formData, [e.target.name]: value });

        // Real-time validation: only show error if field was already touched
        if (touched[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: validateOne(e.target.name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateOne(name, value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all fields
        const allErrors = {
            name: validateOne('name', formData.name),
            email: validateOne('email', formData.email),
            phone: validateOne('phone', formData.phone),
            message: validateOne('message', formData.message),
        };
        setErrors(allErrors);
        setTouched({ name: true, email: true, phone: true, message: true });

        if (Object.values(allErrors).some(e => e)) return;

        // Submit form data with cleaned phone number
        const cleanedData = {
            ...formData,
            phone: formData.phone.replace(/\D/g, '')
        };
        dispatch(createContact(cleanedData));
    };

    useEffect(() => {
        if (success) {
            // Show success snackbar
            enqueueSnackbar('Message sent successfully!', { variant: 'success' });

            // Clear form after success
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });

            // Reset redux state after a short delay
            const timer = setTimeout(() => {
                dispatch({ type: NEW_CONTACTUS_RESET });
            }, 100);

            return () => clearTimeout(timer);
        }

        if (error) {
            // Show error snackbar
            enqueueSnackbar(error || 'Error occurred while sending message!', { variant: 'error' });
        }
    }, [success, error, enqueueSnackbar, dispatch]);


    const contactInfo = [
        {
            icon: <EmailIcon sx={{ fontSize: 32 }} />,
            title: "Email",
            details: ["support@srichakraindia.com", "info@srichakraindia.com"],
            color: "from-green-600 to-blue-400"
        },
        {
            icon: <PhoneIcon sx={{ fontSize: 32 }} />,
            title: "Phone",
            details: ["+91 9632587412", "+91 8778874770"],
            color: "from-green-600 to-blue-400"
        },
        {
            icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
            title: "Address",
            details: ["123 Medical Lane", "Health City, HC 12345"],
            color: "from-green-600 to-blue-400"
        },
        {
            icon: <AccessTimeIcon sx={{ fontSize: 32 }} />,
            title: "Hours",
            details: ["Mon - Sun: 24/7", "Always available for you"],
            color: "from-green-600 to-blue-400"
        }
    ];

    return (
        <>
            {/* Back to Home Link */}
            {/* <div className="px-8" style={{ paddingTop: '70px' }}>
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                >
                    &lt;&lt; Back to Home
                </Link>
            </div> */}

            <main className="min-h-screen pt-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
                <MetaData title="Contact Us | Sri Chakra India Dental & Medical Equipments Mfg" />

                <section className="px-4 py-12 sm:py-16">
                    <div className="max-w-6xl mx-auto">

                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-blue-400 mb-4 shadow-lg">
                                <EmailIcon sx={{ fontSize: 32, color: 'white' }} />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                                Get In <span className="text-green-600">Touch</span>
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                We're here to help! Reach out to our dedicated support team for any questions or concerns.
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {contactInfo.map((info, index) => (
                                <div key={index} style={{ backgroundColor: '#D6F4ED' }} className="rounded-xl shadow-lg p-6 text-gray-800 hover:shadow-xl transition-shadow duration-300">
                                    <div className="mb-4 opacity-90">{info.icon}</div>
                                    <h3 className="text-xl font-semibold mb-3">{info.title}</h3>
                                    {info.details.map((detail, i) => (
                                        <p key={i} className="text-sm opacity-90 mb-1 hover:opacity-100 transition-opacity duration-300">{detail}</p>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Contact Form Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                                <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Your Name"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none 
                                            ${errors.name ? 'border-red-500 bg-red-50' : formData.name && !errors.name ? 'border-green-500' : 'border-gray-300'}
                                            focus:ring-2 focus:ring-blue-500 transition`}
                                        />
                                        {errors.name 
                                            ? <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.name}</p>
                                            : formData.name && touched.name && <p className="text-green-600 text-sm mt-1">✓ Valid name</p>
                                        }
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="your@email.com"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none 
                                            ${errors.email ? 'border-red-500 bg-red-50' : formData.email && !errors.email ? 'border-green-500' : 'border-gray-300'}
                                            focus:ring-2 focus:ring-blue-500 transition`}
                                        />
                                        {errors.email 
                                            ? <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.email}</p>
                                            : formData.email && touched.email && <p className="text-green-600 text-sm mt-1">✓ Valid email</p>
                                        }
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="+91 XXXXX XXXXX"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none 
                                            ${errors.phone ? 'border-red-500 bg-red-50' : formData.phone && !errors.phone ? 'border-green-500' : 'border-gray-300'}
                                            focus:ring-2 focus:ring-blue-500 transition`}
                                        />
                                        {errors.phone 
                                            ? <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.phone}</p>
                                            : formData.phone && touched.phone && <p className="text-green-600 text-sm mt-1">✓ Valid number</p>
                                        }
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Tell us more about your inquiry..."
                                            rows="5"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none resize-none
                                            ${errors.message ? 'border-red-500 bg-red-50' : formData.message && !errors.message ? 'border-green-500' : 'border-gray-300'}
                                            focus:ring-2 focus:ring-blue-500 transition`}
                                        />
                                        {errors.message 
                                            ? <p className="text-red-500 text-sm mt-1 flex items-center gap-1">⚠️ {errors.message}</p>
                                            : formData.message && touched.message && <p className="text-green-600 text-sm mt-1">✓ Looks good</p>
                                        }
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-green-600 to-blue-400 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-blue-500 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <SendIcon sx={{ fontSize: 20 }} />
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>

                                </form>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Contact Us?</h2>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start gap-3"><span className="text-blue-500 font-bold text-lg mt-1">✓</span>Get expert advice</li>
                                        <li className="flex items-start gap-3"><span className="text-blue-500 font-bold text-lg mt-1">✓</span>Track your orders</li>
                                        <li className="flex items-start gap-3"><span className="text-blue-500 font-bold text-lg mt-1">✓</span>Health guidance</li>
                                        <li className="flex items-start gap-3"><span className="text-blue-500 font-bold text-lg mt-1">✓</span>Report issues</li>
                                        <li className="flex items-start gap-3"><span className="text-blue-500 font-bold text-lg mt-1">✓</span>Share feedback</li>
                                    </ul>
                                </div>

                                <div style={{ backgroundColor: '#D6F4ED' }} className="rounded-2xl shadow-xl p-8 text-gray-800">
                                    <h3 className="text-2xl font-bold mb-4">Quick Response Time</h3>
                                    <p className="mb-6 text-gray-700 text-lg">
                                        We aim to respond within 24 hours. Our support team is always ready to assist.
                                    </p>
                                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200">
                                        <p className="text-gray-800 font-medium">📞 Call for urgent matters or chat with our support team.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </>
    );
};

export default Contact;
