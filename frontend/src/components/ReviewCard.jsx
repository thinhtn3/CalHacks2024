import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function ReviewCard({
  id,
  artist,
  review,
  firstName,
  lastName,
  rating,
  generateStars,
}) {
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const [upvote, setUpvote] = useState(getRandomNumber(0, 20));

  const capitalizeName = (fullName) => {
    // Split the full name into parts
    const nameParts = fullName.trim().split(" ");

    // Capitalize the first and last name
    if (nameParts.length === 0) return "";

    const firstName =
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[0].slice(1).toLowerCase();
    // Return the capitalized first and last name
    return `${firstName}`;
  };
  const stars = generateStars(rating);
  return (
    <Card className="flex flex-col items-start w-auto text-left bg-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">
          {capitalizeName(firstName)} {capitalizeName(lastName)}
        </CardTitle>
        <CardDescription className="text-gray-100">
          {capitalizeName(artist)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-100">{review}</p>
        <p className="text-gray-100">{rating}</p>
        <div className="flex gap-0">{stars}</div>
      </CardContent>
      <CardFooter className="gap-2">
        <p className="text-gray-100">{upvote}</p>
        <Button onClick={() => setUpvote(upvote + 1)}>
          {<FiArrowUp />}Upvote
        </Button>
        <Button onClick={() => setUpvote(upvote - 1)}>
          <FiArrowDown /> Downvote
        </Button>
      </CardFooter>
    </Card>
  );
}
