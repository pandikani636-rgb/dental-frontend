// Utility functions for handling media URLs consistently across the application

import { backendUrl } from './config';

export const getImageUrl = (image) => {
    try {
        if (!image || typeof image !== 'object') return '/default.png';
        
        if (image.url && typeof image.url === 'string') {
            if (image.url.startsWith('http')) {
                return image.url;
            }
            return `${backendUrl}/admin/product/${image.url}`;
        }
        
        if (image.public_id && typeof image.public_id === 'string') {
            return `https://res.cloudinary.com/your-cloud-name/image/upload/${image.public_id}`;
        }
        
        return '/default.png';
    } catch (error) {
        console.error('Error in getImageUrl:', error);
        return '/default.png';
    }
};

export const getVideoUrl = (product) => {
    try {
        if (!product || typeof product !== 'object') return '';
        
        if (product.media_type === "videoUrl" && product.video_url && typeof product.video_url === 'string') {
            return product.video_url;
        }
        
        if (product.media_type === "videoFile" && product.video && typeof product.video === 'object') {
            if (product.video.url && typeof product.video.url === 'string') {
                return product.video.url.startsWith('http') 
                    ? product.video.url 
                    : `${backendUrl}/admin/product/${product.video.url}`;
            }
            if (product.video.public_id && typeof product.video.public_id === 'string') {
                return `https://res.cloudinary.com/your-cloud-name/video/upload/${product.video.public_id}`;
            }
        }
        
        if (product.video_url && typeof product.video_url === 'string') {
            return product.video_url;
        }
        
        return '';
    } catch (error) {
        console.error('Error in getVideoUrl:', error);
        return '';
    }
};

export const detectVideoPlatform = (url) => {
    if (!url || typeof url !== 'string') return '';

    const normalizedUrl = url.trim().toLowerCase();

    if (normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be')) {
        return 'youtube';
    } else if (normalizedUrl.includes('vimeo.com')) {
        return 'vimeo';
    } else if (normalizedUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv|m4v)$/i)) {
        return 'direct';
    }

    return '';
};