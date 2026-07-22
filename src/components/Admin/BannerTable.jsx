import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import { getAdminBanners, deleteBanner, clearErrors } from '../../actions/bannerAction';
import { DELETE_BANNER_RESET } from '../../constants/bannerConstants';
import { backendUrl } from '../../utils/config';

const BannerTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [searchTerm, setSearchTerm] = useState('');

    const { banners, loading, error } = useSelector(state => state.banners);
    const { isDeleted, error: deleteError } = useSelector(state => state.deleteBanner);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearErrors());
        }
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: 'error' });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar('Banner deleted successfully', { variant: 'success' });
            dispatch({ type: DELETE_BANNER_RESET });
            dispatch(getAdminBanners()); // Refresh the list
        }
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    useEffect(() => {
        dispatch(getAdminBanners());
    }, [dispatch]);

    // const handleDelete = async (id) => {
    //     const result = await Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#d33',
    //         cancelButtonColor: '#3085d6',
    //         confirmButtonText: 'Yes, delete it!'
    //     });

    //     if (result.isConfirmed) {
    //         dispatch(deleteBanner(id));
    //     }
    // };

    const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure? You won\'t be able to revert this!');
    
    if (isConfirmed) {
        dispatch(deleteBanner(id));
    }
};

    // Helper function to get correct media URL for admin uploads
    const getMediaUrl = (banner) => {
        if (!banner?.media?.url) return null;
        
        const mediaUrl = banner.media.url;
        if (mediaUrl.startsWith('http')) {
            return mediaUrl;
        }
        
        return `${backendUrl}/${mediaUrl.replace(/^\/+/, '')}`;
    };

    // Check if media is a video
    const isVideo = (banner) => {
        return banner?.bannerType === 'video' || banner?.media?.type === 'video';
    };

    // Placeholder images
    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%23f0f0f0'/%3E%3Ctext x='50' y='30' font-family='Arial' font-size='10' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

    const videoPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%232d3748'/%3E%3Ccircle cx='50' cy='30' r='15' fill='%234299e1'/%3E%3Cpolygon points='45,25 45,35 55,30' fill='white'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='8' text-anchor='middle' fill='%23ccc'%3EVideo%3C/text%3E%3C/svg%3E";

    const columns = [
        {
            field: 'sno',
            headerName: 'S.No',
            minWidth: 80,
            flex: 0.3,
        },
        {
            field: 'media',
            headerName: 'Media',
            minWidth: 150,
            flex: 0.5,
            renderCell: (params) => {
                const { mediaUrl, isVideo } = params.value;

                if (isVideo) {
                    return (
                        <img
                            src={videoPlaceholder}
                            alt="video banner"
                            className="w-20 h-12 object-cover rounded border border-blue-300"
                            title="Video Banner"
                        />
                    );
                }

                return mediaUrl ? (
                    <img
                        src={mediaUrl}
                        alt="banner"
                        className="w-20 h-12 object-cover rounded"
                        onError={(e) => {
                            e.target.src = placeholderImage;
                            e.target.onerror = null;
                        }}
                    />
                ) : (
                    <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                        <span>No Image</span>
                    </div>
                );
            },
        },
        {
            field: 'title',
            headerName: 'Title',
            minWidth: 200,
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Description',
            minWidth: 300,
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 100,
            flex: 0.3,
            renderCell: (params) => (
                <span className={`px-2 py-1 rounded text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {params.value ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            field: 'type',
            headerName: 'Type',
            minWidth: 100,
            flex: 0.3,
            renderCell: (params) => (
                <span className={`px-2 py-1 rounded text-xs ${params.value === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {params.value === 'video' ? 'Video' : 'Image'}
                </span>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 150,
            flex: 0.3,
            sortable: false,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate(`/admin/banner/edit/${params.row.id}`)}
                        variant="contained"
                        color="primary"
                        size="small"
                    >
                        <EditIcon fontSize="small" />
                    </Button>
                    <Button
                        onClick={() => handleDelete(params.row.id)}
                        variant="contained"
                        color="error"
                        size="small"
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                </div>
            ),
        },
    ];

    const rows = Array.isArray(banners) ? banners.map((banner, index) => {
        const mediaUrl = getMediaUrl(banner);
        const videoCheck = isVideo(banner);
        const rowId = banner._id || banner.id || `temp-${index}`;

        return {
            id: rowId,
            sno: index + 1,
            media: {
                mediaUrl: mediaUrl,
                isVideo: videoCheck
            },
            title: banner.title || 'Untitled',
            description: banner.description || 'No description',
            status: banner.isActive !== false,
            type: banner.bannerType || (videoCheck ? 'video' : 'image')
        };
    }) : [];

    // Filter rows based on search term with title priority
    const filteredRows = rows.filter(row => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = row.title.toLowerCase().includes(searchLower);
        const descriptionMatch = row.description.toLowerCase().includes(searchLower);
        const typeMatch = row.type.toLowerCase().includes(searchLower);
        
        return titleMatch || descriptionMatch || typeMatch;
    }).sort((a, b) => {
        // Prioritize exact title matches first
        const searchLower = searchTerm.toLowerCase();
        const aExactTitle = a.title.toLowerCase() === searchLower;
        const bExactTitle = b.title.toLowerCase() === searchLower;
        const aTitleStart = a.title.toLowerCase().startsWith(searchLower);
        const bTitleStart = b.title.toLowerCase().startsWith(searchLower);
        
        if (aExactTitle && !bExactTitle) return -1;
        if (!aExactTitle && bExactTitle) return 1;
        if (aTitleStart && !bTitleStart) return -1;
        if (!aTitleStart && bTitleStart) return 1;
        
        return 0;
    });

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Banner Management</h1>
                    <span className="text-gray-600">Total banners: {banners?.length || 0}</span>
                </div>
                <div className="flex items-center gap-4">
                    <TextField
                        size="small"
                        placeholder="Search banners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 250 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/admin/banner/add')}
                    >
                        Add Banner
                    </Button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow" style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    loading={loading}
                    getRowHeight={() => 'auto'}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '& .MuiDataGrid-row': {
                            maxHeight: 'none !important',
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default BannerTable;