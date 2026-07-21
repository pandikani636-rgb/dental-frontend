import { Link } from 'react-router-dom';

const Product = ({ image, name, offer, tag }) => {
    return (
<Link to="/products" className="flex flex-col items-center gap-3 p-5 cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 transform hover:scale-105 transition-transform duration-300">
        <img draggable="false" className="w-full h-full object-contain rounded-xl" src={image} alt={name} />
    </div>
    <h2 className="font-semibold text-gray-800 text-center text-sm mt-1">{name}</h2>
    <span className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">{offer}</span>
    <span className="text-gray-500 text-xs text-center">{tag}</span>
</Link>
    );
};

export default Product;
