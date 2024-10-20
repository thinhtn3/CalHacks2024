import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import React, { useEffect } from 'react';


import "./LandingPage.css";
import ArtistSelection from "./components/ArtistSelection";
import { Button } from "@/components/ui/button";
import ArtistSearchForm from "./components/ArtistSearchForm";

function LandingPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  let userData = {};
  if (user){
    userData = {
      email: user.primaryEmailAddress['emailAddress'], // Assuming user.email is available
      artists: [], // Add artists if available
      city: "Los Angeles", // Replace with actual city
      state: "California", // Replace with actual state
      first_name: user.firstName, // Assuming you have firstName in user
      last_name: user.lastName, // Assuming you have lastName in user
      profile_url: user.imageUrl, // Assuming you have profileUrl in user
      user_id: user.id, // Assuming you have user.id
    };
  }




  useEffect(() => {
    // Check if user is signed in and fullName is valid
    if (isSignedIn && user?.fullName) {
      // Make a fetch request
      const fetchData = async () => {
        try {
          console.log(userData)
          const response = await fetch('https://http://127.0.0.1:8000/user/add', {
            method: 'POST', // or 'POST', depending on your API
            headers: {
              'Content-Type': 'application/json',
              // Add any other headers you need
            },
            body: JSON.stringify(userData)
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log(data); // Handle the fetched data as needed
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [isSignedIn, user]); // Dependency array to run effect when these values change



  return (
    <>
      <header className="flex flex-col justify-center items-center w-full h-[50vw]">
        <h1 className="text-4xl font-bold">Yelp, but for music festivals.</h1>
        <SignedOut>
          <SignInButton className="bg-blue-500 text-white p-2 rounded-md" />
        </SignedOut>
        <SignedIn>
          <UserButton />
          {isSignedIn && <div>{user.fullName}</div>}
          <SignOutButton>
            <Button>Sign Out</Button>
            </SignOutButton>
          {/* <ArtistSelection /> */}
          <ArtistSearchForm />
        </SignedIn>
      </header>
    </>
  );
}

export default LandingPage;
