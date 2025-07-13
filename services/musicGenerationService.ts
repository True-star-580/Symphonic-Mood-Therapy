import { Symphony, Track } from '../types';

// This function now uses the Deezer API via a CORS proxy to find a real-world track.
const findTrackOnDeezer = async (symphony: Symphony): Promise<Track> => {
    // 1. Use the new, very simple, AI-generated primary mood keyword for a more effective search.
    const searchQuery = symphony.primaryMoodKeyword;

    // 2. Construct the Deezer API URL, ensuring the search query is properly encoded.
    const deezerApiUrl = `https://api.deezer.com/search/track?q=${encodeURIComponent(searchQuery)}&limit=1`;
    
    // 3. Use a CORS proxy to bypass browser restrictions. The entire Deezer URL must be encoded for the proxy.
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(deezerApiUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`Deezer API responded with status: ${response.status}`);
        }
        const results = await response.json();

        // 4. Check if any tracks were found.
        if (results.data && results.data.length > 0) {
            const deezerTrack = results.data[0];
            
            // 5. Map the Deezer track to our internal Track type.
            const foundTrack: Track = {
                id: deezerTrack.id.toString(),
                title: deezerTrack.title,
                artist: deezerTrack.artist.name,
                url: deezerTrack.preview, // This is the 30-second preview URL
                keywords: [], // No longer needed
            };
            return foundTrack;
        } else {
            // If no tracks are found on Deezer, throw an error.
            throw new Error(`No suitable tracks were found on Deezer for: "${searchQuery}"`);
        }
    } catch(error) {
        console.error("Error fetching from Deezer API:", error);
        if (error instanceof Error) {
            throw new Error(`Could not connect to the music service: ${error.message}`);
        }
        throw new Error("Could not connect to the music service. Please try again later.");
    }
};


/**
 * Finds the best matching soundtrack for a given symphony by searching Deezer.
 * @param symphony The detailed description of the symphony.
 * @returns The best matching Track from Deezer.
 */
export const findSoundtrack = async (symphony: Symphony): Promise<Track> => {
    return await findTrackOnDeezer(symphony);
};