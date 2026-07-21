import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PriceSidebar from './PriceSidebar';
import Stepper from './Stepper';
import { useNavigate, Link } from 'react-router-dom';
import { clearErrors, newOrder } from '../../actions/orderAction';
import { EMPTY_CART, REMOVE_FROM_CART } from '../../constants/cartConstants';
import { NEW_ORDER_RESET } from '../../constants/orderConstants';
import { useSnackbar } from 'notistack';
import { saveShippingInfo, getCartItems } from '../../actions/cartAction';
import MetaData from '../Layouts/MetaData';


const Shipping = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { cartItems } = useSelector((state) => state.cart);
    const { shippingInfo } = useSelector((state) => state.cart);
    const { error, order } = useSelector((state) => state.newOrder);

    const [allStates, setAllStates] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState("");

    // Check for Buy Now item
    const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
    const displayItems = buyNowItem ? [buyNowItem] : cartItems;

    const [address, setAddress] = useState(shippingInfo.address || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [district, setDistrict] = useState(shippingInfo.district || "");
    const [country, setCountry] = useState('IN');
    const [state, setState] = useState(shippingInfo.state || "");
    const [pincode, setPincode] = useState(shippingInfo.pincode || "");
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
    const [landmark, setLandmark] = useState(shippingInfo.landmark || "");
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Real-time validation states
    const [fieldErrors, setFieldErrors] = useState({ address: "", pincode: "", phoneNo: "" });
    const [fieldTouched, setFieldTouched] = useState({ address: false, pincode: false, phoneNo: false });

    const validateField = (name, value) => {
        switch (name) {
            case "address":
                if (!value.trim()) return "Address is required";
                if (value.trim().length < 10) return "Please enter a complete address (min 10 characters)";
                return "";
            case "pincode":
                if (!value) return "Pincode is required";
                if (!/^[1-9][0-9]{5}$/.test(value)) return "Enter a valid 6-digit pincode";
                return "";
            case "phoneNo":
                if (!value) return "Phone number is required";
                if (!/^[6-9]\d{9}$/.test(value)) return "Enter a valid 10-digit Indian mobile number";
                return "";
            default: return "";
        }
    };

    const handleFieldChange = (name, value, setter) => {
        setter(value);
        if (fieldTouched[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleFieldBlur = (name, value) => {
        setFieldTouched(prev => ({ ...prev, [name]: true }));
        setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    // Calculate Total Price


    // Calculate all values
    const totalPrice = displayItems.reduce((sum, item) => {
        const basePrice = item.price * item.quantity;
        const gst = (basePrice * (item.gst || 0)) / 100;
        return sum + basePrice + gst;
    }, 0);

    const totalDiscount = displayItems.reduce((sum, item) => {
        const basePrice = item.price * item.quantity;
        const gst = (basePrice * (item.gst || 0)) / 100;
        const priceWithGst = basePrice + gst;
        const discount = (priceWithGst * (item.quantity > 1 ? (item.discount || 0) : 0)) / 100;
        return sum + discount;
    }, 0);

    const totalDelivery = displayItems.reduce((sum, item) => sum + (item.delivery_charge || 0), 0);

    const totalAmount = totalPrice - totalDiscount + totalDelivery;

    // const totalPrice = displayItems.reduce((acc, item) => acc + ((item.price + (item.price * item.gst /100 ) * item.quantity) + item.delivery_charge), 0);

    // Handle Order Success/Error
    useEffect(() => {
        if (error) {
            enqueueSnackbar("Your order something wrong", { variant: "error" });
            dispatch(clearErrors());
            setIsSubmitting(false);
        }

        if (order) {
            enqueueSnackbar("Your order confirmed successfully", { variant: "success" });

            // Only clear cart if it's a buyNow order
            if (buyNowItem) {
                localStorage.removeItem('buyNowItem');
            } else {
                // For cart orders, fetch updated cart from server
                dispatch(getCartItems());
            }

            navigate("/orders/success");
        }
    }, [dispatch, error, order, navigate, enqueueSnackbar, buyNowItem]);

    // Reset order state when component unmounts
    useEffect(() => {
        return () => {
            dispatch({ type: NEW_ORDER_RESET });
        };
    }, [dispatch]);

    // const shippingSubmit = async (e) => {
    //     e.preventDefault();

    //     if (isSubmitting) return;

    //     if (phoneNo.length !== 10) {
    //         enqueueSnackbar("Invalid Phone Number", { variant: "error" });
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     // Save shipping info to store
    //     const shippingData = { address, city, district, country, state, pincode, phoneNo, landmark };
    //     dispatch(saveShippingInfo(shippingData));
    //     setShowOrderSummary(true);

    //     // Create New Order in MongoDB
    //     const orderData = {
    //         shippingInfo: shippingData,
    //         orderItems: displayItems,
    //         totalPrice,
    //         paymentInfo: {
    //             id: "COD_" + Date.now(),
    //             status: "Pending"
    //         }
    //     };

    //     dispatch(newOrder(orderData));

    //     // Send email with delivery address
    //     try {
    //         await axios.post('/api/v1/send-delivery-email', {
    //             address,
    //             city,
    //             district,
    //             state,
    //             pincode,
    //             phoneNo,
    //             landmark: landmark || "",
    //             country: 'India'
    //         });
    //         enqueueSnackbar("Delivery details sent to your email", { variant: "success" });
    //     } catch (error) {
    //         console.error('Email sending failed:', error);
    //     }

    //     localStorage.removeItem('buyNowItem');
    //     // Navigation is handled in useEffect now
    // }

    const shippingSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submit
        const allErrors = {
            address: validateField("address", address),
            pincode: validateField("pincode", pincode),
            phoneNo: validateField("phoneNo", phoneNo),
        };
        setFieldErrors(allErrors);
        setFieldTouched({ address: true, pincode: true, phoneNo: true });

        if (Object.values(allErrors).some(e => e)) {
            return;
        }

        const shippingData = { address, city, district, country, state, pincode, phoneNo, landmark };
        dispatch(saveShippingInfo(shippingData));
        setShowOrderSummary(true);
    }
    const handleConfirmOrder = () => {
        setShowOrderSummary(false);
        setShowPaymentOptions(true);
    };

    const handlePaymentSelection = async (method) => {
        if (method === 'COD') {
            setIsProcessing(true);
            const orderData = {
                shippingInfo: { address, city, district, country, state, pincode, phoneNo, landmark },
                orderItems: displayItems,
                totalPrice: totalAmount,
                paymentInfo: { id: "COD_" + Date.now(), status: "Pending", method: "Cash On Delivery" }
            };
            dispatch(newOrder(orderData));
            try {
                await axios.post('/api/v1/send-delivery-email', {
                    address, city, district, state, pincode, phoneNo, landmark: landmark || "", country: 'India'
                });
            } catch (error) {
                console.error('Email sending failed:', error);
            }
            localStorage.removeItem('buyNowItem');
        } else {
            const paymentAmount = totalAmount;
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: 'rzp_test_S8wSq0AH4a56ga',
                    amount: Math.round(paymentAmount * 100),
                    currency: 'INR',
                    name: 'Sri Chakra India Dental & Medical Equipments Mfg',
                    description: 'Order Payment',
                    handler: async function (response) {
                        setIsProcessing(true);
                        const orderData = {
                            shippingInfo: { address, city, district, country, state, pincode, phoneNo, landmark },
                            orderItems: displayItems,
                            totalPrice: paymentAmount,
                            paymentInfo: {
                                id: response.razorpay_payment_id,
                                status: "Success",
                                method: method === 'Card' ? 'Credit/Debit Card' : 'UPI'
                            }
                        };
                        dispatch(newOrder(orderData));
                        try {
                            await axios.post('/api/v1/send-delivery-email', {
                                address, city, district, state, pincode, phoneNo, landmark: landmark || "", country: 'India'
                            });
                        } catch (error) {
                            console.error('Email sending failed:', error);
                        }
                        localStorage.removeItem('buyNowItem');
                    },
                    prefill: { contact: phoneNo },
                    theme: { color: '#2874f0' },
                    modal: {
                        ondismiss: function() {
                            enqueueSnackbar('Payment cancelled', { variant: 'warning' });
                        }
                    }
                };
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            };
        }
    };

    const cancelOrder = () => {
        localStorage.removeItem('buyNowItem');
        navigate('/cart');
    }

    // Fetch States on Mount
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const { data } = await axios.get('/api/v1/location/states');
                setAllStates(data.states);
            } catch (error) {
                console.error("Error fetching states:", error);
            }
        };
        fetchStates();
    }, []);

    // Sync selectedStateId when allStates or state (name) changes
    useEffect(() => {
        if (allStates.length > 0 && state) {
            // Flexible matching for state names (case-insensitive and handling potential 'and' vs '&' differences)
            const foundState = allStates.find(s =>
                s.state_name.toLowerCase() === state.toLowerCase() ||
                s.state_name.toLowerCase().replace(' and ', ' & ') === state.toLowerCase().replace(' and ', ' & ')
            );

            if (foundState) {
                if (foundState.state_id !== selectedStateId) {
                    setSelectedStateId(foundState.state_id);
                }
            }
        }
    }, [allStates, state]);

    // Fetch Districts when State ID changes
    useEffect(() => {
        if (selectedStateId) {
            const fetchDistricts = async () => {
                try {
                    setAllDistricts([]); // Clear old districts
                    // enqueueSnackbar("Loading districts...", { variant: "info", autoHideDuration: 1000 }); 
                    console.log("Fetching districts for State ID:", selectedStateId);

                    const { data } = await axios.get(`/api/v1/location/districts/${selectedStateId}`);

                    if (data && data.success && data.districts) {
                        console.log("Districts fetched:", data.districts.length);
                        setAllDistricts(data.districts);
                        // enqueueSnackbar(`Loaded ${data.districts.length} districts`, { variant: "success", autoHideDuration: 2000 });
                    } else {
                        console.warn("District fetch returned no data:", data);
                        enqueueSnackbar("No districts found for this state.", { variant: "warning" });
                    }
                } catch (error) {
                    console.error("Error fetching districts:", error);
                    enqueueSnackbar("Failed to load districts. Server error.", { variant: "error" });
                }
            };
            fetchDistricts();
        } else {
            setAllDistricts([]);
        }
    }, [selectedStateId, enqueueSnackbar]);

    // Manual Cities Data (Fallback if API fails or returns no data)
    const manualCities = {
        // Tamil Nadu Districts
        "Ariyalur": ["Ariyalur", "Udayarpalayam", "Sendurai", "Andimadam"],
        "Chengalpattu": ["Chengalpattu", "Cheyyur", "Madurantakam", "Pallavaram", "Tambaram", "Tirukalukundram", "Tiruporur", "Vandalur"],
        "Chennai": ["Alandur", "Ambattur", "Aminjikarai", "Ayanavaram", "Egmore", "Guindy", "Madhavaram", "Madhuravoyal", "Mambalam", "Mylapore", "Perambur", "Purasawalkam", "Sholinganallur", "Thiruvottiyur", "Tondiarpet", "Velachery"],
        "Coimbatore": ["Anaimalai", "Annur", "Coimbatore (North)", "Coimbatore (South)", "Kinathukadavu", "Madukkarai", "Mettupalayam", "Perur", "Pollachi", "Sulur", "Valparai"],
        "Cuddalore": ["Cuddalore", "Bhuvanagiri", "Chidambaram", "Kattumannarkoil", "Kurinjipadi", "Panruti", "Srimushnam", "Tittakudi", "Veppur", "Virudhachalam"],
        "Dharmapuri": ["Dharmapuri", "Harur", "Karimangalam", "Nallampalli", "Palacode", "Pappireddipatti", "Pennagaram"],
        "Dindigul": ["Attur", "Dindigul (East)", "Dindigul (West)", "Guziliamparai", "Kodaikanal", "Natham", "Nilakottai", "Oddanchatram", "Palani", "Vedasandur"],
        "Erode": ["Anthiyur", "Bhavani", "Erode", "Gobichettipalayam", "Kodumudi", "Modakkurichi", "Nambiyur", "Perundurai", "Sathyamangalam", "Thalavadi"],
        "Kallakurichi": ["Chinnasalem", "Kallakurichi", "Kalvarayan Hills", "Sankarapuram", "Tirukoilur", "Ulundurpet"],
        "Kancheepuram": ["Kancheepuram", "Kundrathur", "Sriperumbudur", "Uthiramerur", "Walajabad"],
        "Kanyakumari": ["Agastheeswaram", "Kalkulam", "Killiyoor", "Thiruvattar", "Thovalai", "Vilavancode"],
        "Karur": ["Aravakurichi", "Kadavur", "Karur", "Krishnarayapuram", "Kulithalai", "Manmangalam", "Pugalur"],
        "Krishnagiri": ["Anchetty", "Bargur", "Denkanikottai", "Hosur", "Krishnagiri", "Pochampalli", "Shoolagiri", "Uthangarai"],
        "Madurai": ["Kalligudi", "Madurai (East)", "Madurai (North)", "Madurai (South)", "Madurai (West)", "Melur", "Peraiyur", "Thirumangalam", "Thiruparankundram", "Usilampatti", "Vadipatti"],
        "Mayiladuthurai": ["Kuthalam", "Mayiladuthurai", "Sirkazhi", "Tharangambadi"],
        "Nagapattinam": ["Kilvelur", "Nagapattinam", "Thirukkuvalai", "Vedaranyam"],
        "Namakkal": ["Kolli Hills", "Kumarapalayam", "Mohanur", "Namakkal", "Paramathi Velur", "Rasipuram", "Senthamangalam", "Tiruchengode"],
        "Nilgiris": ["Coonoor", "Kotagiri", "Kundah", "Gudalur", "Ooty (Udhagamandalam)", "Pandalur"],
        "Perambalur": ["Alathur", "Kunnam", "Perambalur", "Veppanthattai"],
        "Pudukkottai": ["Alangudi", "Aranthangi", "Avudayarkoil", "Gandarvakottai", "Illuppur", "Karambakudi", "Kulathur", "Manamelkudi", "Ponnamaravathi", "Pudukkottai", "Thirumayam", "Viralimalai"],
        "Ramanathapuram": ["Kadaladi", "Kamuthi", "Kilakarai", "Mudukulathur", "Paramakudi", "Ramanathapuram", "Rameswaram", "Tiruvadanai", "Rajasingamangalam"],
        "Ranipet": ["Arakkonam", "Arcot", "Kalavai", "Nemili", "Sholinghur", "Walajah"],
        "Salem": ["Attur", "Edappadi", "Gangavalli", "Kadayampatti", "Mettur", "Omalur", "Salem", "Sankagiri", "Vazhapadi", "Yercaud"],
        "Sivaganga": ["Devakottai", "Ilayangudi", "Kalaiyarkovil", "Karaikudi", "Manamadurai", "Sivaganga", "Singampunari", "Thirupuvanam", "Tirupathur"],
        "Tenkasi": ["Alangulam", "Kadayanallur", "Sankarankovil", "Shenkottai", "Sivagiri", "Tenkasi", "Thiruvengadam", "Veerakeralamputhur"],
        "Thanjavur": ["Budalur", "Kumbakonam", "Orathanadu", "Papanasam", "Pattukottai", "Peravurani", "Thanjavur", "Thiruvaiyaru", "Thiruvidaimarudur"],
        "Theni": ["Andipatti", "Bodinayakanur", "Periyakulam", "Theni", "Uthamapalayam"],
        "Thoothukudi": ["Eral", "Ettayapuram", "Kayathar", "Kovilpatti", "Ottapidaram", "Sathankulam", "Srivaikuntam", "Thiruchendur", "Thoothukudi", "Vilathikulam"],
        "Tiruchirappalli": ["Lalgudi", "Manachanallur", "Manapparai", "Marungapuri", "Musiri", "Srirangam", "Thottiyam", "Thuraiyur", "Tiruchirappalli (East)", "Tiruchirappalli (West)"],
        "Tirunelveli": ["Ambasamudram", "Cheranmahadevi", "Manur", "Nanguneri", "Palayamkottai", "Radhapuram", "Thisayanvilai", "Tirunelveli"],
        "Tirupathur": ["Ambur", "Natrampalli", "Tirupathur", "Vaniyambadi"],
        "Tiruppur": ["Avinashi", "Dharapuram", "Kangeyam", "Madathukulam", "Palladam", "Tiruppur (North)", "Tiruppur (South)", "Uidumalaipettai", "Uthukuli"],
        "Tiruvallur": ["Avadi", "Gummidipoondi", "Pallipattu", "Ponneri", "Poonamallee", "R.K. Pet", "Tiruvallur", "Tiruttani", "Uthukkottai"],
        "Tiruvannamalai": ["Arani", "Chengam", "Chetpet", "Cheyyar", "Jamunamarathur", "Kilpennathur", "Polur", "Thandarampattu", "Tiruvannamalai", "Vandavasi", "Vembakkam", "Kalasapakkam"],
        "Tiruvarur": ["Kodavasal", "Koothanallur", "Mannargudi", "Nannilam", "Needamangalam", "Thiruthuraipoondi", "Tiruvarur", "Valangaiman"],
        "Vellore": ["Anaicut", "Gudiyatham", "Katpadi", "K.V. Kuppam", "Pernambut", "Vellore"],
        "Viluppuram": ["Gingee", "Kandachipuram", "Marakkanam", "Melmalayanur", "Tindivanam", "Vanur", "Vikravandi", "Viluppuram", "Thiruvennainallur"],
        "Virudhunagar": ["Aruppukottai", "Chettiarpatti", "Kariapatti", "Mallankinaru", "Mamsapuram", "Rajapalayam", "S. Kodikulam", "Sattur", "Seithur", "Sivakasi", "Srivilliputhur", "Sundarapandiam", "Thiruthangal", "Tiruchuli", "Vathirairuppu (Watrap)", "Vembakottai", "Virudhunagar", "W. Pudupatti"],

        // Major Telangana Districts
        "Mahabubabad": ["Bayyaram", "Chinnagudur", "Dornakal", "Garla", "Gudur", "Kesamudram", "Kuravi", "Mahabubabad", "Maripeda", "Narsimhulapet", "Nellikudur", "Thorrur"],
        "Hyderabad": ["Amberpet", "Asifnagar", "Bahadurpura", "Bandlaguda", "Charminar", "Golconda", "Khairatabad", "Kukatpally", "L.B. Nagar", "Malkajgiri", "Marredpally", "Musheerabad", "Nampally", "Rajendranagar", "Sanathnagar", "Secunderabad", "Serilingampally", "Shaikpet", "Uppal"],
        "Warangal": ["Atmakur", "Bhupalpally", "Cherial", "Chityal", "Geesugonda", "Ghanpur", "Hanamkonda", "Jangaon", "Mahabubabad", "Nallabelly", "Narsampet", "Parkal", "Raiparthy", "Raghunathpally", "Sangem", "Thorrur", "Warangal"]
    };

    // Fetch Cities/Taluks when District changes
    useEffect(() => {
        if (district) {
            const fetchCities = async () => {
                try {
                    // Clear previous city selection and cities list
                    setCity("");
                    setAllCities([]);

                    console.log("🏙️ Fetching cities for district:", district);

                    // PRIORITY 1: Check Manual Data (Guaranteed Correct List)
                    if (manualCities[district]) {
                        const fallbackCities = manualCities[district].map((cityName, index) => ({
                            city_id: `${district}_manual_${index}`,
                            city_name: cityName
                        }));
                        console.log("✅ Using MANUAL cities for:", district);
                        setAllCities(fallbackCities);
                        // enqueueSnackbar(`Loaded ${fallbackCities.length} cities/taluks for ${district}`, { variant: "success", autoHideDuration: 2000 });
                        return; // Stop here, don't call API
                    }

                    // PRIORITY 2: Call API for unknown districts
                    const { data } = await axios.get(
                        `/api/v1/location/cities/${encodeURIComponent(district)}`
                    );

                    console.log("📡 API Response:", data);

                    if (data && data.success && data.cities && data.cities.length > 0) {
                        console.log("✅ Cities loaded from API:", data.cities.length, "cities");
                        setAllCities(data.cities);
                        // enqueueSnackbar(`Loaded ${data.cities.length} cities/taluks for ${district}`, { variant: "success", autoHideDuration: 2000 });
                    } else {
                        throw new Error("No cities found in API");
                    }
                } catch (error) {
                    console.warn("⚠️ API fetch failed/empty for:", district);
                    console.error("❌ Error details:", error.message);

                    // Fallback to empty list if manual data also missing
                    setAllCities([]);
                    enqueueSnackbar(`No cities found for ${district}. Please enter manually.`, { variant: "warning" });
                }
            };
            fetchCities();
        } else {
            setCity("");
            setAllCities([]);
        }
    }, [district, enqueueSnackbar]);



    // Fetch location by Pincode
    useEffect(() => {
        if (pincode && pincode.toString().length === 6) {
            const fetchLocation = async () => {
                try {
                    const { data } = await axios.get(`/api/v1/location/bypincode/${pincode}`);
                    if (data && data.success && data.location) {
                        const location = data.location;
                        
                        // Find state from allStates
                        const foundState = allStates.find(s =>
                            s.state_name.toLowerCase() === location.state.toLowerCase() ||
                            s.state_name.toLowerCase().replace(' and ', ' & ') === location.state.toLowerCase().replace(' and ', ' & ')
                        );

                        if (foundState) {
                            setSelectedStateId(foundState.state_id);
                            setState(foundState.state_name);
                            
                            // Fetch districts for this state
                            try {
                                const districtRes = await axios.get(`/api/v1/location/districts/${foundState.state_id}`);
                                if (districtRes.data && districtRes.data.success && districtRes.data.districts) {
                                    setAllDistricts(districtRes.data.districts);
                                }
                            } catch (err) {
                                console.error("Error fetching districts:", err);
                            }
                        } else {
                            setState(location.state);
                        }
                        
                        setDistrict(location.district);
                        
                        // Create cities list from API response
                        let citiesList = [];
                        
                        // First, add all cities from the pincode API
                        if (location.allCities && location.allCities.length > 0) {
                            citiesList = location.allCities.map((cityName, index) => ({
                                city_id: `${location.district}_api_${index}`,
                                city_name: cityName
                            }));
                        }
                        
                        // Then, add manual cities if they exist and merge
                        if (manualCities[location.district]) {
                            const manualList = manualCities[location.district].map((cityName, index) => ({
                                city_id: `${location.district}_manual_${index}`,
                                city_name: cityName
                            }));
                            
                            // Merge and remove duplicates
                            const allCitiesMap = new Map();
                            [...citiesList, ...manualList].forEach(city => {
                                allCitiesMap.set(city.city_name, city);
                            });
                            citiesList = Array.from(allCitiesMap.values());
                        }
                        
                        setAllCities(citiesList);
                        setCity(location.city);
                        enqueueSnackbar("Location fetched successfully!", { variant: "success" });
                    }
                } catch (error) {
                    enqueueSnackbar("Invalid Pincode", { variant: "error" });
                    console.error("Error fetching location:", error);
                }
            };
            fetchLocation();
        }
    }, [pincode, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Flipkart: Shipping Details" />

            {isProcessing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
                        <p className="text-lg font-semibold text-gray-700">Processing your order...</p>
                        <p className="text-sm text-gray-500">Please wait</p>
                    </div>
                </div>
            )}


            <main className="w-full mt-20 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen pt-8">
                {/* Back to Home Link */}
                {/* <div className="absolute top-[100px] left-2 sm:left-8 z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                    >
                        &lt;&lt; Back to Home
                    </Link>
                </div> */}

                {/* <!-- row --> */}
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-12 sm:mt-16 m-auto sm:mb-7 overflow-hidden">

                    {/* <!-- cart column --> */}
                    <div className="flex-1">

                        <Stepper activeStep={1}>
                            <div className="w-full bg-white">

                                <form onSubmit={shippingSubmit} autoComplete="off" className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-1 sm:mx-8 my-4">

                                    <TextField
                                        value={pincode}
                                        onChange={(e) => handleFieldChange("pincode", e.target.value, setPincode)}
                                        onBlur={(e) => handleFieldBlur("pincode", e.target.value)}
                                        error={fieldTouched.pincode && Boolean(fieldErrors.pincode)}
                                        helperText={fieldTouched.pincode && fieldErrors.pincode}
                                        type="number"
                                        label="Pincode"
                                        fullWidth
                                        variant="outlined"
                                        required
                                        className="mb-4"
                                    />

                                    <TextField
                                        value={address}
                                        onChange={(e) => handleFieldChange("address", e.target.value, setAddress)}
                                        onBlur={(e) => handleFieldBlur("address", e.target.value)}
                                        error={fieldTouched.address && Boolean(fieldErrors.address)}
                                        helperText={fieldTouched.address && fieldErrors.address}
                                        fullWidth
                                        label="Address"
                                        variant="outlined"
                                        required
                                        className="mb-4"
                                    />

                                    <TextField
                                        value={phoneNo}
                                        onChange={(e) => handleFieldChange("phoneNo", e.target.value, setPhoneNo)}
                                        onBlur={(e) => handleFieldBlur("phoneNo", e.target.value)}
                                        error={fieldTouched.phoneNo && Boolean(fieldErrors.phoneNo)}
                                        helperText={fieldTouched.phoneNo ? fieldErrors.phoneNo : "10-digit Indian mobile number"}
                                        type="number"
                                        label="Phone No"
                                        fullWidth
                                        variant="outlined"
                                        required
                                        className="mb-4"
                                    />

                                    <div className="flex gap-6 mb-4">
                                        <FormControl fullWidth>
                                            <InputLabel id="country-select">Country</InputLabel>
                                            <Select
                                                labelId="country-select"
                                                id="country-select"
                                                defaultValue={country}
                                                disabled
                                                label="Country"
                                            >
                                                <MenuItem value={'IN'}>India</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth disabled={country ? false : true}>
                                            <InputLabel id="state-select">State</InputLabel>
                                            <Select
                                                labelId="state-select"
                                                id="state-select"
                                                value={selectedStateId}
                                                label="State"
                                                onChange={(e) => {
                                                    const id = e.target.value;
                                                    setSelectedStateId(id);
                                                    const found = allStates.find(s => s.state_id === id);
                                                    if (found) setState(found.state_name);
                                                    setDistrict(""); // Reset district when state changes
                                                }}
                                                required
                                            >
                                                {allStates.map((item) => (
                                                    <MenuItem key={item.state_id} value={item.state_id}>{item.state_name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="flex gap-6 mb-4">
                                        <FormControl fullWidth disabled={!selectedStateId}>
                                            <InputLabel id="district-select">District</InputLabel>
                                            <Select
                                                labelId="district-select"
                                                id="district-select"
                                                value={district}
                                                label="District"
                                                onChange={(e) => {
                                                    setDistrict(e.target.value);
                                                    setCity(""); // Reset city/taluk when district changes
                                                }}
                                                required
                                            >
                                                {allDistricts.length > 0 ? (
                                                    allDistricts.map((item) => (
                                                        <MenuItem key={item.district_id} value={item.district_name}>{item.district_name}</MenuItem>
                                                    ))
                                                ) : (
                                                    district && <MenuItem value={district}>{district}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth disabled={!district}>
                                            <InputLabel id="city-select">City/Taluk</InputLabel>
                                            <Select
                                                labelId="city-select"
                                                id="city-select"
                                                value={city}
                                                label="City/Taluk"
                                                onChange={(e) => setCity(e.target.value)}
                                                required
                                            >
                                                {allCities.length > 0 ? (
                                                    allCities.map((item) => (
                                                        <MenuItem key={item.city_id} value={item.city_name}>{item.city_name}</MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem value="" disabled>
                                                        {district ? "Loading cities..." : "Select a district first"}
                                                    </MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="flex gap-6 mb-4">
                                        <TextField
                                            label="Landmark (Optional)"
                                            fullWidth
                                            variant="outlined"
                                            value={landmark}
                                            onChange={(e) => setLandmark(e.target.value)}
                                        />
                                    </div> 
                                    <div className="flex flex-col sm:flex-row gap-3 mb-2">
                                        <button type="submit" className="bg-dental-600 hover:bg-dental-700 w-full sm:w-1/3 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-lg uppercase outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">save and deliver here</button>

                                        {buyNowItem && (
                                            <button type="button" onClick={cancelOrder} className="bg-red-500 hover:bg-red-600 w-full sm:w-1/3 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-lg uppercase outline-none transition-all duration-300">cancel order</button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </Stepper>

                        {showOrderSummary && (
                            <Stepper activeStep={2}>
                                <div className="w-full bg-white">
                                    <div className="w-full px-1 sm:px-8 pb-6 pt-6">
                                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                                            <p className="text-gray-600">{address}, {city}, {district}, {state} - {pincode}</p>
                                            <p className="text-gray-600">Phone: {phoneNo}</p>
                                        </div>
                                        <div className="mb-4">
                                            <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
                                            {displayItems.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                        <div>
                                                            <p className="font-medium text-gray-800">{item.name}</p>
                                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-semibold text-gray-800">₹{((item.price * item.quantity) + ((item.price * item.quantity) * (item.gst || 0) / 100) + (item.delivery_charge || 0)).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-4 mb-4">
                                            <div className="flex justify-between items-center text-xl font-bold">
                                                <span>Total Amount</span>
                                                <span className="text-dental-600">₹{totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setShowOrderSummary(false)} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                                                Edit Details
                                            </button>
                                            <button onClick={handleConfirmOrder} className="flex-1 py-3 bg-dental-600 text-white font-medium rounded-lg hover:bg-dental-700">
                                                Confirm Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Stepper>
                        )}

                        {showPaymentOptions && (
                            <Stepper activeStep={3}>
                                <div className="w-full bg-white">
                                    <div className="w-full px-1 sm:px-8 pb-6 pt-6">
                                        <div className="flex flex-col gap-3">
                                            <button onClick={() => handlePaymentSelection('COD')} className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-dental-600 hover:bg-dental-50 transition-all duration-200">
                                                <span className="text-2xl">💵</span>
                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-800">Cash On Delivery</p>
                                                    <p className="text-sm text-gray-600">Pay when you receive</p>
                                                </div>
                                            </button>
                                            <button onClick={() => handlePaymentSelection('Card')} className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-dental-600 hover:bg-dental-50 transition-all duration-200">
                                                <span className="text-2xl">💳</span>
                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                                                    <p className="text-sm text-gray-600">Pay via card</p>
                                                </div>
                                            </button>
                                            <button onClick={() => handlePaymentSelection('UPI')} className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-dental-600 hover:bg-dental-50 transition-all duration-200">
                                                <span className="text-2xl">📱</span>
                                                <div className="text-left">
                                                    <p className="font-semibold text-gray-800">UPI</p>
                                                    <p className="text-sm text-gray-600">Pay via UPI apps</p>
                                                </div>
                                            </button>
                                        </div>
                                        <button onClick={() => { setShowPaymentOptions(false); setShowOrderSummary(true); }} className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800 font-medium">
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </Stepper>
                        )}
                    </div>

                    <PriceSidebar cartItems={displayItems} orderStatus={order ? "Pending" : ""} />
                </div>
            </main>
        </>
    );
};

export default Shipping;
