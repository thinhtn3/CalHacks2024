// Import necessary dependencies
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";

// Define your form schema using Zod
const formSchema = z.object({
  reviewText: z.string().min(1, "reviewText is required"),
  // Add other fields as needed
});

export default function ReviewForm({ user, artist }) {
  // Initialize the form without TypeScript generics
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewText: "",
      // Initialize other fields as needed
    },
  });

  // Destructure necessary methods from the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // Define the submit handler without type annotations
  const onSubmit = async (values) => {
    // Create the data object to send in the POST request
    const reviewData = {
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      id: user.id,
      //   profile_url: user.imageUrl,
      reviewText: values.reviewText,
      artist: artist,
      //   rating: values.rating,
    };

    try {
      // Send POST request to the server
      const response = await axios.post(
        "http://127.0.0.1:8000/review/add",
        reviewData
      );
      console.log("Review submitted successfully:", response.data);
      // You can perform additional actions here, such as resetting the form or showing a success message
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-auto gap-y-5"
    >
      <div>
        <label htmlFor="reviewText">Leave a review:</label>
        <Input
          className="w-[1000px] h-24 rounded-sm"
          id="reviewText"
          {...register("reviewText")}
          placeholder="Enter Review..."
        />
        {errors.reviewText && (
          <p className="error">{errors.reviewText.message}</p>
        )}
      </div>

      {/* Add other form fields here */}

      <Button type="submit">Submit Review</Button>
    </form>
  );
}
