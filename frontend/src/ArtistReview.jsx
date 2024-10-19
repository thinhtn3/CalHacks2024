// frontend/src/ContactPage.jsx
import React from 'react';
import AudioCapture from './components/AudioCapture';
import axios from "axios";

export default function ContactPage({artist}) {

  const [artistReview, setArtistReview] = useState([null]);
  const fetchArtistReview = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/review/fetch/slander`)
    if(response.data) {
      setArtistReview(response.data);
    } else{
      console.log("No reviews found");
    }
  }

  useEffect(() => {
    fetchArtistReview();
  }, []);

  return (
    <div>
      <AudioCapture />
      {artistReview && artistReview.map((review) => (
        <div key={review.id}>
          <p>{review.review}</p>
        </div>
      ))}
    </div>
  );
}

