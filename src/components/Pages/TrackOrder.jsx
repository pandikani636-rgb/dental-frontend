import MetaData from '../Layouts/MetaData';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
    return (
        <main className="min-h-screen pt-16 bg-gray-50">
            <MetaData title="Track Order | Sri Chakra India Dental & Medical Equipments Mfg" />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-1 text-dental-600 hover:text-dental-800 transition-colors duration-200 text-sm font-medium">
                        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Home
                    </Link>

                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-dental-600 to-dental-800 px-8 py-10 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <LocalShippingIcon sx={{ fontSize: 32 }} />
                            </div>
                            <h1 className="text-3xl font-bold">Track Your Order</h1>
                        </div>
                        <p className="text-dental-50">Stay updated on your dental supplies and medical equipment delivery status.</p>
                    </div>


                    <div className="p-8 sm:p-12">
                        <div className="max-w-md mx-auto space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">How to Track?</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-dental-100 text-dental-600 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                                        <p className="text-gray-600 text-sm"><span className="font-bold text-gray-800">Check Email:</span> Use the tracking ID sent to your registered email address upon dispatch.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-dental-100 text-dental-600 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                                        <p className="text-gray-600 text-sm"><span className="font-bold text-gray-800">Login to Dashboard:</span> Go to 'My Orders' in your account to see real-time status of your shipments.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-dental-100 text-dental-600 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                                        <p className="text-gray-600 text-sm"><span className="font-bold text-gray-800">Large Equipment:</span> For dental chairs and heavy machinery, contact our logistics desk for specialized tracking.</p>
                                    </div>

                                </div>
                            </div>

                            <div className="bg-dental-50 border border-dental-100 p-6 rounded-2xl flex gap-4">
                                <InfoIcon className="text-dental-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-dental-900 mb-1 leading-none">Shipment Notice</h3>
                                    <p className="text-xs text-dental-800">Orders placed after 6 PM are processed the next business day. Medical consumables are typically dispatched within 24-48 hours.</p>
                                </div>
                            </div>


                            <div className="pt-4">
                                <Link to="/orders" className="block w-full bg-dental-600 text-white text-center py-4 rounded-xl font-bold hover:bg-dental-700 transition-colors shadow-lg shadow-dental-200">
                                    Go to My Orders
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TrackOrder;
