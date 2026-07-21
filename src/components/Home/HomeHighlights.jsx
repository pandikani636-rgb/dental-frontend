import React from 'react';
import brandImg from '../../assets/images/Home/brand.svg';
import expertImg from '../../assets/images/Home/expert.svg';
import deliveryImg from '../../assets/images/Home/delivery.svg';
import tipsImg from '../../assets/images/Home/health_tips.svg';

const features = [
  { title: 'Certified Medicines', img: brandImg, desc: 'Genuine products sourced from verified vendors.' },
  { title: 'Expert Support', img: expertImg, desc: 'Pharmacists and health professionals to guide you.' },
  { title: 'Fast Delivery', img: deliveryImg, desc: 'Quick delivery options across the country.' },
  { title: 'Health Tips', img: tipsImg, desc: 'Trustworthy articles and practical advice.' },
];

const HomeHighlights = () => {
  return (
    <section className="bg-transparent mt-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-4 bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="w-14 h-14 flex items-center justify-center rounded-md bg-gradient-to-br from-dental-50 to-dental-100">
              <img src={f.img} alt={f.title} className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h4 className="text-md font-bold text-gray-800">{f.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeHighlights;
