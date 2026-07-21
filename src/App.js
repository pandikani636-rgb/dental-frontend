import ReturnPolicy from './components/ConsumerPolicy/ReturnPolicy';
import TermsOfUse from './components/ConsumerPolicy/TermsOfUse';
import Security from './components/ConsumerPolicy/Security';
import Privacy from './components/ConsumerPolicy/Privacy';
import CancellationPolicy from './components/ConsumerPolicy/CancellationPolicy';

import Payments from './components/Help/Payments';
import ShippingDetails from './components/Help/ShippingDetails';

import WebFont from 'webfontloader';
import Footer from './components/Layouts/Footer/Footer';
import Header from './components/Layouts/Header/Header';
import Login from './components/User/Login';
import Register from './components/User/Register';
import { Routes, Route, useLocation } from 'react-router-dom';
import { loadUser } from './actions/userAction';
import { getCartItems } from './actions/cartAction';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Account from './components/User/Account';
import ProtectedRoute from './Routes/ProtectedRoute';
import Home from './components/Home/Home';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import OrderConfirm from './components/Cart/OrderConfirm';
import Payment from './components/Cart/Payment';
import OrderStatus from './components/Cart/OrderStatus';
import OrderSuccess from './components/Cart/OrderSuccess';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/Dashboard';
import MainData from './components/Admin/MainData';
import OrderTable from './components/Admin/OrderTable';
import UpdateOrder from './components/Admin/UpdateOrder';
import ProductTable from './components/Admin/ProductTable';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import UserTable from './components/Admin/UserTable';
import UpdateUser from './components/Admin/UpdateUser';
import AddUser from './components/Admin/AddUser';
import ReviewsTable from './components/Admin/ReviewsTable';
import Wishlist from './components/Wishlist/Wishlist';
import NotFound from './components/NotFound';
import Categories from './components/Admin/Categories';
import AddCategory from './components/Admin/AddCategory';
import EditCategory from './components/Admin/EditCategory';
import Roles from './components/Admin/Roles';
import AddRole from './components/Admin/AddRole';
import EditRole from './components/Admin/EditRole';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import MedicineDelivery from './components/Pages/MedicineDelivery';
import MedicalEquipment from './components/Pages/MedicalEquipment';
import HealthConsultation from './components/Pages/HealthConsultation';
import EmergencySupport from './components/Pages/EmergencySupport';
import PrescriptionUpload from './components/Pages/PrescriptionUpload';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import TermsOfService from './components/Pages/TermsOfService';
import ContactTable from './components/Admin/ContactTable';
import BannerTable from './components/Admin/BannerTable';
import AddBanner from './components/Admin/AddBanner';
import EditBanner from './components/Admin/EditBanner';
import EditUser from './components/Admin/EditUser';
import OffersForm from './components/Admin/OffersForm';
import HomeOffer from './components/Admin/HomeOffer';
import HomeOfferForm from './components/Admin/HomeOfferForm';
import CancelOrders from './components/Admin/CancelOrders';
import ProductSalesReport from './components/Admin/ProductSalesReport';
import ProductReport from './components/Admin/ProductReport';
import HelpCenter from './components/Pages/HelpCenter';
import ReturnsRefunds from './components/Pages/ReturnsRefunds';
import TrackOrder from './components/Pages/TrackOrder';
import FAQ from './components/Pages/FAQ';
import CustomerCare from './components/Pages/CustomerCare';


function App() {

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto:300,400,500,600,700"]
      },
    });
  });

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      // User is logged in - fetch fresh cart from database
      dispatch(getCartItems());
    } else if (isAuthenticated === false) {
      // User is NOT logged in - clear any stale localStorage cart data
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingInfo');
      localStorage.removeItem('saveForLaterItems');
      localStorage.removeItem('buyNowItem');
    }
  }, [dispatch, isAuthenticated]);

  // always scroll to top on route/path change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname])

  // disable right click
  // window.addEventListener("contextmenu", (e) => e.preventDefault());
  // window.addEventListener("keydown", (e) => {
  //   if (e.keyCode == 123) e.preventDefault();
  //   if (e.ctrlKey && e.shiftKey && e.keyCode === 73) e.preventDefault();
  //   if (e.ctrlKey && e.shiftKey && e.keyCode === 74) e.preventDefault();
  // });

  // Check if current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Consumer Policy Routes in Footer */}
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/security" element={<Security />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />


        {/* Help Routes in Footer */}
        <Route path="/payments" element={<Payments />} />
        <Route path="/shippingdetails" element={<ShippingDetails />} />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />


        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/medicine-delivery" element={<MedicineDelivery />} />
        <Route path="/medical-equipment" element={<MedicalEquipment />} />
        <Route path="/health-consultation" element={<HealthConsultation />} />
        <Route path="/emergency-support" element={<EmergencySupport />} />
        <Route path="/prescription-upload" element={<PrescriptionUpload />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/returns-refunds" element={<ReturnsRefunds />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/customer-care" element={<CustomerCare />} />


        <Route path="/cart" element={<Cart />} />

        {/* order process */}
        <Route path="/shipping" element={
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        } ></Route>

        <Route path="/order/confirm" element={
          <ProtectedRoute>
            <OrderConfirm />
          </ProtectedRoute>
        } ></Route>

        <Route path="/process/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } ></Route>

        <Route path="/orders/success" element={<OrderSuccess success={true} />} />
        <Route path="/orders/failed" element={<OrderSuccess success={false} />} />
        {/* order process */}

        <Route path="/order/:id" element={
          <ProtectedRoute>
            <OrderStatus />
          </ProtectedRoute>
        } ></Route>

        <Route path="/orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }></Route>

        <Route path="/order_details/:id" element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }></Route>

        <Route path="/account/update" element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        } ></Route>

        <Route path="/password/update" element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        } ></Route>



        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />

        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } ></Route>

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={0}>
              <MainData />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/categories" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={1}>
              <Categories />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        {/* Add this new route for Add Category */}
        <Route path="/admin/categories/new" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={1}>
              <AddCategory />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/categories/edit/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={1}>
              <EditCategory />
            </Dashboard>
          </ProtectedRoute>
        } />

        <Route path="/admin/orders" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={2}>
              <OrderTable />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/order/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={2}>
              <UpdateOrder />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/products" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={3}>
              <ProductTable />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/new_product" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={4}>
              <NewProduct />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/product/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={3}>
              <UpdateProduct />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/users" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={5}>
              <UserTable />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/user/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={5}>
              <UpdateUser />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/users/new" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={5}>
              <AddUser />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/users/edit/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={5}>
              <EditUser />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/roles" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={6}>
              <Roles />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/role/new" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={6}>
              <AddRole />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/role/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={6}>
              <EditRole />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/banner" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={7}>
              <BannerTable />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/banner/add" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={7}>
              <AddBanner />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/banner/edit/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={7}>
              <EditBanner />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/reviews" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={8}>
              <ReviewsTable />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>


        <Route path="/admin/contacts" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={8}>
              <ContactTable />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/homeoffer" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={9}>
              <HomeOffer />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/homeoffer/add" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={9}>
              <HomeOfferForm />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/homeoffer/edit/:id" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={9}>
              <HomeOfferForm />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/offers" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={10}>
              <OffersForm />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/cancelorders" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={11}>
              <CancelOrders />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/product-sales-report" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={12}>
              <ProductSalesReport />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="/admin/product-report" element={
          <ProtectedRoute isAdmin={true}>
            <Dashboard activeTab={13}>
              <ProductReport />
            </Dashboard>
          </ProtectedRoute>
        } ></Route>

        <Route path="*" element={<NotFound />}></Route>

      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;