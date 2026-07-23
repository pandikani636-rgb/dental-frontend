import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../Layouts/Loader';
import HomeProductCard from './HomeProductCard';
import Pagination from '@mui/material/Pagination';
import { useSnackbar } from 'notistack';

const HomeProducts = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [currentPage, setCurrentPage] = useState(1);
    const [onMobile, setOnMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setOnMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { products, loading, error, resultPerPage, filteredProductsCount } = useSelector(state => state.products);

    useEffect(() => {
        // Use a wider price range and ensure we get all products
        dispatch(getProducts("", "", [0, 50000000], 0, currentPage));
    }, [dispatch, currentPage]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
    }, [dispatch, error, enqueueSnackbar]);

    return (
        <div className="px-4 lg:px-0 container mx-auto">
            {/* Products List */}
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {loading ? <Loader /> : (!products || products.length === 0) ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow">
                        <img 
                            draggable="false" 
                            className="w-1/2 h-32 object-contain" 
                            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png" 
                            alt="No results" 
                        />
                        <h1 className="font-semibold text-center text-gray-900">Sorry, no results found!</h1>
                        <p className="text-center text-gray-500">Please check the spelling or try another medicine</p>
                    </div>
                ) : (
                    (products || []).map((product) => (
                        <HomeProductCard 
                            key={product._id} 
                            {...product}
                            // Ensure video prop is passed correctly
                            video={product.video || null}
                            images={product.images || []}
                        />
                    ))
                )}

                {/* Pagination */}
                {filteredProductsCount > resultPerPage && (
                    <div className="col-span-full flex justify-center mt-4">
                        <Pagination
                            count={Math.ceil(filteredProductsCount / resultPerPage)}
                            page={currentPage}
                            onChange={(e, val) => setCurrentPage(val)}
                            color="primary"
                            size={onMobile ? "small" : "medium"}
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomeProducts;