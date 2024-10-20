// Import necessary dependencies
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// Define your form schema using Zod
const formSchema = z.object({
  artistName: z.string().min(1, "artistName is required"),
  // Add other fields as needed
});

export default function ArtistSearchForm() {
  // Initialize the form without TypeScript generics
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistName: "",
      // Initialize other fields as needed
    },
  });

  // Destructure necessary methods from the form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  //   const fetchArtistReview = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://127.0.0.1:8000/review/fetch/${artistName}`
  //       );
  //       if (response.data) {
  //         setArtistReview(response.data);
  //       } else {
  //         console.log("No reviews found");
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  // Define the submit handler without type annotations
  const onSubmit = async (values) => {
    // Handle form submission
    const response = await axios.get(
      `http://127.0.0.1:8000/review/fetch/${values.artistName}`
    );
    if (response.data[0]) {
      console.log(response.data);
      navigate(`/review/${values.artistName}`);
    } else {
      console.log("Error fetching reviews");
    }
    // You can perform additional actions here, such as sending data to a server
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-auto gap-y-5"
    >
      <div>
        <label htmlFor="artistName">Leave a review:</label>
        <Input
          className="w-[1000px] h-10 rounded-sm"
          id="artistName"
          {...register("artistName")}
          placeholder="Enter Review..."
        />
        {errors.artistName && (
          <p className="error">{errors.artistName.message}</p>
        )}
      </div>

      {/* Add other form fields here */}

      <Button type="submit">Search</Button>
    </form>
  );
}
