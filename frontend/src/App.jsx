import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './LandingPage';
import ArtistReview from './ArtistReview'; // Import your new page
import AudioCapture from './components/AudioCapture'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/review/:artist" element={<ArtistReview />} /> {/* Add the new route */}
        <Route path="/review" element={<AudioCapture/>} /> {/* Add the new route */}

      </Routes>
    </Router>
  );
}

export default App;
