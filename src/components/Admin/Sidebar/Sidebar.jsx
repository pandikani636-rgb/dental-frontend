import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ReviewsIcon from '@mui/icons-material/Reviews';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import ImageIcon from '@mui/icons-material/Image';
import BarChartIcon from '@mui/icons-material/BarChart';

import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import HomeIcon from '@mui/icons-material/Home';
import { useDispatch, useSelector } from 'react-redux';
import './Sidebar.css';
import Swal from 'sweetalert2';
import { logoutUser } from '../../../actions/userAction';
import { getOrderStatuses } from '../../../actions/orderStatusAction';

const navMenu = [
    {
        icon: <EqualizerIcon />,
        label: "Dashboard",
        ref: "/admin/dashboard",
        activeTab: 0
    },
    {
        icon: <CategoryIcon />,
        label: "Categories",
        ref: "/admin/categories",
        activeTab: 1
    },
    {
        icon: <InventoryIcon />,
        label: "Products",
        ref: "/admin/products",
        activeTab: 3
    },
    {
        icon: <ShoppingBagIcon />,
        label: "Orders",
        ref: "/admin/orders",
        activeTab: 2,
        hasSubItems: true
    },
    {
        icon: <GroupIcon />,
        label: "Users",
        ref: "/admin/users",
        activeTab: 5
    },
    {
        icon: <BadgeIcon />,
        label: "Roles",
        ref: "/admin/roles",
        activeTab: 6
    },
    {
        icon: <ImageIcon />,
        label: "Banner",
        ref: "/admin/banner",
        activeTab: 7
    },
    {
        icon: <ReviewsIcon />,
        label: "Contacts",
        ref: "/admin/contacts",
        activeTab: 8
    },
    {
        icon: <HomeIcon />,
        label: "Home Offer",
        ref: "/admin/homeoffer",
        activeTab: 9
    },
    {
        icon: <LocalOfferIcon />,
        label: "Email Offers",
        ref: "/admin/offers",
        activeTab: 10
    },
    {
        icon: <CancelIcon />,
        label: "Cancel Orders",
        ref: "/admin/cancelorders",
        activeTab: 11
    },
    {
        icon: <BarChartIcon />,
        label: "Sales Report",
        ref: "/admin/product-sales-report",
        activeTab: 12
    },
    {
        icon: <InventoryIcon />,
        label: "Product Report",
        ref: "/admin/product-report",
        activeTab: 13
    },
    {
        icon: <LogoutIcon />,
        label: "Logout",
    },
];

const Sidebar = ({ activeTab, setToggleSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useSelector((state) => state.user);
    const { orderStatuses } = useSelector((state) => state.orderStatuses);
    const [expandedMenu, setExpandedMenu] = useState(null);

    useEffect(() => {
        dispatch(getOrderStatuses());
    }, [dispatch]);

    // Build sub-items for Orders
    const orderSubItems = [
        {
            label: "All Orders",
            ref: "/admin/orders",
            activeTab: 2,
        },
        {
            label: "Processing",
            ref: "/admin/orders?status=Processing",
            activeTab: 2,
        },
        {
            label: "Shipping",
            ref: "/admin/orders?status=Shipped",
            activeTab: 2,
        },
        {
            label: "Delivered",
            ref: "/admin/orders?status=Delivered",
            activeTab: 2,
        },
        {
            label: "Cancelled",
            ref: "/admin/orders?status=Cancelled",
            activeTab: 2,
        },
        // Also keep dynamic ones if there are any others
        ...(orderStatuses?.filter(s => !["Processing", "Shipped", "Delivered", "Canceled"].includes(s.name)).map(status => ({
            label: status.name,
            ref: `/admin/orders?status=${status.name}`,
            activeTab: 2,
        })) || [])
    ];

    // Find if current path matches any nav item or its sub-items
    const getActiveMenu = () => {
        for (const item of navMenu) {
            if (item.label === "Orders") {
                if (orderSubItems.some(sub => 
                    location.pathname + (location.search ? `?status=${new URLSearchParams(location.search).get('status')}` : '') === sub.ref || 
                    (activeTab !== undefined && activeTab === sub.activeTab)
                )) {
                    return item.label;
                }
            }
            if (location.pathname === item.ref || (activeTab !== undefined && activeTab === item.activeTab)) {
                return item.label;
            }
        }
        return null;
    };

    // Auto-expand menu based on current route
    useEffect(() => {
        const activeLabel = getActiveMenu();
        if (activeLabel) {
            setExpandedMenu(activeLabel);
        }
    }, [location.pathname, location.search, activeTab, orderStatuses]);

    const isActive = (ref, itemActiveTab) => {
        const searchParams = new URLSearchParams(location.search);
        const currentPath = location.pathname + (searchParams.get('status') ? `?status=${searchParams.get('status')}` : '');
        const isPathMatch = currentPath === ref;
        const isTabMatch = activeTab !== undefined && activeTab === itemActiveTab && !location.search;
        return isPathMatch || isTabMatch;
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        Swal.fire({
            title: "Logout Successful!",
            text: "You have been logged out successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        navigate("/login");
    };

    const toggleMenu = (label) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    return (
        <aside className="sidebar z-50 md:z-10 fixed left-0 min-h-screen pb-14 max-h-screen w-full xs:w-80 sm:w-72 md:w-64 lg:w-72 
        bg-gradient-to-b from-[#E6F7F2] to-[#CFF1E7] text-gray-800 overflow-x-hidden overflow-y-auto
        border-r border-[#B2E5D8] shadow-xl flex flex-col">

            {/* Header */}
            <div className="px-4 py-5 border-b border-[#B2E5D8] bg-white/30 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-lg font-bold text-gray-800 text-center tracking-wider">
                    Sri Chakra India
                </h2>
                <p className="text-xs text-gray-600 text-center mt-1">
                    Dental & Medical Equipments
                </p>
            </div>

            {/* Menu */}
            <div className="flex flex-col w-full gap-1 px-3 py-4 flex-1">
                {navMenu.map((item, index) => {
                    const { icon, label, ref, activeTab: itemActiveTab } = item;
                    const subItems = label === "Orders" ? orderSubItems : null;
                    const isExpanded = expandedMenu === label;
                    const hasSubItems = label === "Orders";
                    
                    // Check if main item is active
                    const isMainActive = location.pathname === ref || 
                        (activeTab !== undefined && activeTab === itemActiveTab && !location.search);

                    return (
                        <div key={index} className="w-full">
                            {label === "Logout" ? (
                                <button
                                    onClick={handleLogout}
                                    className="group w-full flex items-center gap-3 py-2.5 px-4 rounded-xl 
                                    text-red-600 hover:bg-red-100 transition-all duration-300 mt-2"
                                >
                                    <span className="text-red-500 transition-transform group-hover:scale-110">{icon}</span>
                                    <span className="font-medium">{label}</span>
                                </button>
                            ) : hasSubItems ? (
                                <div className="flex flex-col w-full">
                                    <button
                                        onClick={() => toggleMenu(label)}
                                        className={`group flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300 w-full
                                        ${isExpanded || isMainActive
                                            ? "bg-blue-500/15 text-blue-700 font-semibold shadow-sm" 
                                            : "text-gray-700 hover:bg-white/60 hover:text-blue-600"
                                        }`}
                                    >
                                        <span className={`transition-all duration-300 ${
                                            isExpanded || isMainActive ? "text-blue-600 scale-110" : "text-gray-600 group-hover:text-blue-500"
                                        }`}>
                                            {icon}
                                        </span>
                                        <span className="flex-1 text-left">{label}</span>
                                        <span className={`transition-all duration-300 ${
                                            isExpanded || isMainActive ? "text-blue-600" : "text-gray-400"
                                        }`}>
                                            {isExpanded ? 
                                                <KeyboardArrowDownIcon fontSize="small" /> : 
                                                <KeyboardArrowRightIcon fontSize="small" />
                                            }
                                        </span>
                                    </button>

                                    {/* Submenu */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                                    }`}>
                                        <div className="flex flex-col ml-6 gap-0.5 border-l-2 border-blue-200/70 pl-2">
                                            {subItems.map((sub, subIdx) => {
                                                const subActive = isActive(sub.ref, sub.activeTab);
                                                const getDotColor = (name) => {
                                                    switch (name?.toLowerCase()) {
                                                        case 'processing': return 'bg-yellow-400';
                                                        case 'shipped':
                                                        case 'shipping': return 'bg-blue-400';
                                                        case 'delivered': return 'bg-green-500';
                                                        case 'canceled':
                                                        case 'cancelled': return 'bg-red-500';
                                                        default: return 'bg-gray-400';
                                                    }
                                                };
                                                return (
                                                    <Link
                                                        key={subIdx}
                                                        to={sub.ref}
                                                        onClick={() => {
                                                            if (setToggleSidebar) setToggleSidebar(false);
                                                        }}
                                                        className={`py-2 px-3 my-0.5 rounded-lg text-sm transition-all duration-200 no-underline flex items-center gap-2
                                                        ${subActive 
                                                            ? "bg-white text-blue-700 font-medium shadow-sm border-l-2 border-blue-500" 
                                                            : "text-gray-600 hover:bg-white/60 hover:text-blue-600"
                                                        }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(sub.label)} shadow-sm flex-shrink-0`}></span>
                                                        <span className="truncate">{sub.label}</span>
                                                        {subActive && (
                                                            <span className="ml-auto w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={ref}
                                    onClick={() => {
                                        if (setToggleSidebar) setToggleSidebar(false);
                                    }}
                                    className={`group flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300 no-underline relative
                                    ${isMainActive
                                            ? "bg-blue-500/15 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-500"
                                            : "text-gray-700 hover:bg-white/60 hover:text-blue-600 hover:border-l-4 hover:border-blue-400"
                                        }`}
                                >
                                    <span className={`transition-all duration-300 ${
                                        isMainActive ? "text-blue-600 scale-110" : "text-gray-600 group-hover:text-blue-500"
                                    }`}>
                                        {icon}
                                    </span>
                                    <span>{label}</span>

                                    {isMainActive && (
                                        <span className="absolute right-3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                    )}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="bg-white/40 backdrop-blur-sm rounded-t-xl p-3 text-center border-t border-[#B2E5D8] mt-auto">
                <p className="text-xs text-gray-600">
                    Developed by <a href='https://anjanainfotech.in/' target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Anjana Infotech</a>
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                    © {new Date().getFullYear()} All rights reserved
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;