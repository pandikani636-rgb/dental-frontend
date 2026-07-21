import MetaData from '../Layouts/MetaData';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
    const helpSections = [
        {
            icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
            title: "Shipping & Delivery",
            description: "Track your dental equipment or pharmaceutical orders and understand delivery timelines."
        },
        {
            icon: <AccountCircleIcon sx={{ fontSize: 40 }} />,
            title: "Account & Profile",
            description: "Manage your registered medical practice account, update details, and view order history."
        },
        {
            icon: <PaymentIcon sx={{ fontSize: 40 }} />,
            title: "Payments & Invoices",
            description: "Information about payment methods, taxes, and how to download GST invoices."
        },
        {
            icon: <HelpOutlineIcon sx={{ fontSize: 40 }} />,
            title: "Product Support",
            description: "Guidance on using dental equipment and accessing technical maintenance support."
        }
    ];

    return (
        <main className="min-h-screen pt-16 bg-gradient-to-br from-dental-50 via-white to-dental-50">

            <MetaData title="Help Center | Sri Chakra India Dental & Medical Equipments Mfg" />

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-1 text-dental-600 hover:text-dental-800 transition-colors duration-200 text-sm font-medium">
                        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Home
                    </Link>

                </div>

                <header className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        How can we <span className="text-dental-600">help you?</span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Search our knowledge base or browse categories below to find answers for your dental and medical equipment needs.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {helpSections.map((section, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center">
                            <div className="text-dental-600 mb-4 inline-block">{section.icon}</div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
                        </div>
                    ))}
                </div>

                <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-dental-50">

                    <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Common Questions</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-dental-800 mb-2">How do I track my dental chair order?</h3>
                            <p className="text-gray-600">Large equipment orders are tracked differently. Please use our 'Track Order' page or contact your dedicated account manager for real-time logistics updates.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dental-800 mb-2">Can I modify my medicine order after payment?</h3>
                            <p className="text-gray-600">Orders can be modified within 1 hour of placement, provided they haven't been dispatched. Please call our support line immediately for such requests.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dental-800 mb-2">How do I access technical manuals?</h3>
                            <p className="text-gray-600">Technical manuals for all Sri Chakra India manufactured equipments are available in the 'My Account' section under the 'Equipment Docs' tab for registered users.</p>
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
};

export default HelpCenter;
