import MetaData from '../Layouts/MetaData';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const ReturnsRefunds = () => {
    return (
        <main className="min-h-screen pt-16 bg-white">
            <MetaData title="Returns & Refunds | Sri Chakra India Dental & Medical Equipments Mfg" />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-1 text-dental-600 hover:text-dental-800 transition-colors duration-200 text-sm font-medium">
                        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Home
                    </Link>

                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-dental-100 rounded-xl">
                        <AssignmentReturnIcon className="text-dental-600" sx={{ fontSize: 32 }} />
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Returns & Refunds</h1>
                </div>

                <div className="prose prose-blue max-w-none text-gray-700 space-y-8">
                    <section className="bg-dental-50 p-6 rounded-2xl border border-dental-100">
                        <h2 className="text-xl font-bold text-dental-900 mb-4 flex items-center gap-2">
                            <GavelIcon sx={{ fontSize: 20 }} /> Return Policy Overview
                        </h2>

                        <ul className="list-disc pl-5 space-y-2">
                            <li>Dental and Medical consumables can be returned within 7 days of delivery.</li>
                            <li>Equipments (Chairs, X-ray units, etc.) are subject to manufacturer warranty and only returnable in case of dead-on-arrival (DOA).</li>
                            <li>Items must be in original, unopened packaging with all seals intact due to hygiene and medical safety regulations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <h3 className="font-bold mb-2">1. Request</h3>
                                <p className="text-sm">Initiate a return request through your dashboard or call customer care.</p>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <h3 className="font-bold mb-2">2. Inspection</h3>
                                <p className="text-sm">Our technical team will inspect the item for medical safety compliance.</p>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <h3 className="font-bold mb-2">3. Settlement</h3>
                                <p className="text-sm">Refunds are processed within 5-7 business days to the original payment method.</p>
                            </div>
                        </div>
                    </section>

                    <section className="border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MonetizationOnIcon className="text-green-600" /> Non-Returnable Items
                        </h2>
                        <p className="mb-4">Certain products are non-returnable due to the nature of medical hygiene:</p>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-800 text-sm">
                            <p>Sterilized instruments, opened chemical solutions, customized dental implants, and items used in clinical procedures cannot be returned once the seal is broken.</p>
                        </div>
                    </section>

                    <section className="bg-gray-50 p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h2>
                        <p className="text-sm">If you received a damaged product or have questions about a refund, please contact us at <strong>returns@srichakraindia.com</strong> or call <strong>+91 80509 62861</strong>.</p>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default ReturnsRefunds;
