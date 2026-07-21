import React from 'react';
import PropTypes from 'prop-types';

const AboutSite = ({ className = '', variant = 'blue', image, title, description, bullets = [] }) => {
  const isGreen = variant === 'green';
  const accentBg = isGreen ? 'bg-green-50' : 'bg-blue-50';
  const accentText = isGreen ? 'text-green-600' : 'text-blue-600';
  return (
    <section className={`bg-white rounded-lg sm:rounded-2xl shadow-sm card-responsive mt-4 sm:mt-6 p-6 ${className} border-l-4 ${isGreen ? 'border-green-500' : 'border-blue-500'}`}>
      <div className="flex gap-4 items-start sm:items-center flex-col sm:flex-row">
        <div className={`flex-shrink-0 w-full sm:w-auto px-3 py-4 rounded-lg ${accentBg} flex items-center justify-center`}> 
          <div className={`min-w-[3rem] text-3xl sm:text-4xl font-bold ${accentText}`}>{image ? <img src={image} alt="icon" className="w-10 h-10 object-contain" /> : '🏥'}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title || 'About Our Medical Store'}</h3>
          <p className="text-gray-600 mt-1 max-w-3xl">{description || 'We are an online medical store focused on providing verified medicines, trusted health products, and expert guidance to help you make informed choices. Our priorities are safety, quality, and convenience — from product authenticity and clear information to fast nationwide delivery and responsive customer support.'}</p>
          {bullets.length > 0 && (
            <ul className="mt-3 space-y-1 text-gray-600 list-disc ml-5">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

AboutSite.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['blue', 'green']),
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  bullets: PropTypes.array,
};

export default AboutSite;
