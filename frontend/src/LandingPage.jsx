import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import './LandingPage.css'
import ArtistSelection from './components/ArtistSelection';

function LandingPage() {

  return (
    <>
      <header>
        <SignedOut>
          <SignInButton className="bg-blue-500 text-white p-2 rounded-md"/>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <ArtistSelection />
        </SignedIn>
      </header>
      <h1 className="text-4xl font-bold">Yelp, but for music festivals.</h1>
    </>
  )
}

export default LandingPage
