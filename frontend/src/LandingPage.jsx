import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import "./LandingPage.css";
import ArtistSelection from "./components/ArtistSelection";
import { Button } from "@/components/ui/button";
import ArtistSearchForm from "./components/ArtistSearchForm";

function LandingPage() {
  const { isSignedIn, user, isLoaded } = useUser();
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
