import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAdminProducts } from '../../actions/productAction';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CategoryIcon from '@mui/icons-material/Category';

// Helper to get product image URL safely
const getProductImage = (product) => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0]?.url || product.images[0]?.secure_url || product.images[0] || null;
    }
    if (product?.image) return product.image;
    return null;
};

const ProductReport = () => {
    const dispatch = useDispatch();
    const reportRef = useRef();

    const { products, loading } = useSelector((state) => state.products || {});

    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    const totalProducts = products?.length || 0;
    const inStock = products?.filter((p) => p.stock > 0).length || 0;
    const outOfStock = products?.filter((p) => p.stock === 0).length || 0;

    // Category wise count
    const categoryData = categories.map((cat) => {
        const catProducts = products?.filter((p) => p.category === cat) || [];
        return {
            name: cat,
            total: catProducts.length,
            inStock: catProducts.filter((p) => p.stock > 0).length,
            outOfStock: catProducts.filter((p) => p.stock === 0).length,
        };
    });

    // Handle Print
    const handlePrint = () => {
        const now = new Date();

        // Build category rows HTML
        const catRows = categoryData.map((row, idx) => `
            <tr style="background:${idx % 2 === 0 ? '#f8faff' : '#fff'}">
                <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;">${idx + 1}</td>
                <td style="padding:7px 10px;border:1px solid #d1d5db;">${row.name}</td>
                <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;font-weight:600;color:#1d4ed8;">${row.total}</td>
                <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;color:#15803d;">${row.inStock}</td>
                <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;color:#dc2626;">${row.outOfStock}</td>
                <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;">${totalProducts > 0 ? Math.round((row.total / totalProducts) * 100) : 0}%</td>
            </tr>
        `).join('');

        // Build product rows HTML (no image column)
        const productRows = (products || []).map((p, idx) => {
            const inStockTxt = p.stock > 0
                ? `<span style="color:#15803d;font-weight:600;">✔ In Stock (${p.stock})</span>`
                : `<span style="color:#dc2626;font-weight:600;">✘ Out of Stock</span>`;
            return `
                <tr style="background:${idx % 2 === 0 ? '#f8faff' : '#fff'}">
                    <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;vertical-align:middle;">${idx + 1}</td>
                    <td style="padding:7px 10px;border:1px solid #d1d5db;vertical-align:middle;">${p.name || ''}</td>
                    <td style="padding:7px 10px;border:1px solid #d1d5db;vertical-align:middle;">${p.category || ''}</td>
                    <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;vertical-align:middle;">${p.stock}</td>
                    <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;vertical-align:middle;">${inStockTxt}</td>
                    <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:right;vertical-align:middle;">Rs.${(p.price || 0).toLocaleString()}</td>
                </tr>
            `;
        }).join('');


        const totalStock = (products || []).reduce((s, p) => s + (p.stock || 0), 0);
        const totalPrice = (products || []).reduce((s, p) => s + (p.price || 0), 0);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Product Report</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: Arial, sans-serif; font-size: 13px; color: #111; background: #fff; padding: 24px; }
                    .header { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 14px; margin-bottom: 20px; }
                    .header h1 { font-size: 20px; color: #1d4ed8; margin-bottom: 4px; }
                    .header p  { font-size: 11px; color: #555; margin-top: 3px; }
                    .kpi-row { display: table; width: 100%; border-collapse: separate; border-spacing: 10px; margin-bottom: 20px; }
                    .kpi-cell { display: table-cell; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 14px; text-align: center; background: #eff6ff; width: 33%; vertical-align: middle; }
                    .kpi-cell .val { font-size: 26px; font-weight: bold; color: #1d4ed8; }
                    .kpi-cell .lbl { font-size: 11px; color: #555; margin-top: 2px; }
                    .section-title { font-size: 13px; font-weight: bold; color: #1d4ed8; border-left: 4px solid #3b82f6; padding-left: 8px; margin: 18px 0 8px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    thead tr { background: #dbeafe; }
                    th { padding: 8px 10px; border: 1px solid #93c5fd; text-align: left; font-size: 12px; color: #1e40af; font-weight: bold; white-space: nowrap; }
                    td { padding: 7px 10px; border: 1px solid #d1d5db; font-size: 12px; vertical-align: middle; }
                    tfoot tr { background: #dbeafe; font-weight: bold; }
                    tfoot td { border: 1px solid #93c5fd; font-size: 12px; padding: 8px 10px; }
                    .footer { margin-top: 24px; border-top: 1px solid #ddd; padding-top: 10px; text-align: right; font-size: 10px; color: #888; }
                    @page { size: A4; margin: 15mm; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Product Report</h1>
                    <p>Sri Chakra India — Dental &amp; Medical Equipments</p>
                    <p>Generated on: ${now.toLocaleString('en-IN')}</p>
                    <p>Report ID: PRD-${Date.now()}</p>
                </div>

                <div class="kpi-row">
                    <div class="kpi-cell"><div class="val">${totalProducts}</div><div class="lbl">Total Products</div></div>
                    <div class="kpi-cell"><div class="val" style="color:#15803d">${inStock}</div><div class="lbl">In Stock</div></div>
                    <div class="kpi-cell"><div class="val" style="color:#dc2626">${outOfStock}</div><div class="lbl">Out of Stock</div></div>
                </div>

                <div class="section-title">Category-wise Summary</div>
                <table>
                    <thead>
                        <tr>
                            <th style="width:40px;text-align:center;">#</th>
                            <th>Category</th>
                            <th style="width:80px;text-align:center;">Total</th>
                            <th style="width:80px;text-align:center;">In Stock</th>
                            <th style="width:90px;text-align:center;">Out of Stock</th>
                            <th style="width:70px;text-align:center;">% Share</th>
                        </tr>
                    </thead>
                    <tbody>${catRows}</tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding:8px 10px;">Total</td>
                            <td style="text-align:center;color:#1d4ed8;">${totalProducts}</td>
                            <td style="text-align:center;color:#15803d;">${inStock}</td>
                            <td style="text-align:center;color:#dc2626;">${outOfStock}</td>
                            <td style="text-align:center;">100%</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="section-title">All Products (${totalProducts})</div>
                <table>
                    <thead>
                        <tr>
                            <th style="width:40px;text-align:center;">#</th>
                            <th>Product Name</th>
                            <th style="width:130px;">Category</th>
                            <th style="width:60px;text-align:center;">Stock</th>
                            <th style="width:120px;text-align:center;">Status</th>
                            <th style="width:90px;text-align:right;">Price (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody>${productRows}</tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding:8px 10px;">Total</td>
                            <td style="text-align:center;color:#1d4ed8;">${totalStock}</td>
                            <td style="text-align:center;">${totalProducts} products</td>
                            <td style="text-align:right;">Rs.${totalPrice.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="footer">
                    Sri Chakra India &nbsp;|&nbsp; Admin Report System &nbsp;|&nbsp; ${now.toLocaleDateString('en-IN')}
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 400);
    };


    return (
        <div className="p-4 sm:p-6">
            <MetaData title="Product Report | Admin" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Inventory2Icon style={{ color: '#2563eb' }} />
                    <h2 className="text-xl font-bold text-gray-800">Product Report</h2>
                </div>
                {totalProducts > 0 && (
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                    >
                        <PrintIcon fontSize="small" /> Print Report
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div ref={reportRef}>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 kpi-row">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-5 shadow-sm kpi-box">
                            <p className="text-xs text-gray-500 mb-1 lbl">Total Products</p>
                            <p className="text-3xl font-bold text-blue-700 val">{totalProducts}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 shadow-sm kpi-box">
                            <p className="text-xs text-gray-500 mb-1 lbl">In Stock</p>
                            <p className="text-3xl font-bold text-green-700 val">{inStock}</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-rose-100 border border-red-200 rounded-2xl p-5 shadow-sm kpi-box">
                            <p className="text-xs text-gray-500 mb-1 lbl">Out of Stock</p>
                            <p className="text-3xl font-bold text-red-600 val">{outOfStock}</p>
                        </div>
                    </div>

                    {/* Category Summary Table */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                        <div className="flex items-center gap-2 px-5 py-4 border-b bg-blue-50">
                            <CategoryIcon fontSize="small" style={{ color: '#2563eb' }} />
                            <h4 className="text-sm font-bold text-blue-800 section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                                Category-wise Summary
                            </h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-blue-50 border-b">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Category</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase">Total</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase">In Stock</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase">Out of Stock</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-blue-700 uppercase">% Share</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryData.map((row, idx) => (
                                        <tr key={row.name} className="border-b last:border-0 hover:bg-blue-50/40 transition-colors">
                                            <td className="px-4 py-3 text-gray-400 font-bold text-xs">{idx + 1}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                                            <td className="px-4 py-3 text-center font-semibold text-blue-700">{row.total}</td>
                                            <td className="px-4 py-3 text-center">
                                                {row.inStock > 0 ? (
                                                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                        {row.inStock}
                                                    </span>
                                                ) : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {row.outOfStock > 0 ? (
                                                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                                                        {row.outOfStock}
                                                    </span>
                                                ) : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600 font-medium">
                                                {totalProducts > 0 ? Math.round((row.total / totalProducts) * 100) : 0}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                                        <td className="px-4 py-3 font-bold text-gray-700" colSpan={2}>Total</td>
                                        <td className="px-4 py-3 text-center font-bold text-blue-700">{totalProducts}</td>
                                        <td className="px-4 py-3 text-center font-bold text-green-700">{inStock}</td>
                                        <td className="px-4 py-3 text-center font-bold text-red-600">{outOfStock}</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700">100%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Detailed Product Table */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                        <div className="px-5 py-4 border-b bg-gray-50">
                            <h4 className="text-sm font-bold text-gray-700">All Products ({totalProducts})</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-blue-50 border-b">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Product Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Category</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase">Stock</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-blue-700 uppercase">Status</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-blue-700 uppercase">Price (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products?.map((product, idx) => {
                                        return (
                                            <tr key={product._id} className="border-b last:border-0 hover:bg-blue-50/30 transition-colors">
                                                <td className="px-4 py-3 text-gray-400 font-bold text-xs">{idx + 1}</td>
                                                <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">
                                                    <span className="line-clamp-2">{product.name}</span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 text-xs">{product.category}</td>
                                                <td className="px-4 py-3 text-center font-semibold text-gray-700">{product.stock}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {product.stock > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                            <CheckCircleIcon style={{ fontSize: 12 }} /> In Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                                                            <CancelIcon style={{ fontSize: 12 }} /> Out
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-700">
                                                    ₹{product.price?.toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                                        <td className="px-4 py-3 font-bold text-gray-700" colSpan={3}>Total</td>
                                        <td className="px-4 py-3 text-center font-bold text-blue-700">
                                            {products?.reduce((s, p) => s + (p.stock || 0), 0) || 0}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-gray-600">{totalProducts} products</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-700">
                                            ₹{products?.reduce((s, p) => s + (p.price || 0), 0).toLocaleString() || 0}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductReport;
