import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getArtists, submitArtists } from '../api/api'; // Import the API functions

function ArtistSelection() {
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [artists, setArtists] = useState([]);
    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        const fetchArtists = async () => {
            if (isSignedIn && user) {
                try {
                    const fetchedArtists = await getArtists(user.id); // Call getArtists with user.id
                    setArtists(fetchedArtists);
                } catch (error) {
                    console.error("Failed to fetch artists:", error);
                }
            }
        };

        fetchArtists();
    }, [isSignedIn, user]);

    const handleSelectArtist = (id) => {
        setSelectedArtists((prev) => 
            prev.includes(id) ? prev.filter(artistId => artistId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await submitArtists(user.id, selectedArtists); // Call submitArtists with user.id
            console.log('Submission Result:', result);
        } catch (error) {
            console.error("Failed to submit artists:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-lg font-bold mb-4">Select Artists</h2>
            <div className="space-y-2">
                {artists.map(artist => (
                    <div key={artist.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`artist-${artist.id}`}
                            value={artist.id}
                            onChange={() => handleSelectArtist(artist.id)}
                            className="mr-2"
                        />
                        <label htmlFor={`artist-${artist.id}`} className="text-gray-700">{artist.name}</label>
                    </div>
                ))}
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Submit
            </button>
        </form>
    );
}

export default ArtistSelection;
