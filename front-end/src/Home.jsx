import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Map } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className='rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl'>
    <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100'>
      <Icon className='h-6 w-6 text-emerald-800' />
    </div>
    <h3 className='mb-3 text-xl font-semibold text-gray-900'>{title}</h3>
    <p className='text-gray-600'>{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-emerald-50 to-white'>
      {/* Hero Section */}
      <section className='mx-auto max-w-6xl px-4 pt-20 text-center'>
        <h1 className='mb-6 text-5xl font-bold text-gray-900'>
          Navigate NYC,{' '}
          <span className='text-emerald-800'>Safer & Smarter</span>
        </h1>
        <p className='mx-auto mb-8 max-w-2xl text-xl text-gray-600'>
          Real-time bike route planning with community-driven updates on road
          conditions and bike lane accessibility in New York City.
        </p>
        <Link
          to='/login'
          className='inline-flex items-center rounded-full bg-emerald-800 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl'
        >
          Join the Community
        </Link>
      </section>

      {/* Features Section */}
      <section className='mx-auto max-w-6xl px-4 py-24'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900'>
            Everything you need for safer cycling
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>
            Cyclable combines real-time community reports with smart route
            planning to help you navigate the city safely and efficiently.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <FeatureCard
            icon={MapPin}
            title='Report Incidents'
            description='Easily report and share road construction, bike lane blockages, and other obstacles affecting cyclists in real-time.'
          />
          <FeatureCard
            icon={Map}
            title='Interactive Map'
            description='View all reported incidents on our interactive map to stay informed about current conditions along your planned route.'
          />
          <FeatureCard
            icon={Navigation}
            title='Smart Route Planning'
            description='Plan your journey with our intelligent routing system that considers bike lanes and helps you find the safest path to your destination.'
          />
        </div>
      </section>

      {/* About Section */}
      <section className='bg-emerald-900 py-24 text-white'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='mb-6 text-3xl font-bold'>About Cyclable</h2>
            <p className='text-lg text-emerald-100'>
              Cyclable is a community-driven platform designed to enhance the
              cycling experience in New York City. By combining real-time user
              reports with advanced route planning, we're making urban cycling
              safer and more accessible for everyone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
