import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Box,
    Grid,
    Typography,
    Chip,
    CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Videocam as VideoIcon, Image as ImageIcon } from '@mui/icons-material';
import axios from 'axios';

import MetaData from '../Layouts/MetaData';
import { 
    updateProduct, 
    getProductDetails, 
    clearErrors 
} from '../../actions/productAction';
import { getCategories } from "../../actions/categoryAction";
import { 
    UPDATE_PRODUCT_RESET, 
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL 
} from '../../constants/productConstants';
import Swal from 'sweetalert2';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
    const videoRef = useRef(null);

    const { product, error } = useSelector((state) => state.productDetails);
    const { loading, isUpdated, error: updateError } = useSelector((state) => state.product);
    const { categories } = useSelector((state) => state.categories);

    const [productForm, setProductForm] = useState({
        name: "",
        description: "",
        price: "",
        gst: "",
        cuttedPrice: "",
        category: "",
        subCategory: "",
        stock: "",
        status: "",
        discount: "",
        delivery_charge: "",
        return_policy: "No",
        return_duration: "",
        warranty: "No",
        warranty_duration: "",
    });

    // Media states
    const [mediaType, setMediaType] = useState("both");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoPreviewType, setVideoPreviewType] = useState("");
    const [existingMedia, setExistingMedia] = useState({ type: "both", images: [], videoUrl: "" });
    const [originalVideoUrl, setOriginalVideoUrl] = useState("");
    
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // URL validation function
    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return false;
        
        try {
            let urlToCheck = trimmedUrl;
            if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
                urlToCheck = 'https://' + urlToCheck;
            }
            
            new URL(urlToCheck);
            return true;
        } catch {
            const youtubePatterns = [
                /youtube\.com\/watch\?v=[a-zA-Z0-9_-]+/i,
                /youtube\.com\/embed\/[a-zA-Z0-9_-]+/i,
                /youtu\.be\/[a-zA-Z0-9_-]+/i,
                /youtube\.com\/shorts\/[a-zA-Z0-9_-]+/i
            ];
            const vimeoPattern = /vimeo\.com\/[0-9]+/i;
            
            return youtubePatterns.some(pattern => pattern.test(trimmedUrl)) || 
                   vimeoPattern.test(trimmedUrl);
        }
    };

    // Get video type
    const getVideoType = (url) => {
        if (!url || !isValidUrl(url)) return "";
        
        try {
            let urlToCheck = url;
            if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
                urlToCheck = 'https://' + urlToCheck;
            }
            
            const parsedUrl = new URL(urlToCheck);
            const hostname = parsedUrl.hostname.toLowerCase();
            
            if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
                return "youtube";
            } else if (hostname.includes('vimeo.com')) {
                return "vimeo";
            } else {
                return "direct";
            }
        } catch {
            return "direct";
        }
    };

    // Function to extract embed URL
    const getEmbedUrl = (url) => {
        if (!url || !isValidUrl(url)) return "";
        
        try {
            let urlToCheck = url;
            if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
                urlToCheck = 'https://' + urlToCheck;
            }
            
            const parsedUrl = new URL(urlToCheck);
            
            // YouTube URL handling
            if (parsedUrl.hostname.includes('youtube.com')) {
                const videoId = parsedUrl.searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
                
                const shortsMatch = url.match(/youtube\.com\/shorts\/([^/?]+)/);
                if (shortsMatch) {
                    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
                }
                
                const embedMatch = url.match(/youtube\.com\/embed\/([^/?]+)/);
                if (embedMatch) {
                    return `https://www.youtube.com/embed/${embedMatch[1]}`;
                }
            }
            
            if (parsedUrl.hostname.includes('youtu.be')) {
                const videoId = parsedUrl.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }
            
            if (parsedUrl.hostname.includes('vimeo.com')) {
                const pathParts = parsedUrl.pathname.split('/');
                const videoId = pathParts[pathParts.length - 1];
                if (videoId && !isNaN(videoId)) {
                    return `https://player.vimeo.com/video/${videoId}`;
                }
            }
            
            return url;
        } catch {
            return url;
        }
    };

    // FIELD VALIDATION
    const validateField = (field, value) => {
        let msg = "";

        switch(field) {
            case "name":
                if (!value.trim()) msg = "Product name is required";
                break;
            case "description":
                if (!value.trim()) msg = "Description is required";
                break;
            case "price":
                if (!value || value <= 0) msg = "Price must be greater than 0";
                break;
            case "cuttedPrice":
                if (value && parseFloat(value) <= parseFloat(productForm.price)) {
                    msg = "Cutted price must be greater than original price";
                }
                break;
            case "stock":
                if (value === "" || parseInt(value) < 0) msg = "Stock is required and must be 0 or greater";
                break;
            case "category":
                if (!value) msg = "Please select a category";
                break;
            case "status":
                if (!value) msg = "Please select product status";
                break;
            case "gst":
            case "discount":
                if (value && parseFloat(value) < 0) msg = "Value must be 0 or greater";
                break;
            case "delivery_charge":
                if (value && parseFloat(value) < 0) msg = "Delivery charge must be 0 or greater";
                break;
            case "media":
                if (images.length === 0 && imagesPreview.length === 0) {
                    msg = "At least one image is required";
                }
                break;
            case "videoUrl":
                if (videoUrl && !isValidUrl(videoUrl)) {
                    msg = "Please enter a valid URL (YouTube, Vimeo, or direct video link)";
                }
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [field]: msg }));
    };

    // Validate all fields
    const validateAllFields = () => {
        const newErrors = {};
        
        if (!productForm.name.trim()) newErrors.name = "Product name is required";
        if (!productForm.description.trim()) newErrors.description = "Description is required";
        if (!productForm.price || productForm.price <= 0) newErrors.price = "Price must be greater than 0";
        if (productForm.cuttedPrice && parseFloat(productForm.cuttedPrice) <= parseFloat(productForm.price)) {
            newErrors.cuttedPrice = "Cutted price must be greater than original price";
        }
        if (productForm.stock === "" || parseInt(productForm.stock) < 0) newErrors.stock = "Stock is required";
        if (!productForm.category) newErrors.category = "Please select a category";
        if (!productForm.status) newErrors.status = "Please select product status";
        
        if (images.length === 0 && imagesPreview.length === 0) {
            newErrors.media = "At least one image is required";
        }
        
        if (videoUrl && !isValidUrl(videoUrl)) {
            newErrors.videoUrl = "Please enter a valid URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Load product & categories
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    // Initialize form when product data is loaded
    useEffect(() => {
        if (product && product._id === id && !isInitialized) {
            setProductForm({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                gst: product.gst || "",
                cuttedPrice: product.cuttedPrice || "",
                category: product.category || "",
                subCategory: product.subCategory || "",
                stock: product.stock || "",
                status: product.status || "Active",
                discount: product.discount || "",
                delivery_charge: product.delivery_charge || "",
                return_policy: product.return_policy || "No",
                return_duration: product.return_duration || "",
                warranty: product.warranty || "No",
                warranty_duration: product.warranty_duration || "",
            });

            // Handle media
            const videoSource = product.video_url || product.videoUrl || (product.video && product.video.url);
            const productImages = product.images || [];
            
            // Set images
            if (productImages.length > 0) {
                const imageUrls = productImages.map(img => img.url);
                setImagesPreview(imageUrls);
            }
            
            // Set video URL
            if (videoSource) {
                setVideoUrl(videoSource);
                setOriginalVideoUrl(videoSource);
                
                if (isValidUrl(videoSource)) {
                    const type = getVideoType(videoSource);
                    setVideoPreviewType(type);
                }
            }
            
            // Set existing media
            setExistingMedia({
                type: "both",
                images: productImages,
                videoUrl: videoSource || ""
            });
            
            setIsInitialized(true);
        }

        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearErrors());
        }

        if (updateError) {
            enqueueSnackbar(updateError, { variant: 'error' });
            dispatch(clearErrors());
        }

        if (isUpdated) {
            Swal.fire({
                title: "Success!",
                text: "Product updated successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/admin/products');
                dispatch({ type: UPDATE_PRODUCT_RESET });
            });
        }
    }, [dispatch, product, id, error, updateError, isUpdated, enqueueSnackbar, navigate, isInitialized]);

    // Update video preview when URL changes
    useEffect(() => {
        if (mediaType === "videoUrl" && videoUrl && isValidUrl(videoUrl)) {
            const type = getVideoType(videoUrl);
            setVideoPreviewType(type);
        } else if (mediaType === "videoUrl" && !videoUrl) {
            setVideoPreviewType("");
        }
    }, [videoUrl, mediaType]);

    // Handle media type change
    const handleMediaTypeChange = (type) => {
        setMediaType(type);
        
        if (type === "images") {
            setVideoUrl("");
            setVideoPreviewType("");
        } else if (type === "videoUrl") {
            setImages([]);
            setImagesPreview([]);
        }
        
        setErrors((prev) => ({ ...prev, media: "", videoUrl: "" }));
    };

    // Image handler
    const handleImages = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const totalImages = images.length + files.length;
        if (totalImages > 4) {
            enqueueSnackbar("Maximum 4 images allowed", { variant: "warning" });
            return;
        }

        files.forEach((file) => {
            if (!file.type.startsWith('image/')) {
                enqueueSnackbar(`File ${file.name} is not an image`, { variant: 'error' });
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImages((prev) => [...prev, file]);
                    setImagesPreview((prev) => [...prev, reader.result]);
                    
                    if (errors.media) {
                        setErrors(prev => ({ ...prev, media: "" }));
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };



    const handleVideoUrlChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
        
        // Clear errors when user starts typing
        if (errors.videoUrl || errors.media) {
            setErrors(prev => ({ 
                ...prev, 
                videoUrl: "", 
                media: url.trim() ? "" : prev.media 
            }));
        }
    };

    const removeVideoUrl = () => {
        setVideoUrl("");
        setVideoPreviewType("");
        setIsVideoPlaying(false);
        
        // Set error if media type is videoUrl and URL is required
        if (mediaType === "videoUrl" && isSubmitted) {
            setErrors(prev => ({ ...prev, media: "Video URL is required" }));
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagesPreview.filter((_, i) => i !== index);
        setImages(newImages);
        setImagesPreview(newPreviews);
        
        if (isSubmitted && newImages.length === 0 && newPreviews.length === 0) {
            setErrors(prev => ({ ...prev, media: "One image is required" }));
        }
    };

    const toggleVideoPlay = () => {
        if (videoPreviewType === "direct" && videoRef.current) {
            if (isVideoPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => {
                    console.log("Video play failed:", e);
                });
            }
        }
        setIsVideoPlaying(!isVideoPlaying);
    };

    // Handle form field changes
    const handleFieldChange = (field, value) => {
        setProductForm(prev => ({ ...prev, [field]: value }));
        
        if (isSubmitted) {
            validateField(field, value);
        }
    };

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        // Validate all fields
        const isValid = validateAllFields();

        if (!isValid) {
            enqueueSnackbar("Please fix all errors before submitting", { variant: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', productForm.price);
        formData.append('gst', productForm.gst || 0);
        formData.append('cuttedPrice', productForm.cuttedPrice || 0);
        formData.append('category', productForm.category);
        formData.append('subCategory', productForm.subCategory || "");
        formData.append('stock', productForm.stock);
        formData.append('status', productForm.status);
        formData.append('discount', productForm.discount || 0);
        formData.append('delivery_charge', productForm.delivery_charge || 0);
        formData.append('return_policy', productForm.return_policy);
        formData.append('return_duration', productForm.return_duration || "");
        formData.append('warranty', productForm.warranty);
        formData.append('warranty_duration', productForm.warranty_duration || "");

        // Handle media
        formData.append('media_type', mediaType);
        
        // Add images
        images.forEach(img => {
            formData.append('images', img);
        });
        
        // If no new images but existing images, keep them
        if (images.length === 0 && existingMedia.images?.length > 0) {
            formData.append('keep_existing_images', 'true');
        }
        
        // Add video URL
        if (videoUrl) {
            formData.append('video_url', videoUrl.trim());
        }

        dispatch(updateProduct(id, formData));
    };

    const handleCancel = () => {
        navigate('/admin/products');
    };

    if (!product && !error) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex justify-center items-center p-4">
            <MetaData title="Admin: Update Product | Medical Store" />

            <Card sx={{ width: "100%", maxWidth: "900px", borderRadius: "12px" }}>
                <h2 className="text-2xl font-bold text-gray-800 text-center mt-6 mb-2">
                    Edit Product
                </h2>

                <CardContent sx={{ padding: { xs: "20px", md: "28px 40px" } }}>
                    <Box component="form" onSubmit={handleSubmit} className="space-y-6">
                        <Grid container spacing={3}>
                            {/* LEFT SIDE FORM */}
                            <Grid item xs={12} md={6}>
                                <div className="flex flex-col gap-4">
                                    
                                    {/* NAME */}
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="outlined"
                                        required
                                        value={productForm.name}
                                        onChange={(e) => handleFieldChange("name", e.target.value)}
                                        onBlur={() => validateField("name", productForm.name)}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />

                                    {/* DESCRIPTION */}
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        multiline
                                        rows={3}
                                        required
                                        variant="outlined"
                                        value={productForm.description}
                                        onChange={(e) => handleFieldChange("description", e.target.value)}
                                        onBlur={() => validateField("description", productForm.description)}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                    />

                                    {/* PRICE + CUTTED PRICE */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TextField
                                            label="Price *"
                                            type="number"
                                            variant="outlined"
                                            required
                                            value={productForm.price}
                                            onChange={(e) => handleFieldChange("price", e.target.value)}
                                            onBlur={() => validateField("price", productForm.price)}
                                            error={!!errors.price}
                                            helperText={errors.price}
                                            inputProps={{ min: 0, step: 0.01 }}
                                        />

                                        <TextField
                                            label="Cutted Price"
                                            type="number"
                                            variant="outlined"
                                            value={productForm.cuttedPrice}
                                            onChange={(e) => handleFieldChange("cuttedPrice", e.target.value)}
                                            onBlur={() => validateField("cuttedPrice", productForm.cuttedPrice)}
                                            error={!!errors.cuttedPrice}
                                            helperText={errors.cuttedPrice}
                                            inputProps={{ min: 0, step: 0.01 }}
                                            placeholder="Optional"
                                        />
                                    </div>

                                    {/* GST + DISCOUNT */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TextField
                                            label="GST (%)"
                                            type="number"
                                            variant="outlined"
                                            value={productForm.gst}
                                            onChange={(e) => handleFieldChange("gst", e.target.value)}
                                            onBlur={() => validateField("gst", productForm.gst)}
                                            error={!!errors.gst}
                                            helperText={errors.gst}
                                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                                            placeholder="e.g., 18"
                                        />

                                        <TextField
                                            label="Discount (%)"
                                            type="number"
                                            variant="outlined"
                                            value={productForm.discount}
                                            onChange={(e) => handleFieldChange("discount", e.target.value)}
                                            onBlur={() => validateField("discount", productForm.discount)}
                                            error={!!errors.discount}
                                            helperText={errors.discount}
                                            inputProps={{ min: 0, max: 100, step: 0.01 }}
                                            placeholder="e.g., 10"
                                        />
                                    </div>

                                    {/* STOCK */}
                                    <TextField
                                        fullWidth
                                        label="Stock *"
                                        type="number"
                                        variant="outlined"
                                        required
                                        value={productForm.stock}
                                        onChange={(e) => handleFieldChange("stock", e.target.value)}
                                        onBlur={() => validateField("stock", productForm.stock)}
                                        error={!!errors.stock}
                                        helperText={errors.stock}
                                        inputProps={{ min: 0 }}
                                    />

                                    {/* DELIVERY CHARGE */}
                                    <TextField
                                        label="Delivery Charge"
                                        type="number"
                                        variant="outlined"
                                        fullWidth
                                        value={productForm.delivery_charge}
                                        onChange={(e) => handleFieldChange("delivery_charge", e.target.value)}
                                        onBlur={() => validateField("delivery_charge", productForm.delivery_charge)}
                                        error={!!errors.delivery_charge}
                                        helperText={errors.delivery_charge}
                                        inputProps={{ min: 0 }}
                                        placeholder="e.g., 50"
                                    />

                                    {/* CATEGORY + STATUS */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TextField
                                            label="Category *"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            required
                                            value={productForm.category}
                                            onChange={(e) => {
                                                handleFieldChange("category", e.target.value);
                                                handleFieldChange("subCategory", "");
                                            }}
                                            onBlur={() => validateField("category", productForm.category)}
                                            error={!!errors.category}
                                            helperText={errors.category}
                                        >
                                            {categories?.map((cat) => (
                                                <MenuItem value={cat.name} key={cat._id}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            label="Status *"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            required
                                            value={productForm.status}
                                            onChange={(e) => handleFieldChange("status", e.target.value)}
                                            onBlur={() => validateField("status", productForm.status)}
                                            error={!!errors.status}
                                            helperText={errors.status}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                                        </TextField>
                                    </div>

                                    {/* SUB CATEGORY */}
                                    {productForm.category && categories?.find(c => c.name === productForm.category)?.subCategories?.length > 0 && (
                                        <TextField
                                            fullWidth
                                            label="Sub Category"
                                            select
                                            variant="outlined"
                                            value={productForm.subCategory}
                                            onChange={(e) => handleFieldChange("subCategory", e.target.value)}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {categories.find(c => c.name === productForm.category).subCategories.map((sub, i) => (
                                                <MenuItem key={i} value={sub}>{sub}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}

                                    {/* RETURN POLICY + RETURN DAYS */}
                                    <div className={`grid grid-cols-1 ${productForm.return_policy === "Yes" ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-4`}>
                                        <TextField
                                            label="Return Policy"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            value={productForm.return_policy}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleFieldChange("return_policy", value);
                                                if (value === "No") {
                                                    handleFieldChange("return_duration", "");
                                                }
                                            }}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>

                                        {productForm.return_policy === "Yes" && (
                                            <TextField
                                                label="Return Days"
                                                fullWidth
                                                variant="outlined"
                                                value={productForm.return_duration}
                                                onChange={(e) => handleFieldChange("return_duration", e.target.value)}
                                                placeholder="e.g., 15 days"
                                            />
                                        )}
                                    </div>

                                    {/* WARRANTY + WARRANTY DURATION */}
                                    <div className={`grid grid-cols-1 ${productForm.warranty === "Yes" ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-4`}>
                                        <TextField
                                            label="Warranty"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            value={productForm.warranty}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleFieldChange("warranty", value);
                                                if (value === "No") {
                                                    handleFieldChange("warranty_duration", "");
                                                }
                                            }}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>

                                        {productForm.warranty === "Yes" && (
                                            <TextField
                                                label="Warranty Duration"
                                                fullWidth
                                                variant="outlined"
                                                value={productForm.warranty_duration}
                                                onChange={(e) => handleFieldChange("warranty_duration", e.target.value)}
                                                placeholder="e.g., 2 years"
                                            />
                                        )}
                                    </div>
                                </div>
                            </Grid>

                            {/* RIGHT SIDE — MEDIA SELECTION */}
                            <Grid item xs={12} md={6}>
                                <div className="flex flex-col gap-6">

                                    {/* IMAGES SECTION */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Images ({imagesPreview.length}/4)
                                        </label>
                                            
                                            {imagesPreview.length > 0 ? (
                                                <div className="mb-3 grid grid-cols-2 gap-2">
                                                    {imagesPreview.map((img, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={img}
                                                                draggable="false"
                                                                className="w-full h-32 object-contain border rounded p-2"
                                                                alt={`Preview ${index + 1}`}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/150x100?text=Image+Error';
                                                                }}
                                                            />
                                                            <Button
                                                                size="small"
                                                                className="absolute top-1 right-1 min-w-0 p-1 bg-red-500 text-white"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : existingMedia.images?.length > 0 ? (
                                                <div className="mb-3 grid grid-cols-2 gap-2">
                                                    {existingMedia.images.map((img, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={img.url}
                                                                draggable="false"
                                                                className="w-full h-32 object-contain border rounded p-2"
                                                                alt={`Existing ${index + 1}`}
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/150x100?text=Image+Error';
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                    <p className="col-span-2 text-gray-500 text-center text-sm mt-2">
                                                        Existing images will be kept
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                                                    <div className="text-gray-400 mb-2">
                                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500">
                                                        No images selected
                                                    </p>
                                                </div>
                                            )}

                                            {imagesPreview.length < 4 && (
                                                <label className="mt-2 block w-full text-center rounded font-medium bg-blue-600 cursor-pointer text-white p-3 shadow hover:shadow-lg hover:bg-blue-700 transition">
                                                    <input
                                                        type="file"
                                                        name="images"
                                                        accept="image/*"
                                                        multiple
                                                        hidden
                                                        onChange={handleImages}
                                                    />
                                                    {imagesPreview.length > 0 ? "Add More Images" : "Choose Images"}
                                                </label>
                                            )}

                                            {errors.media && (
                                                <p className="text-red-600 text-sm mt-1">{errors.media}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                At least 1 image required. Upload up to 4 images. Supported formats: JPG, PNG, WebP, GIF
                                            </p>
                                        </div>

                                    {/* VIDEO URL SECTION */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Product Video URL
                                            </label>
                                                {videoUrl && isValidUrl(videoUrl) && videoPreviewType && videoPreviewType === "direct" && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={toggleVideoPlay}
                                                        sx={{ fontSize: '0.75rem', padding: '2px 8px' }}
                                                    >
                                                        {isVideoPlaying ? "Pause Preview" : "Play Preview"}
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Video URL Input */}
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder="Enter video URL (YouTube, Vimeo, or direct video link)"
                                                value={videoUrl}
                                                onChange={handleVideoUrlChange}
                                                onBlur={() => {
                                                    if (videoUrl.trim()) {
                                                        validateField("videoUrl", videoUrl);
                                                    }
                                                }}
                                                error={!!errors.videoUrl || !!errors.media}
                                                helperText={errors.videoUrl || errors.media}
                                                InputProps={{
                                                    endAdornment: videoUrl && (
                                                        <Button
                                                            size="small"
                                                            onClick={removeVideoUrl}
                                                            sx={{ minWidth: 'auto', padding: '4px' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </Button>
                                                    ),
                                                }}
                                                sx={{ marginBottom: 2 }}
                                            />

                                            {/* Video Preview */}
                                            {videoUrl && isValidUrl(videoUrl) && videoPreviewType && (
                                                <div className="relative border rounded p-2 mb-3 bg-gray-50" key={videoUrl}>
                                                    {videoPreviewType === "youtube" || videoPreviewType === "vimeo" ? (
                                                        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded">
                                                            <iframe
                                                                key={videoUrl}
                                                                src={`${getEmbedUrl(videoUrl)}?autoplay=0&mute=1&loop=0&controls=1&playsinline=1`}
                                                                title="Video preview"
                                                                className="absolute top-0 left-0 w-full h-full border-0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                referrerPolicy="strict-origin-when-cross-origin"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <video
                                                                key={videoUrl}
                                                                ref={videoRef}
                                                                controls={!isVideoPlaying}
                                                                muted
                                                                loop
                                                                className="w-full h-40 object-contain rounded"
                                                                src={videoUrl}
                                                                onLoadedData={() => {
                                                                    if (isVideoPlaying && videoRef.current) {
                                                                        videoRef.current.play().catch(e => {
                                                                            console.log("Auto-play failed:", e);
                                                                            setIsVideoPlaying(false);
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            {isVideoPlaying && (
                                                                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                                                    Auto-playing
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {existingMedia.data && videoUrl === originalVideoUrl && (
                                                        <Chip 
                                                            label="Existing video"
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            className="absolute top-2 right-2 bg-white"
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {/* Show existing video if no new URL entered */}
                                            {!videoUrl && originalVideoUrl && existingMedia.videoUrl === originalVideoUrl && (
                                                <div className="relative border rounded p-2 mb-3 bg-gray-50" key={originalVideoUrl}>
                                                    <Typography variant="caption" className="text-gray-600 mb-2 block">
                                                        Current video (delete URL above to remove):
                                                    </Typography>
                                                    {getVideoType(originalVideoUrl) === "youtube" || getVideoType(originalVideoUrl) === "vimeo" ? (
                                                        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded">
                                                            <iframe
                                                                key={originalVideoUrl}
                                                                src={`${getEmbedUrl(originalVideoUrl)}?autoplay=0&mute=1&loop=0&controls=1&playsinline=1`}
                                                                title="Existing video"
                                                                className="absolute top-0 left-0 w-full h-full border-0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                referrerPolicy="strict-origin-when-cross-origin"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <video
                                                                key={originalVideoUrl}
                                                                controls
                                                                muted
                                                                loop
                                                                className="w-full h-40 object-contain rounded"
                                                                src={originalVideoUrl}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!videoUrl && !originalVideoUrl && (
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                                                    <div className="text-gray-400 mb-2">
                                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500">
                                                        Enter a valid video URL to see preview
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs text-gray-500">
                                                    <strong>Supported URLs:</strong>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    • YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    • Vimeo: https://vimeo.com/123456789
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    • Direct video: https://example.com/video.mp4
                                                </p>
                                            </div>
                                        </div>
                                </div>
                            </Grid>
                        </Grid>

                        {/* BUTTONS */}
                        <Box className="flex justify-end gap-2 pt-4 flex-wrap">
                            <Button 
                                variant="outlined" 
                                onClick={handleCancel} 
                                disabled={loading}
                                sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                            >
                                CANCEL
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                                sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                            >
                                {loading ? <CircularProgress size={24} /> : "UPDATE PRODUCT"}
                            </Button>
                        </Box>

                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default UpdateProduct;