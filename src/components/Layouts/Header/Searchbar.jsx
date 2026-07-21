import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Searchbar = () => {

    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products');
        }
    }

    const isOrdersPage = location.pathname.includes('/orders');

    return (
        // <form onSubmit={handleSubmit} className="w-full sm:w-9/12 px-1 sm:px-4 py-1.5 flex justify-between items-center shadow-md bg-white rounded-sm overflow-hidden">
        //     <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="text-sm flex-1 outline-none border-none placeholder-gray-500" type="text" placeholder="Search for medicines, medical devices and more" />
        //     <button type="submit" className="text-primary-blue"><SearchIcon /></button>
        // </form>
        <form onSubmit={handleSubmit} className={`w-full ${isOrdersPage ? 'sm:w-full sm:ml-0' : 'sm:w-9/12 sm:ml-[100px]'} px-2 sm:px-4 py-2 sm:py-1.5 flex justify-between items-center shadow-md bg-white rounded-lg sm:rounded-xl overflow-hidden ml-0`}>
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="text-responsive-sm flex-1 outline-none border-none placeholder-gray-500 min-w-0"
                type="text"
                placeholder="Search medicines..."
                aria-label="Search for medicines and medical devices"
            />
            <button
                type="submit"
                className="text-dental-600 p-1 touch-friendly hover:bg-gray-100 rounded transition-colors"
                aria-label="Search"
            >
                <SearchIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
            </button>
        </form>
    );
};

export default Searchbar;
