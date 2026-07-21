import MetaData from '../Layouts/MetaData';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const faqs = [
        {
            question: "What is the warranty period for Sri Chakra Dental Chairs?",
            answer: "Most of our dental chairs come with a 1-year comprehensive warranty and an additional 2-year warranty on the motor. Specific terms may vary by model."
        },
        {
            question: "Do you provide installation services for medical equipment?",
            answer: "Yes, we provide free professional installation for all large medical equipments across India. Our technical team will reach your location within 48-72 hours of delivery."
        },
        {
            question: "Are your products ISO and CE certified?",
            answer: "Absolutely. All Sri Chakra India manufactured products meet stringent international quality standards, including ISO 13485:2016 and CE certification for dental equipments."
        },
        {
            question: "How can I get bulk pricing for my dental clinic?",
            answer: "For bulk inquiries or complete clinic setup, please contact our corporate sales team at sales@srichakraindia.com for exclusive professional discounts."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major Credit/Debit Cards, UPI, Net Banking, and Bank Transfers. We also offer EMI options for expensive medical equipments through partner banks."
        },
        {
            question: "How do I handle maintenance and spare parts?",
            answer: "We maintain a full inventory of spare parts. You can request maintenance services or order spare parts directly through our Customer Care portal."
        }
    ];

    return (
        <main className="min-h-screen pt-16 bg-white">
            <MetaData title="FAQ | Sri Chakra India Dental & Medical Equipments Mfg" />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-1 text-dental-600 hover:text-dental-800 transition-colors duration-200 text-sm font-medium">
                        <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Home
                    </Link>

                </div>

                <header className="text-center mb-16">
                    <div className="inline-block p-4 bg-dental-50 rounded-full mb-6 text-dental-600">
                        <QuestionAnswerIcon sx={{ fontSize: 40 }} />
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600">Quick answers to the most common questions about our dental and medical solutions.</p>
                </header>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="group p-6 rounded-2xl border border-gray-100 hover:border-dental-200 hover:bg-dental-50/30 transition-all duration-300">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-dental-700 transition-colors">
                                {faq.question}
                            </h3>

                            <p className="text-gray-600 leading-relaxed text-sm">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-dental-600 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl shadow-dental-200">
                    <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-dental-100 mb-8 max-w-xl mx-auto">If you can't find what you're looking for, our help desk is available 24/7 to assist with technical or sales inquiries.</p>
                    <Link to="/contact" className="inline-block bg-white text-dental-600 px-10 py-4 rounded-xl font-bold hover:bg-dental-50 transition-colors">
                        Contact Support
                    </Link>

                </div>
            </div>
        </main>
    );
};

export default FAQ;
