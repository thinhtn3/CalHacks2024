import axios from 'axios';

const BASE_URL = "http://localhost:8000"; // Update with your backend URL

// Dummy data for artists
const dummyArtists = [
    { id: 1, name: 'Artist 1' },
    { id: 2, name: 'Artist 2' },
    { id: 3, name: 'Artist 3' },
    { id: 4, name: 'Artist 4' },
    { id: 5, name: 'Artist 5' },
];

export const getArtists = async (userID) => {
    try {
        const response = await axios.get(`${BASE_URL}/artists`, { params: { userID } });
        return response.data;
    } catch (error) {
        console.error("Error fetching artists:", error);
        return dummyArtists;
        // throw error;
    }
};

export const submitArtists = async (userID, selectedArtists) => {
    try {
        const response = await axios.post(`${BASE_URL}/artists/submit`, { userID, artists: selectedArtists });
        return response.data;
    } catch (error) {
        console.log(userID, selectedArtists);
        // console.error("Error submitting artists:", error);
        // throw error;
    }
};
