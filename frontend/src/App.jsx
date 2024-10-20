import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './LandingPage';
import ArtistReview from './ArtistReview'; // Import your new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/review/:artist" element={<ArtistReview />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
