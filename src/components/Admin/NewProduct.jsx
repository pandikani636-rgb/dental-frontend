import React, { useEffect, useState, useRef } from "react";
import {
    TextField,
    MenuItem,
    Button,
    Card,
    CardContent,
    Grid,
    Box,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import Swal from 'sweetalert2'

import { createProduct, clearErrors } from "../../actions/productAction";
import { getCategories } from "../../actions/categoryAction";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";

const NewProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const videoRef = useRef(null);

    const { loading, success, error } = useSelector((state) => state.newProduct);
    const { categories } = useSelector((state) => state.categories);

    // FORM STATES
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [gst, setGst] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [status, setStatus] = useState("Active");
    const [discount, setDiscount] = useState("");
    const [deliveryCharge, setDeliveryCharge] = useState("");
    const [returnPolicy, setReturnPolicy] = useState("No");
    const [returnDays, setReturnDays] = useState("");
    const [warranty, setWarranty] = useState("No");
    const [warrantyDuration, setWarrantyDuration] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");
    const [mediaType, setMediaType] = useState("images"); // "images", "videoUrl", or "both"

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Video preview state
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [videoPreviewType, setVideoPreviewType] = useState(""); // "youtube", "vimeo", "direct"

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        if (success) {
            Swal.fire({
                title: "Success!",
                text: "Product created successfully!",
                icon: "success",
                timer: 2000,
            });
            dispatch({ type: NEW_PRODUCT_RESET });
            navigate("/admin/products");
        }
    }, [dispatch, error, success, navigate, enqueueSnackbar]);

    // Update video preview when URL changes
    useEffect(() => {
        if (videoUrl && isValidUrl(videoUrl)) {
            const type = getVideoType(videoUrl);
            setVideoPreviewType(type);
            setIsVideoPlaying(true);
        } else if (!videoUrl) {
            setVideoPreviewType("");
        }
    }, [videoUrl]);

    // Handle video play/pause
    useEffect(() => {
        if (videoRef.current) {
            if (isVideoPlaying && videoPreviewType === "direct") {
                videoRef.current.play();
            } else if (!isVideoPlaying && videoPreviewType === "direct") {
                videoRef.current.pause();
            }
        }
    }, [isVideoPlaying, videoPreviewType]);

    // FIELD VALIDATION
    const validateField = (field, value) => {
        let msg = "";

        if (field === "name" && !value) msg = "Product name is required";
        if (field === "description" && !value) msg = "Description is required";
        if (field === "price" && (!value || value <= 0)) msg = "Price must be greater than 0";
        if (field === "stock" && value === "") msg = "Stock is required";
        if (field === "category" && !value) msg = "Please select a category";
        if (field === "status" && !value) msg = "Please select product status";
        if (field === "media" && images.length === 0 && !videoUrl.trim()) {
            msg = "At least one image or video URL is required";
        }
        if (field === "videoUrl" && videoUrl && !isValidUrl(videoUrl)) {
            msg = "Please enter a valid URL (YouTube, Vimeo, or direct video link)";
        }

        setErrors((prev) => ({ ...prev, [field]: msg }));
    };

    // URL validation function
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Get video type
    const getVideoType = (url) => {
        try {
            const parsedUrl = new URL(url);
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
        try {
            const parsedUrl = new URL(url);
            
            // YouTube URL handling
            if (parsedUrl.hostname.includes('youtube.com')) {
                const videoId = parsedUrl.searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
                // Handle YouTube shorts
                const shortsMatch = url.match(/youtube\.com\/shorts\/([^/?]+)/);
                if (shortsMatch) {
                    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
                }
            }
            
            // YouTube Short URL handling
            if (parsedUrl.hostname.includes('youtu.be')) {
                const videoId = parsedUrl.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }
            
            // Vimeo URL handling
            if (parsedUrl.hostname.includes('vimeo.com')) {
                const pathParts = parsedUrl.pathname.split('/');
                const videoId = pathParts[pathParts.length - 1];
                if (videoId && !isNaN(videoId)) {
                    return `https://player.vimeo.com/video/${videoId}`;
                }
            }
            
            // For direct video URLs, return the original URL
            return url;
        } catch {
            return url;
        }
    };

    // const validateForm = () => {
    //     validateField("name", name);
    //     validateField("description", description);
    //     validateField("price", price);
    //     validateField("stock", stock);
    //     validateField("category", category);
    //     validateField("status", status);
    //     validateField("media", mediaType === "images" ? images : videoUrl);
    //     if (videoUrl) validateField("videoUrl", videoUrl);

    //     return (
    //         name &&
    //         description &&
    //         price > 0 &&
    //         stock !== "" &&
    //         category &&
    //         status &&
    //         (mediaType === "images" ? images.length > 0 : videoUrl.trim() !== "")
    //     );
    // };

const validateForm = () => {
    validateField("name", name);
    validateField("description", description);
    validateField("price", price);
    validateField("stock", stock);
    validateField("category", category);
    validateField("status", status);
    validateField("media", images);
    if (videoUrl) validateField("videoUrl", videoUrl);

    return (
        name &&
        description &&
        price > 0 &&
        stock !== "" &&
        category &&
        status &&
        images.length > 0
    );
};

    const handleMediaTypeChange = (type) => {
        setMediaType(type);
        setErrors((prev) => ({ ...prev, media: "", videoUrl: "" }));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const totalImages = images.length + files.length;
        if (totalImages > 4) {
            enqueueSnackbar("Maximum 4 images allowed", { variant: "warning" });
            return;
        }

        setImages([...images, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((prev) => [...prev, reader.result]);
                }
            };
            reader.readAsDataURL(file);
        });

        if (isSubmitted) validateField("media", [...images, ...files]);
    };

    const handleVideoUrlChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
        
        if (isSubmitted) {
            validateField("media", url);
            validateField("videoUrl", url);
        }
    };



    const removeVideoUrl = () => {
        setVideoUrl("");
        setVideoPreviewType("");
        setIsVideoPlaying(false);
        if (isSubmitted) {
            validateField("media", "");
            validateField("videoUrl", "");
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagesPreview.filter((_, i) => i !== index);
        setImages(newImages);
        setImagesPreview(newPreviews);
        
        if (isSubmitted) validateField("media", newImages);
    };

    const toggleVideoPlay = () => {
        if (videoPreviewType === "direct" && videoRef.current) {
            if (isVideoPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
        setIsVideoPlaying(!isVideoPlaying);
    };

    // SUBMIT HANDLER
    const submitHandler = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!validateForm()) return;

        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("price", price);
        formData.set("gst", gst);
        formData.set("stock", stock);
        formData.set("category", category);
        formData.set("subCategory", subCategory);
        formData.set("status", status);
        formData.set("discount", discount);
        formData.set("delivery_charge", deliveryCharge);
        formData.set("return_policy", returnPolicy);
        formData.set("return_duration", returnDays);
        formData.set("warranty", warranty);
        formData.set("warranty_duration", warrantyDuration);
        formData.set("media_type", mediaType);

        images.forEach((img) => {
            formData.append("images", img);
        });
        
        if (videoUrl) {
            formData.set("video_url", videoUrl);
        }

        dispatch(createProduct(formData));
    };

    const cancelHandler = () => navigate("/admin/products");

    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <Card sx={{ width: "800px", borderRadius: "12px" }}>
                <h2 className="text-2xl font-bold text-gray-800 text-center mt-6 mb-2">
                    Add New Product
                </h2>

                <CardContent sx={{ padding: "28px 40px" }}>
                    <Box component="form" onSubmit={submitHandler} className="space-y-6" encType="multipart/form-data">
                        <Grid container spacing={3}>

                            {/* LEFT SIDE FORM */}
                            <Grid item xs={12} md={6}>
                                <div className="flex flex-col gap-4">
                                    {/* (Keep all the existing form fields exactly as they were) */}
                                    {/* NAME */}
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="outlined"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (isSubmitted) validateField("name", e.target.value);
                                        }}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                    />

                                    {/* DESCRIPTION */}
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            if (isSubmitted) validateField("description", e.target.value);
                                        }}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                    />

                                    {/* PRICE + GST */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TextField
                                            label="Price"
                                            type="number"
                                            variant="outlined"
                                            value={price}
                                            onChange={(e) => {
                                                setPrice(e.target.value);
                                                if (isSubmitted) validateField("price", e.target.value);
                                            }}
                                            error={!!errors.price}
                                            helperText={errors.price}
                                        />

                                        <TextField
                                            label="GST (%)"
                                            type="number"
                                            variant="outlined"
                                            value={gst}
                                            onChange={(e) => setGst(e.target.value)}
                                            placeholder="e.g., 18"
                                        />
                                    </div>

                                    {/* STOCK */}
                                    <TextField
                                        fullWidth
                                        label="Stock"
                                        type="number"
                                        variant="outlined"
                                        value={stock}
                                        onChange={(e) => {
                                            setStock(e.target.value);
                                            if (isSubmitted) validateField("stock", e.target.value);
                                        }}
                                        error={!!errors.stock}
                                        helperText={errors.stock}
                                    />

                                    {/* DISCOUNT + DELIVERY CHARGE */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TextField
                                            label="Discount (%)"
                                            type="number"
                                            variant="outlined"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            placeholder="e.g., 10"
                                        />

                                        <TextField
                                            label="Delivery Charge"
                                            type="number"
                                            variant="outlined"
                                            value={deliveryCharge}
                                            onChange={(e) => setDeliveryCharge(e.target.value)}
                                            placeholder="e.g., 50"
                                        />
                                    </div>

                                    {/* CATEGORY + STATUS */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <TextField
                                            label="Category"
                                            select
                                            variant="outlined"
                                            fullWidth
                                            value={category}
                                            onChange={(e) => {
                                                setCategory(e.target.value);
                                                setSubCategory("");
                                                if (isSubmitted) validateField("category", e.target.value);
                                            }}
                                            error={!!errors.category}
                                            helperText={errors.category}
                                        >
                                            {categories?.map((cat) => (
                                                <MenuItem key={cat._id} value={cat.name}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            label="Status"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value);
                                                if (isSubmitted) validateField("status", e.target.value);
                                            }}
                                            error={!!errors.status}
                                            helperText={errors.status}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </TextField>
                                    </div>

                                    {/* SUB CATEGORY */}
                                    {category && categories?.find(c => c.name === category)?.subCategories?.length > 0 && (
                                        <TextField
                                            fullWidth
                                            label="Sub Category"
                                            select
                                            variant="outlined"
                                            value={subCategory}
                                            onChange={(e) => setSubCategory(e.target.value)}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {categories.find(c => c.name === category).subCategories.map((sub, i) => (
                                                <MenuItem key={i} value={sub}>{sub}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}

                                    {/* RETURN POLICY + RETURN DAYS */}
                                    <div className={`grid grid-cols-1 ${returnPolicy === "Yes" ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-4`}>
                                        <TextField
                                            label="Return Policy"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            value={returnPolicy}
                                            onChange={(e) => {
                                                setReturnPolicy(e.target.value);
                                                if (e.target.value === "No") setReturnDays("");
                                            }}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>

                                        {returnPolicy === "Yes" && (
                                            <TextField
                                                label="Return Days"
                                                fullWidth
                                                variant="outlined"
                                                value={returnDays}
                                                onChange={(e) => setReturnDays(e.target.value)}
                                                placeholder="e.g., 15 days"
                                            />
                                        )}
                                    </div>

                                    {/* WARRANTY + WARRANTY DURATION */}
                                    <div className={`grid grid-cols-1 ${warranty === "Yes" ? "sm:grid-cols-2" : "sm:grid-cols-1"} gap-4`}>
                                        <TextField
                                            label="Warranty"
                                            select
                                            fullWidth
                                            variant="outlined"
                                            value={warranty}
                                            onChange={(e) => {
                                                setWarranty(e.target.value);
                                                if (e.target.value === "No") setWarrantyDuration("");
                                            }}
                                        >
                                            <MenuItem value="Yes">Yes</MenuItem>
                                            <MenuItem value="No">No</MenuItem>
                                        </TextField>

                                        {warranty === "Yes" && (
                                            <TextField
                                                label="Warranty Duration"
                                                fullWidth
                                                variant="outlined"
                                                value={warrantyDuration}
                                                onChange={(e) => setWarrantyDuration(e.target.value)}
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
                                            ) : (
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                                                    <div className="text-gray-400 mb-2">
                                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500">No images selected</p>
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
                                                At least 1 image required. Upload up to 4 images. Supported formats: JPG, PNG, WebP
                                            </p>
                                        </div>

                                    {/* VIDEO URL SECTION */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Product Video URL
                                            </label>
                                                {videoUrl && isValidUrl(videoUrl) && videoPreviewType && (
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
                                                error={!!errors.videoUrl}
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
                                                <div className="relative border rounded p-4 mb-3 bg-gray-50">
                                                    {videoPreviewType === "youtube" || videoPreviewType === "vimeo" ? (
                                                        // Embed for YouTube/Vimeo
                                                        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded p-2">
                                                            <iframe
                                                                src={`${getEmbedUrl(videoUrl)}?autoplay=${isVideoPlaying ? 1 : 0}&mute=1&loop=0&controls=1&playsinline=1`}
                                                                title="Video preview"
                                                                className="absolute top-0 left-0 w-full h-full border-0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                referrerPolicy="strict-origin-when-cross-origin"
                                                            />
                                                        </div>
                                                    ) : (
                                                        // Direct video file
                                                        <div className="relative">
                                                            <video
                                                                ref={videoRef}
                                                                controls={!isVideoPlaying}
                                                                muted
                                                                loop
                                                                className="w-full h-60 object-contain rounded p-2"
                                                                src={videoUrl}
                                                                onLoadedData={() => {
                                                                    if (isVideoPlaying && videoRef.current) {
                                                                        videoRef.current.play();
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
                                                </div>
                                            )}

                                            {(!videoUrl || !isValidUrl(videoUrl)) && (
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                                                    <div className="text-gray-400 mb-2">
                                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-500">Enter a valid video URL to see preview</p>
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
                        <Box className="flex justify-end gap-2 pt-4">
                            <Button variant="outlined" onClick={cancelHandler} sx={{ minWidth: "200px" }}>
                                CANCEL
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                                sx={{ minWidth: "200px" }}
                            >
                                {loading ? "Saving..." : "ADD PRODUCT"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewProduct;