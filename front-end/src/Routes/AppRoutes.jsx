import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../components/Auth/HomePage/Home.jsx';
import ListingDetails from '../components/Auth/Listing/ListingDetails.jsx';
import Footer from '../components/Layout/Footer.jsx';

/**
 * The central component that configures all application routes.
 *
 * @param {object} props
 * @param {function} props.onOpenLogin 
 */
function AppRoutes({ onOpenLogin }) {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Homepage Route */}
        <Route 
            path="/" 
            element={<Home onOpenLogin={onOpenLogin} />} 
        />

        {/* Dynamic Route for Listing Details */}
        <Route 
            path="/alojamento/:id" 
            element={<ListingDetails />} 
        />
        
        {/* Add more routes here in the future (e.g., Profile, Contact, etc.) */}

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;