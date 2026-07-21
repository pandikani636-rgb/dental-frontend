import { useEffect, useState } from 'react';
import WorkIcon from '@mui/icons-material/Work';
import StarsIcon from '@mui/icons-material/Stars';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HelpIcon from '@mui/icons-material/Help';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import paymentMethods from '../../../assets/images/payment-methods.svg';
import { useLocation, Link } from 'react-router-dom';

const footerLinks = [
  {
    title: "about",
    links: [
      { name: "Contact Us", redirect: "#" },
      { name: "About MedStore", redirect: "#" },
      { name: "Careers", redirect: "#" },
      { name: "Health Blog", redirect: "#" },
      { name: "Press", redirect: "#" },
      { name: "Pharmacy Network", redirect: "#" },
      { name: "Corporate Information", redirect: "#" }
    ]
  },
  {
    title: "help",
    links: [
      { name: "Payments", redirect: "#" },
      { name: "Medicine Delivery", redirect: "#" },
      { name: "Returns & Refunds", redirect: "#" },
      { name: "FAQ", redirect: "#" }
    ]
  },
  {
    title: "policy",
    links: [
      { name: "Return Policy", redirect: "#" },
      { name: "Terms Of Use", redirect: "#" },
      { name: "Security", redirect: "#" },
      { name: "Privacy Policy", redirect: "#" },
      { name: "Medicine Safety", redirect: "#" },
      { name: "Prescription Policy", redirect: "#" }
    ]
  },
  {
    title: "social",
    links: [
      { name: "Facebook", redirect: "#" },
      { name: "Twitter", redirect: "#" },
      { name: "YouTube", redirect: "#" }
    ]
  }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const [adminRoute, setAdminRoute] = useState(false);

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"))
  }, [location]);

  return (
    <>
      {!adminRoute && (
        <>
          <footer className="w-full text-dental-800 border-t border-dental-200 no-print" style={{ backgroundColor: '#ccfbf1' }}>

            <div className="max-w-7xl mx-auto container-responsive py-4 sm:py-6">
              {/* Brand Section */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-responsive-lg font-bold text-dental-900">Dental Smart Dental & Medical Equipments Manufacturing</h2>
                <p className="text-responsive-xs text-dental-600 mt-1">Think Dental & Think Smart</p>
              </div>


              {/* Links Sections */}
              <div className="flex flex-col sm:flex-row justify-center items-start gap-6 sm:gap-12 max-w-5xl mx-auto">
                {/* Information */}
                <div className="text-center w-full sm:w-auto">
                  <h3 className="text-responsive-base font-bold text-dental-900 mb-3 sm:mb-4">Information</h3>
                  <div className="space-y-2 text-responsive-xs">
                    <Link to="/" className="block hover:text-dental-600 transition-colors touch-friendly">Home</Link>
                    <Link to="/about" className="block hover:text-dental-600 transition-colors touch-friendly">About Us</Link>
                    <Link to="/contact" className="block hover:text-dental-600 transition-colors touch-friendly">Contact</Link>
                    <Link to="/privacy-policy" className="block hover:text-dental-600 transition-colors touch-friendly">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="block hover:text-dental-600 transition-colors touch-friendly">Terms of Service</Link>
                  </div>
                </div>


                {/* Services */}
                <div className="text-center w-full sm:w-auto">
                  <h3 className="text-responsive-base font-bold text-dental-900 mb-3 sm:mb-4">Services</h3>
                  <div className="space-y-2 text-responsive-xs">
                    <Link to="/medicine-delivery" className="block hover:text-dental-600 transition-colors touch-friendly">Medicine Delivery</Link>
                    <Link to="/medical-equipment" className="block hover:text-dental-600 transition-colors touch-friendly">Medical Equipment</Link>
                    <Link to="/health-consultation" className="block hover:text-dental-600 transition-colors touch-friendly">Health Consultation</Link>
                    <Link to="/emergency-support" className="block hover:text-dental-600 transition-colors touch-friendly">Emergency Support</Link>
                    <Link to="/prescription-upload" className="block hover:text-dental-600 transition-colors touch-friendly">Prescription Upload</Link>
                  </div>
                </div>


                {/* Support */}
                <div className="text-center w-full sm:w-auto">
                  <h3 className="text-responsive-base font-bold text-dental-900 mb-3 sm:mb-4">Support</h3>
                  <div className="space-y-2 text-responsive-xs">
                    <Link to="/help-center" className="block hover:text-dental-600 transition-colors touch-friendly">Help Center</Link>
                    <Link to="/returns-refunds" className="block hover:text-dental-600 transition-colors touch-friendly">Returns & Refunds</Link>
                    <Link to="/track-order" className="block hover:text-dental-600 transition-colors touch-friendly">Track Order</Link>
                    <Link to="/faq" className="block hover:text-dental-600 transition-colors touch-friendly">FAQ</Link>
                    <Link to="/customer-care" className="block hover:text-dental-600 transition-colors touch-friendly">Customer Care</Link>
                  </div>
                </div>


                {/* Consumer Policy */}
                <div className="text-center w-full sm:w-auto">
                  <h3 className="text-responsive-base font-bold text-dental-900 mb-3 sm:mb-4">Consumer Policy</h3>
                  <div className="space-y-2 text-responsive-xs">
                    <div className="space-y-2 text-responsive-xs">
                      <Link to="/return-policy" className="block hover:text-dental-600 transition-colors touch-friendly">Return Policy</Link>
                      <Link to="/terms-of-use" className="block hover:text-dental-600 transition-colors touch-friendly">Terms of Use</Link>
                      <Link to="/security" className="block hover:text-dental-600 transition-colors touch-friendly">Security</Link>
                      <Link to="/privacy" className="block hover:text-dental-600 transition-colors touch-friendly">Privacy</Link>
                      <Link to="/cancellation-policy" className="block hover:text-dental-600 transition-colors touch-friendly">Cancellation</Link>
                    </div>
                  </div>
                </div>


                {/* Help */}
                <div className="text-center w-full sm:w-auto">
                  <h3 className="text-responsive-base font-bold text-dental-900 mb-3 sm:mb-4">Help</h3>
                  <div className="space-y-2 text-responsive-xs">
                    <Link to="/payments" className="block hover:text-dental-600 transition-colors touch-friendly">Payments</Link>
                    <Link to="/shippingdetails" className="block hover:text-dental-600 transition-colors touch-friendly">Shipping</Link>
                    <Link to="/contact" className="block hover:text-dental-600 transition-colors touch-friendly">Contact Us</Link>
                    <Link to="/contact" className="block hover:text-dental-600 transition-colors touch-friendly">Feedback</Link>
                    <Link to="/login" className="block hover:text-dental-600 transition-colors touch-friendly">Login</Link>
                  </div>
                </div>


                {/* Connect With Us */}
                <div className="text-center w-full sm:w-auto">
                  <h3 className="text-responsive-base font-bold text-dental-900 mb-3 sm:mb-4">Connect With Us</h3>

                  <div className="space-y-3 sm:space-y-4 text-responsive-xs">
                    {/* Social Media Icons */}
                    <div className="flex justify-center space-x-3 sm:space-x-4">
                      <a href="https://x.com/" target='_blank' className="text-dental-600 hover:text-dental-800 transition-colors touch-friendly p-1">

                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a href="https://www.youtube.com/" target='_blank' className="text-dental-600 hover:text-red-600 transition-colors touch-friendly p-1">

                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </a>
                      <a href="https://www.instagram.com/" target='_blank' className="text-dental-600 hover:text-pink-600 transition-colors touch-friendly p-1">

                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a href="https://in.linkedin.com/" target='_blank' className="text-dental-600 hover:text-dental-800 transition-colors touch-friendly p-1">

                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
                        </svg>
                      </a>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 sm:space-y-2">
                      <p className="flex items-center justify-center sm:justify-start gap-2">
                        <span>📞</span>
                        <a
                          href="tel:+918050962861"
                          className="hover:text-dental-600 transition-colors touch-friendly"

                          aria-label="Call us at 80509 62861"
                        >
                          +91 80509 62861
                        </a>
                      </p>
                      <p className="flex items-center justify-center sm:justify-start gap-2">
                        <span>📧</span>
                        <a
                          href="mailto:info@srichakraindia.com"
                          className="hover:text-dental-600 transition-colors touch-friendly text-xs sm:text-sm"

                          aria-label="Email us at info@srichakraindia.com"
                        >
                          info@srichakraindia.com
                        </a>
                      </p>
                      <p className="flex items-center justify-center sm:justify-start gap-2">
                        <span>🏥</span>
                        Emergency: 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dental-200">
                <p className="text-responsive-xs text-dental-600">© {currentYear} Dental Smart Dental & Medical Equipments Mfg. All rights reserved.</p>
                <p className="text-responsive-xs text-dental-500 mt-1">Developed by <a href="https://anjanainfotech.in/" target='_blank'>Anjana Infotech</a></p>
              </div>

            </div>
          </footer>
        </>
      )}
    </>
  )
};

export default Footer;