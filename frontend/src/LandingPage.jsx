import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import './LandingPage.css'

function LandingPage() {

  return (
    <>
      <header>
        <SignedOut>
          <SignInButton className="bg-blue-500 text-white p-2 rounded-md"/>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <h1 className="text-4xl font-bold">Yelp, but for music festivals.</h1>
    </>
  )
}

export default LandingPage
