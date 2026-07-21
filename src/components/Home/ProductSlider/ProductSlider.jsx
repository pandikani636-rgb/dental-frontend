import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { getRandomProducts } from '../../../utils/functions';
import Product from './Product';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    swipe: false,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const ProductSlider = ({ title, tagline }) => {

    const { loading, products } = useSelector((state) => state.products);

    return (
        <section className="bg-white w-full overflow-hidden">
            {/* Header */}
            <div className="flex px-6 py-4 justify-between items-center">
                <div className="title flex flex-col gap-0.5">
                    <h1 className="text-xl font-medium">{title}</h1>
                    <p className="text-sm text-gray-400">{tagline}</p>
                </div>

                <Link
                    to="/products"
                    className="bg-gradient-to-r from-dental-600 to-dental-400 hover:from-dental-700 hover:to-dental-500 text-xs font-medium text-white px-5 py-2.5 rounded-sm uppercase transition-all duration-300"
                >
                    View All
                </Link>
            </div>

            {loading ? null : (
                <Slider {...settings} className="flex items-center p-1 justify-start">
                    {products &&
                        getRandomProducts(products, 12).map((product) => (
                            <Product {...product} key={product._id} />
                        ))}
                </Slider>
            )}
        </section>
    );
};

export default ProductSlider;
