import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import './LandingPage.css'

function LandingPage() {

  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <h1>Yelp, but for music festivals.</h1>
    </>
  )
}

export default LandingPage
