// frontend/src/ContactPage.jsx
import React from 'react';
import AudioCapture from './components/AudioCapture';
import { useState, useEffect } from 'react';
import axios from "axios";
import ReviewCard from "./components/ReviewCard";
import OverallRatingChart from "./components/OverallRatingChart";
import "./ArtistReview.css";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import ReviewForm from "./components/ReviewForm";
import { useParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";


export default function ContactPage({ }) {
  const { artist } = useParams();
  const [artistReview, setArtistReview] = useState([]);
  const [ratings, setratingss] = useState({
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  });
  const fetchArtistReview = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/review/fetch/${artist}`
      );
      if (response.data) {
        setArtistReview(response.data);
      } else {
        console.log("No reviews found");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const generateStars = (ratings) => {
    const stars = [];
    const fullStars = Math.floor(ratings); // Get the number of full stars
    const hasHalfStar = ratings % 1 !== 0; // Check if there's a half star

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <BsStarFill key={`full-${i}`} className="w-[25px] h-[25px]" />
      );
    }

    // Add half star if applicable
    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" className="w-[25px] h-[25px]" />);
    }

    // Add empty stars if needed (optional)
    const emptyStars = 5 - stars.length; // Assuming a total of 5 stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<BsStar className="w-[25px] h-[25px]" />); // You can replace this with an empty star icon if you have one
    }

    return stars;
  };

  const fetchRatings = () => {
    if (artistReview && artistReview.length > 0) {
      const counts = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
      };

      artistReview.forEach((review) => {
        switch (review.ratings) {
          case 1:
            counts.oneStar += 1;
            break;
          case 2:
            counts.twoStar += 1;
            break;
          case 3:
            counts.threeStar += 1;
            break;
          case 4:
            counts.fourStar += 1;
            break;
          case 5:
            counts.fiveStar += 1;
            break;
          default:
            break;
        }
      });
      setratingss(counts);
    }
  };

  useEffect(() => {
    fetchArtistReview();
  }, []);

  useEffect(() => {
    console.log(artistReview);
    fetchRatings();
  }, [artistReview]);

  const { isSignedIn, user, isLoaded } = useUser()

  return (

    <div className="bg-gray-500">
      <SignedIn>
        <UserButton />
        <SignOutButton>
          <Button>Sign Out</Button>
        </SignOutButton>
      </SignedIn>
      <img
        src="https://i1.sndcdn.com/avatars-Hw5zE8czK2Yyny7d-XIUjlA-t1080x1080.jpg"
        alt="artist"
        className="w-60 h-60"
      />
      <AudioCapture />
      <OverallRatingChart />
      <ReviewForm />
      <OverallRatingChart oneStar={ratings.oneStar} twoStar={ratings.twoStar} threeStar={ratings.threeStar} fourStar={ratings.fourStar} fiveStar={ratings.fiveStar} generateStars={generateStars} />
      {artistReview.map((review) => {
        return <ReviewCard {...review} generateStars={generateStars} />
      })}
    </div>
  );
}
