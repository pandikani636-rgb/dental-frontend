import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';

const toInputDate = (date) => date.toISOString().split('T')[0];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Get all weeks (Sun-Sat) that overlap with the given month/year
const getWeeksOfMonth = (year, month) => {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let current = new Date(firstDay);
    // go back to Sunday
    current.setDate(current.getDate() - current.getDay());

    while (current <= lastDay) {
        const weekStart = new Date(current);
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // clamp to month boundaries for display
        const displayStart = weekStart < firstDay ? firstDay : weekStart;
        const displayEnd = weekEnd > lastDay ? lastDay : weekEnd;

        weeks.push({
            from: toInputDate(weekStart),
            to: toInputDate(weekEnd),
            label: `${displayStart.getDate()} ${MONTHS[displayStart.getMonth()].slice(0,3)} - ${displayEnd.getDate()} ${MONTHS[displayEnd.getMonth()].slice(0,3)}`
        });

        current.setDate(current.getDate() + 7);
    }
    return weeks;
};

const now = new Date();
const currentYear = now.getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const ProductSalesReport = () => {
    const today = toInputDate(now);
    const [activeType, setActiveType] = useState('monthly');
    const reportRef = useRef();

    // Day
    const [dayDate, setDayDate] = useState(today);

    // Week
    const [weekYear, setWeekYear] = useState(currentYear);
    const [weekMonth, setWeekMonth] = useState(now.getMonth());
    const [selectedWeek, setSelectedWeek] = useState(null);
    const weeks = getWeeksOfMonth(weekYear, weekMonth);

    // Month
    const [monthYear, setMonthYear] = useState(currentYear);
    const [monthMonth, setMonthMonth] = useState(now.getMonth());

    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [rangeLabel, setRangeLabel] = useState('');

    const fetchReport = async (from, to, label) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/v1/admin/product-sales-report?fromDate=${from}&toDate=${to}`);
            setReport(data.report);
            setSearched(true);
            setRangeLabel(label);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleTabChange = (type) => {
        setActiveType(type);
        setReport([]);
        setSearched(false);
        setSelectedWeek(null);
    };

    const handleDaySearch = () => {
        if (!dayDate) return;
        const d = new Date(dayDate);
        fetchReport(dayDate, dayDate, d.toLocaleDateString('en-IN'));
    };

    const handleWeekSearch = () => {
        const from = toInputDate(new Date(weekYear, weekMonth, 1));
        const start = new Date(weekYear, weekMonth, 1);
        start.setDate(start.getDate() - start.getDay());
        const end = new Date(weekYear, weekMonth + 1, 0);
        end.setDate(end.getDate() + (6 - end.getDay()));
        fetchReport(toInputDate(start), toInputDate(end), `${MONTHS[weekMonth]} ${weekYear} (Full Week Range)`);
    };

    const handleMonthSearch = () => {
        const from = toInputDate(new Date(monthYear, monthMonth, 1));
        const lastDate = new Date(monthYear, monthMonth + 1, 0);
        const to = toInputDate(lastDate);
        fetchReport(from, to, `${MONTHS[monthMonth]} ${monthYear}`);
    };

    // Print function
    const handlePrint = () => {
        const now = new Date();
        const totalQty = report.reduce((s, i) => s + i.totalQuantity, 0);
        const totalBase = report.reduce((s, i) => s + (i.totalBaseAmount || 0), 0);
        const totalGst = report.reduce((s, i) => s + (i.totalGstAmount || 0), 0);
        const totalDelivery = report.reduce((s, i) => s + (i.totalDeliveryCharges || 0), 0);
        const totalRev = report.reduce((s, i) => s + i.totalRevenue, 0);

        // Build summary rows HTML
        const rowsHtml = report.map((item, index) => `
            <tr style="background:${index % 2 === 0 ? '#f8faff' : '#fff'}">
                <td style="padding:10px; border:1px solid #ddd; text-align:center;">${index + 1}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:center;">
                    <img src="${item.image || '/default.png'}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; border:1px solid #eee;" />
                </td>
                <td style="padding:10px; border:1px solid #ddd;">${item.name}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:center;">${item.totalQuantity}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:right;">₹${(item.totalBaseAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:center;">${item.gstPercentage || 0}%</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:right;">₹${(item.totalGstAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:right;">₹${(item.totalDeliveryCharges || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style="padding:10px; border:1px solid #ddd; text-align:right; font-weight:600; color:#15803d;">₹${item.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `).join('');

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sales Report - ${rangeLabel}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
                    .header { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 20px; margin-bottom: 25px; }
                    .header h1 { margin: 0; color: #1d4ed8; font-size: 24px; }
                    .header p { margin: 5px 0; color: #666; font-size: 14px; }
                    .report-info { margin-bottom: 20px; font-size: 13px; font-weight: bold; color: #444; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background-color: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 12px 10px; text-align: left; font-size: 13px; }
                    td { border: 1px solid #ddd; padding: 10px; font-size: 13px; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .footer-row { background-color: #eff6ff; font-weight: bold; }
                    .footer-row td { border: 1px solid #bfdbfe; color: #1e40af; }
                    .print-meta { margin-top: 30px; text-align: right; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
                    @page { margin: 15mm; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Product Sales Report</h1>
                    <p>Sri Chakra India — Dental &amp; Medical Equipments</p>
                    <p>Period: ${rangeLabel}</p>
                </div>

                <div class="report-info">Summary: ${report.length} Products Sold</div>

                <table>
                    <thead>
                         <tr>
                            <th style="width:30px;" class="text-center">#</th>
                            <th style="width:60px;" class="text-center">Image</th>
                            <th>Product Name</th>
                            <th style="width:60px;" class="text-center">Qty</th>
                            <th style="width:90px;" class="text-right">Base (₹)</th>
                            <th style="width:50px;" class="text-center">GST %</th>
                            <th style="width:90px;" class="text-right">GST (₹)</th>
                            <th style="width:90px;" class="text-right">Delivery (₹)</th>
                            <th style="width:110px;" class="text-right">Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                    <tfoot>
                         <tr class="footer-row">
                            <td colspan="3" style="padding:12px 10px;">Total Sales Summary</td>
                            <td class="text-center" style="padding:12px 10px;">${totalQty}</td>
                            <td class="text-right" style="padding:12px 10px;">₹${totalBase.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td class="text-center" style="padding:12px 10px;">-</td>
                            <td class="text-right" style="padding:12px 10px;">₹${totalGst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td class="text-right" style="padding:12px 10px;">₹${totalDelivery.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td class="text-right" style="padding:12px 10px;">₹${totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="print-meta">
                    Generated on: ${now.toLocaleString('en-IN')} | Report ID: SAL-${Date.now()}
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    // init with current month
    useEffect(() => {
        const from = toInputDate(new Date(currentYear, now.getMonth(), 1));
        const to = toInputDate(new Date(currentYear, now.getMonth() + 1, 0));
        fetchReport(from, to, `${MONTHS[now.getMonth()]} ${currentYear}`);
    }, []);

    const maxQty = report.length > 0 ? report[0].totalQuantity : 1;

    return (
        <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BarChartIcon className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">Product Sales Report</h2>
                </div>
                
                {/* Print Button - Only show when report data is available */}
                {searched && report.length > 0 && (
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-all"
                    >
                        <PrintIcon fontSize="small" /> Print Report
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {[{ label: 'Day', type: 'day' }, { label: 'Week', type: 'week' }, { label: 'Month', type: 'monthly' }].map(({ label, type }) => (
                    <button
                        key={type}
                        onClick={() => handleTabChange(type)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            activeType === type ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Day */}
            {activeType === 'day' && (
                <div className="flex flex-wrap items-end gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">Date</label>
                        <select
                            value={new Date(dayDate).getDate()}
                            onChange={e => {
                                const d = new Date(dayDate);
                                d.setDate(Number(e.target.value));
                                setDayDate(toInputDate(d));
                            }}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {Array.from({ length: new Date(new Date(dayDate).getFullYear(), new Date(dayDate).getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">Month</label>
                        <select
                            value={new Date(dayDate).getMonth()}
                            onChange={e => {
                                const d = new Date(dayDate);
                                d.setMonth(Number(e.target.value));
                                setDayDate(toInputDate(d));
                            }}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">Year</label>
                        <select
                            value={new Date(dayDate).getFullYear()}
                            onChange={e => {
                                const d = new Date(dayDate);
                                d.setFullYear(Number(e.target.value));
                                setDayDate(toInputDate(d));
                            }}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <button onClick={handleDaySearch} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                        <SearchIcon fontSize="small" /> Search
                    </button>
                </div>
            )}

            {/* Week */}
            {activeType === 'week' && (
                <div className="flex flex-col gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex flex-wrap gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500">Month</label>
                            <select
                                value={weekMonth}
                                onChange={e => { setWeekMonth(Number(e.target.value)); setSelectedWeek(null); }}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500">Year</label>
                            <select
                                value={weekYear}
                                onChange={e => { setWeekYear(Number(e.target.value)); setSelectedWeek(null); }}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button onClick={handleWeekSearch} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                                <SearchIcon fontSize="small" /> Search
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Month */}
            {activeType === 'monthly' && (
                <div className="flex flex-wrap items-end gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">Month</label>
                        <select
                            value={monthMonth}
                            onChange={e => setMonthMonth(Number(e.target.value))}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-500">Year</label>
                        <select
                            value={monthYear}
                            onChange={e => setMonthYear(Number(e.target.value))}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <button onClick={handleMonthSearch} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                        <SearchIcon fontSize="small" /> Search
                    </button>
                </div>
            )}

            {searched && (
                <p className="text-sm text-gray-500 mb-4">
                    Results for: <span className="font-semibold text-blue-600">{rangeLabel}</span>
                </p>
            )}

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : searched && report.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <TrendingUpIcon style={{ fontSize: 48 }} />
                    <p className="mt-2">No sales data for this period</p>
                </div>
            ) : report.length > 0 ? (
                <div ref={reportRef}>
                <div ref={reportRef}>
                    <div className="bg-white rounded-xl shadow border overflow-hidden">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="px-4 py-3 text-left w-12 text-xs font-semibold text-gray-500 uppercase">#</th>
                                    <th className="px-4 py-3 text-left w-20 text-xs font-semibold text-gray-500 uppercase">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product Name</th>
                                    <th className="px-4 py-3 text-center w-24 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                                    <th className="px-4 py-3 text-right w-28 text-xs font-semibold text-gray-500 uppercase">Base (₹)</th>
                                    <th className="px-4 py-3 text-center w-20 text-xs font-semibold text-gray-500 uppercase">GST %</th>
                                    <th className="px-4 py-3 text-right w-28 text-xs font-semibold text-gray-500 uppercase">GST (₹)</th>
                                    <th className="px-4 py-3 text-right w-28 text-xs font-semibold text-gray-500 uppercase">Delivery (₹)</th>
                                    <th className="px-4 py-3 text-right w-32 text-xs font-semibold text-gray-500 uppercase">Total (₹)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((item, index) => (
                                    <tr key={item.productId} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 text-center text-sm font-bold text-gray-400">{index + 1}</td>
                                        <td className="px-4 py-4">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-10 h-10 object-cover rounded-lg border shadow-sm" 
                                                onError={e => { e.target.src = '/default.png'; }} 
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-sm font-bold text-gray-700">{item.totalQuantity}</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="text-sm font-medium text-gray-600">{(item.totalBaseAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">{item.gstPercentage || 0}%</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="text-sm font-medium text-orange-600">{(item.totalGstAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="text-sm font-medium text-gray-500">{(item.totalDeliveryCharges || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="text-sm font-bold text-blue-600">{(item.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-blue-50 border-t-2 border-blue-100">
                                    <td colSpan={3} className="px-4 py-4 text-sm font-bold text-gray-700 text-center">Report Total Summary</td>
                                    <td className="px-4 py-4 text-center text-sm font-extrabold text-blue-700">{report.reduce((s, i) => s + i.totalQuantity, 0)}</td>
                                    <td className="px-4 py-4 text-right text-sm font-extrabold text-gray-700">₹{report.reduce((s, i) => s + (i.totalBaseAmount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-center text-sm font-extrabold text-gray-400">-</td>
                                    <td className="px-4 py-4 text-right text-sm font-extrabold text-orange-700">₹{report.reduce((s, i) => s + (i.totalGstAmount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-sm font-extrabold text-gray-500">₹{report.reduce((s, i) => s + (i.totalDeliveryCharges || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 text-right text-sm font-extrabold text-blue-800">₹{report.reduce((s, i) => s + i.totalRevenue, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                </div>
            ) : null}
        </div>
    );
};

export default ProductSalesReport;