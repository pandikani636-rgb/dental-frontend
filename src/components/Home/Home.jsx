import { useEffect, useState } from 'react';
import Categories from '../Layouts/Categories';
import Banner from './Banner/Banner';
import DealSlider from './DealSlider/DealSlider';
import ProductSlider from './ProductSlider/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProducts } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import HomeHealthArticles from './HomeHealthArticles';
import HomeExperts from './HomeExperts';
import HomeBrands from './HomeBrands';
import HomeDelivery from './HomeDelivery';
import brandImg from '../../assets/images/Home/brand.svg';
import expertImg from '../../assets/images/Home/expert.svg';
import deliveryImg from '../../assets/images/Home/delivery.svg';
import tipsImg from '../../assets/images/Home/health_tips.svg';
import HomeHighlights from './HomeHighlights';
import HomeProducts from './HomeProducts';
import DiscountCircleCards from './DiscountCircleCards';

import { Dialog, DialogContent, IconButton, useMediaQuery, useTheme, Fab, Paper, TextField, Box, Typography, Button, Chip, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';

const Home = () => {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [activeBanner, setActiveBanner] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi! 👋 I\'m your Medical Store Assistant. How can I help you today?', sender: 'bot' },
    { text: 'options', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { error, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts("", "", [0, 50000000], 0, 1));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
  }, [dispatch, error, enqueueSnackbar]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('name') || msg.includes('who are you')) {
      return 'I\'m Srichakra Chatbot for answering your queries! 😊';
    } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      return 'Hello! 👋 How can I assist you today?';
    } else if (msg.includes('thank') || msg.includes('thanks')) {
      return 'You\'re welcome! Happy to help! 😊';
    } else if (msg.includes('bye') || msg.includes('goodbye')) {
      return 'Goodbye! Have a great day! Feel free to come back anytime. 👋';
    } else if (msg.includes('how are you')) {
      return 'I\'m doing great, thank you for asking! How can I help you today?';
    } else if (msg.includes('payment method') || msg.includes('how to pay') || msg.includes('payment option')) {
      return '💳 We accept:\n• Credit/Debit Cards\n• UPI (GPay, PhonePe, Paytm)\n• Net Banking\n• Cash on Delivery (COD)\n• Digital Wallets';
    } else if (msg.includes('cod') || msg.includes('cash on delivery')) {
      return '✅ Yes! Cash on Delivery is available for eligible orders. COD option will be shown at checkout if available for your location.';
    } else if (msg.includes('payment secure') || msg.includes('safe payment') || msg.includes('secure payment')) {
      return '🔒 Yes, absolutely! All online payments are 100% secure with SSL encryption and PCI-DSS compliance. Your payment information is never stored.';
    } else if (msg.includes('payment fail') || msg.includes('payment failed') || msg.includes('transaction fail')) {
      return '⚠️ If payment failed:\n1. Check if amount was deducted\n2. Wait 30 mins for auto-refund\n3. Try different payment method\n4. Contact support@medicalstore.com if issue persists';
    } else if (msg.includes('delivery time') || msg.includes('how long') || msg.includes('when will i get')) {
      return '🚚 Delivery Time:\n• Metro Cities: 2-3 days\n• Other Cities: 4-6 days\n• Remote Areas: 7-10 days\nYou\'ll get tracking details via SMS/Email.';
    } else if (msg.includes('deliver to') || msg.includes('delivery location') || msg.includes('do you deliver')) {
      return '📍 We deliver across India! Enter your pincode at checkout to check serviceability and estimated delivery time for your location.';
    } else if (msg.includes('shipping charge') || msg.includes('delivery charge') || msg.includes('delivery fee')) {
      return '📦 Shipping Charges:\n• FREE delivery on orders above ₹50000\n';
    } else if (msg.includes('change address') || msg.includes('delivery address') || msg.includes('wrong address')) {
      return '📮 To change delivery address:\n• Before dispatch: Go to My Orders → Edit Address\n• After dispatch: Contact support immediately at +91-9035500058';
    } else if (msg.includes('return policy') || msg.includes('how to return')) {
      return '↩️ Return Policy:\n• 7-day return for eligible products\n• Product must be unused & in original packaging\n• Prescription medicines are non-returnable\n• Initiate return from My Orders section';
    } else if (msg.includes('damaged') || msg.includes('defective') || msg.includes('broken')) {
      return '📦 For damaged/defective products:\n1. Take photos of the product\n2. Go to My Orders → Report Issue\n3. We\'ll arrange free pickup & replacement\n4. Or email: support@medicalstore.com';
    } else if (msg.includes('refund status') || msg.includes('refund') || msg.includes('money back')) {
      return '💰 Refund Status:\n• Refunds processed within 5-7 business days\n• Check status in My Orders → Refund Status\n• Amount credited to original payment method\n• For queries: support@medicalstore.com';
    } else if (msg.includes('human') || msg.includes('talk to agent') || msg.includes('customer support') || msg.includes('speak to someone')) {
      return '👤 Connect with our support team:\n📧 Email: support@medicalstore.com\n📞 Phone: +91-9035500058\n⏰ Available: 9 AM - 9 PM (Mon-Sat)\nWe\'ll respond within 2 hours!';
    } else if (msg.includes('order') || msg.includes('track')) {
      return 'To track your order, please visit the "My Orders" section in your account. You can also contact us at support@medicalstore.com for order assistance.';
    } else if (msg.includes('product') || msg.includes('medicine') || msg.includes('available')) {
      return 'You can browse our products by category or use the search bar. All available medicines and medical devices are listed with prices and stock information.';
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('discount')) {
      return 'We offer competitive prices on all products! Check our ongoing offers and discounts on the homepage. GST is included in the final price.';
    } else if (msg.includes('prescription') || msg.includes('upload')) {
      return 'For prescription medicines, please upload a valid prescription during checkout. Our team will verify it before processing your order.';
    } else {
      return 'I\'m here to help! You can ask me about:\n• Payments & COD\n• Shipping & Delivery\n• Returns & Refunds\n• Order Tracking\n• Product Queries';
    }
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { text: option, sender: 'user' }]);

    setTimeout(() => {
      let response = '';
      if (option === 'Track Order') {
        response = 'To track your order, please visit the "My Orders" section in your account. You can also contact us at support@medicalstore.com';
      } else if (option === 'Product Query') {
        response = 'What product are you looking for? You can browse by category or search for specific medicines and medical devices.';
      } else if (option === 'Contact Us') {
        response = 'You can reach us at:\n📧 Email: support@medicalstore.com\n📞 Phone: +91-9035500058\n⏰ Working Hours: 9 AM - 9 PM';
      } else if (option === 'Payments') {
        response = '💳 Payment Options:\n• Credit/Debit Cards\n• UPI (GPay, PhonePe, Paytm)\n• Net Banking\n• Cash on Delivery (COD)\n• Digital Wallets\n\nAll payments are 100% secure with SSL encryption!';
      } else if (option === 'Shipping & Delivery') {
        response = '🚚 Delivery Information:\n• Metro Cities: 2-3 days\n• Other Cities: 4-6 days\n• Remote Areas: 7-10 days\n• FREE delivery on orders above ₹50000\n';
      } else if (option === 'Returns & Support') {
        response = '↩️ Returns & Support:\n• 7-day return policy\n• Free pickup for damaged products\n• Refunds in 5-7 business days\n• 24/7 customer support\n📞 Call: +91-9035500058';
      }
      setMessages(prev => [...prev, { text: response, sender: 'bot' }, { text: 'options', sender: 'bot' }]);
    }, 500);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      const userMsg = inputMessage;
      setInputMessage('');

      setTimeout(() => {
        const response = getBotResponse(userMsg);
        setMessages(prev => [...prev, { text: response, sender: 'bot' }, { text: 'options', sender: 'bot' }]);
      }, 800);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('offerPopupShown')) return;
    const fetchActiveBanner = async () => {
      try {
        const { data } = await axios.get('/api/v1/homeoffers/active');
        if (data.homeOffer?.image?.url) {
          setActiveBanner(data.homeOffer.image.url);
          setShowOfferPopup(true);
          sessionStorage.setItem('offerPopupShown', '1');
        }
      } catch (error) {
        console.log('No active banner');
      }
    };
    fetchActiveBanner();
  }, []);

  return (
    <>
      <MetaData title="Online Medical Store for Medicines, Medical Devices, Health Supplements & More. Best Prices!" />

      {/* Hot Offers Popup */}
      {activeBanner && (
        <Dialog
          open={showOfferPopup}
          onClose={() => setShowOfferPopup(false)}
          maxWidth={false}
          PaperProps={{
            sx: {
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              maxWidth: isMobile ? '90vw' : '90vw',
              maxHeight: isMobile ? '70vh' : '90vh',
              margin: 2
            }
          }}
        >
          <IconButton
            onClick={() => setShowOfferPopup(false)}
            sx={{
              position: 'absolute',
              right: isMobile ? 16 : 8,
              top: isMobile ? 16 : 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1,
              width: isMobile ? 40 : 32,
              height: isMobile ? 40 : 32,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.9)'
              }
            }}
          >
            <CloseIcon fontSize={isMobile ? 'medium' : 'small'} />
          </IconButton>
          <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={activeBanner}
              alt="Hot Offers"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: isMobile ? '60vh' : '80vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* <Categories /> */}
      <main className="flex flex-col gap-responsive container-responsive mt-20 sm:mt-24 bg-gray-50 min-h-screen mobile-content">
        {/* Banner Section */}
        <section className="bg-white rounded-lg sm:rounded-2xl shadow-sm card-responsive ">
          <Banner />
        </section>
        {/* Discount Circle Cards */}
        <DiscountCircleCards />

        {/* Quick highlights with images and brand colors */}
        <HomeHighlights />

        {/* Products Section */}
        <HomeProducts />

        <HomeDelivery />
        <br></br>
      </main>

      {/* WhatsApp Button */}
      <Fab
        onClick={() => window.open('https://wa.me/919035500058', '_blank')}
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 50,
          height: 50,
          bgcolor: '#25D366',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          '&:hover': {
            bgcolor: '#128C7E',
            transform: 'scale(1.1)',
            boxShadow: '0 6px 25px rgba(37, 211, 102, 0.6)',
          },
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      >
        <WhatsAppIcon sx={{ color: 'white', fontSize: 26 }} />
      </Fab>

      {/* Chatbot */}
      <Fab
        onClick={() => setChatOpen(!chatOpen)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 6px 25px rgba(20, 184, 166, 0.6)',
          },

          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      >
        {chatOpen ? <CloseIcon sx={{ color: 'white' }} /> : <SmartToyIcon sx={{ color: 'white', fontSize: 26 }} />}
      </Fab>

      {chatOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: isMobile ? '90vw' : 350,
            height: isMobile ? '70vh' : 500,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: 1000
          }}
        >
          <Box sx={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', p: 2, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>

            <Avatar sx={{ bgcolor: 'white', color: '#0d9488' }}>
              <SmartToyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Medical Assistant</Typography>
              <Typography variant="caption">Online • Ready to help</Typography>
            </Box>
          </Box>


          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
            {messages.map((msg, idx) => (
              msg.text === 'options' ? (
                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleOptionClick('Track Order')}
                    sx={{ justifyContent: 'flex-start', borderColor: '#0d9488', color: '#0d9488', '&:hover': { bgcolor: '#0d9488', color: 'white' } }}
                  >
                    Track Order
                  </Button>

                    

                  <Button
                    variant="outlined"
                    startIcon={<HelpOutlineIcon />}
                    onClick={() => handleOptionClick('Product Query')}
                    sx={{ justifyContent: 'flex-start', borderColor: '#0d9488', color: '#0d9488', '&:hover': { bgcolor: '#0d9488', color: 'white' } }}
                  >
                    Product Query
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<ContactSupportIcon />}
                    onClick={() => handleOptionClick('Contact Us')}
                    sx={{ justifyContent: 'flex-start', borderColor: '#0d9488', color: '#0d9488', '&:hover': { bgcolor: '#0d9488', color: 'white' } }}
                  >
                    Contact Us
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => handleOptionClick('Payments')}
                    sx={{ justifyContent: 'flex-start', borderColor: '#0d9488', color: '#0d9488', '&:hover': { bgcolor: '#0d9488', color: 'white' } }}
                  >
                    💳 Payments
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => handleOptionClick('Shipping & Delivery')}
                    sx={{ justifyContent: 'flex-start', borderColor: '#0d9488', color: '#0d9488', '&:hover': { bgcolor: '#0d9488', color: 'white' } }}
                  >
                    🚚 Shipping & Delivery
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => handleOptionClick('Returns & Support')}
                    sx={{ justifyContent: 'flex-start', borderColor: '#0d9488', color: '#0d9488', '&:hover': { bgcolor: '#0d9488', color: 'white' } }}
                  >
                    ↩️ Returns & Support
                  </Button>

                </Box>
              ) : (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1.5,
                    alignItems: 'flex-end',
                    gap: 1
                  }}
                >
                  {msg.sender === 'bot' && (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#0d9488' }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}

                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: msg.sender === 'user' ? '#0d9488' : 'white',
                      color: msg.sender === 'user' ? 'white' : 'black',
                      borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',

                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                  </Paper>
                </Box>
              )
            ))}
          </Box>

          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                sx={{ bgcolor: '#0d9488', color: 'white', '&:hover': { bgcolor: '#0f766e' } }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Home;