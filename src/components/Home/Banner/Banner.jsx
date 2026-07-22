import { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Banner.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { backendUrl } from '../../../utils/config';

export const PreviousBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowBackIosIcon />
    </div>
  );
}

export const NextBtn = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <ArrowForwardIosIcon />
    </div>
  );
}

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, []);



  const fetchBanners = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/banners`);
      const data = await response.json();

      if (response.ok && data.banners) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (banner) => {
    if (!banner?.media?.url) return null;

    const mediaUrl = banner.media.url;
    if (mediaUrl.startsWith('http')) {
      return mediaUrl;
    }

    return `${backendUrl}/${mediaUrl.replace(/^\/+/, '')}`;
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('/').pop()?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const getVideoId = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      return url.split('shorts/')[1]?.split('?')[0];
    }
    return null;
  };

  const getVideoType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (/\.(mp4|webm|ogg|mov)$/i.test(url)) return 'direct';
    return 'unknown';
  };

  const settings = {
    autoplay: true,
    autoplaySpeed: 4000,
    dots: isMobile,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: !isMobile ? <PreviousBtn /> : false,
    nextArrow: !isMobile ? <NextBtn /> : false,
    arrows: !isMobile,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: true,
          arrows: false,
          swipe: true,
        }
      }
    ]
  };

  if (loading) {
    return (
      <section className="w-full banner-container">
        <div className="h-48 sm:h-60 lg:h-96 bg-gray-200 rounded-lg animate-pulse"></div>
      </section>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <section className="w-full banner-container">
      <Slider {...settings}>
        {banners.map((banner, i) => {
          const mediaUrl = getMediaUrl(banner);
          const isVideo = banner.bannerType === 'video' && banner.videoUrl;
          const videoType = isVideo ? getVideoType(banner.videoUrl) : null;

          return (
            <div key={banner._id || i} className="banner-slide">
              {isVideo ? (
                videoType === 'youtube' || videoType === 'vimeo' ? (
                  <div className="relative w-full h-48 sm:h-60 lg:h-96">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={videoType === 'youtube' ?
                        `${getEmbedUrl(banner.videoUrl).replace('youtube.com', 'youtube-nocookie.com')}?autoplay=1&mute=1&loop=1&playlist=${getVideoId(banner.videoUrl)}&controls=0&playsinline=1&enablejsapi=0&rel=0&modestbranding=1` :
                        `${getEmbedUrl(banner.videoUrl)}?autoplay=1&muted=1&loop=1&controls=0`
                      }
                      title={banner.title || 'Banner Video'}
                      allow="autoplay"
                      allowFullScreen
                      style={{ border: 0 }}
                    />
                  </div>
                ) : (
                  <video
                    className="h-48 sm:h-60 lg:h-96 w-full object-cover rounded-lg"
                    src={banner.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )
              ) : (
                <img
                  draggable="false"
                  className="h-48 sm:h-60 lg:h-96 w-full object-cover rounded-lg high-dpi-image"
                  src={mediaUrl}
                  alt={banner.title || `Banner ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              )}

              <div className="banner-overlay absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center max-w-3xl px-4">
                  <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-extrabold drop-shadow-lg">
                    {banner.title || 'Sri Chakra — Your Trusted Medical Partner'}
                  </h2>
                  <p className="text-white/90 mt-2 text-sm sm:text-base drop-shadow">
                    {banner.description || 'Verified medicines, expert guidance and fast delivery — your healthcare at home.'}
                  </p>
                  {banner.link && (
                    <div className="mt-4 pointer-events-auto">
                      <a
                        href="/products"
                        className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-dental-600 to-dental-400 text-white font-semibold shadow hover:brightness-105 transition"
                      >
                        Shop Medicines
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </section>
  );
};

export default Banner;