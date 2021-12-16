
import axios from 'axios';
import { Song } from '../model/Song.schema';
import getToken from '../auth/s2s_spotify';
import ArtistModel from '../model/ArtistModel';
import { Artist } from '../model/Artist.schema';
import { APIArtist, TrackData, TrackFeatures } from '../model/APIModel';
import { mongooseConnect } from '../util/MongooseConnector';
import SongModel from '../model/SongModel';

export default class SpotifyController {


    /**
     * Gets the analysis of a song. Returns from database if it exists. Otherwise, fetches info from spotify.
     * @param id spotify id of this song
     * @returns a promise of the song interface containing metadata
     */
    static async getSong(id: string): Promise<Song> {
        mongooseConnect();

        const songSearch = await SongModel.findOne({ spotify_id: id });
        if (songSearch) {
            return songSearch;
        }

        let token = ''
        try {
            token = await getToken()
        } catch (err) {
            console.error(err);
            return null;
        }

        let res;
        try {
            res = await axios({
                method: 'get',
                url: `https://api.spotify.com/v1/tracks/${id}`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            })
        } catch (err) { console.error(err); return null; }

        const trackData: TrackData = res.data;


        trackData.artists.forEach(async (artist: APIArtist) => {
            const dbArtist = await ArtistModel.findOne({spotify_id: artist.id}).exec();

            if(!dbArtist){
                console.log(`Artist "${artist.name}" not found in database. Adding to database.`);

                //make new artist
                const newArtist: Artist = {
                    spotify_id: artist.id,
                    name: artist.name,
                    genres: artist.genres,
                    url: artist.external_urls.spotify,
                    image_url: trackData.album.images[1].url
                };

                ArtistModel.create(newArtist);
            }
        });

        try{
            res = await axios({
                method: 'get',
                url: `https://api.spotify.com/v1/audio-features/${id}`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            })
        }catch (err) {
            console.error(err);
            return null;
        }

        const trackFeatures: TrackFeatures = res.data;
        


        const newSong: Song = {
            spotify_id: trackData.id,
            title: trackData.name,
            artists: trackData.artists.map(artist => artist.id),
            duration_ms: trackData.duration_ms,

            date_added: Date.now(),

            image_url: trackData.album.images[0].url,
            preview_url: trackData.preview_url,
            song_url: trackData.external_urls.spotify,

            album: trackData.album.name,

            danceability: trackFeatures.danceability,
            energy: trackFeatures.energy,
            key: trackFeatures.key,
            loudness: trackFeatures.loudness,
            mode: trackFeatures.mode,
            speechiness: trackFeatures.speechiness,
            acousticness: trackFeatures.acousticness,
            instrumentalness: trackFeatures.instrumentalness,
            liveness: trackFeatures.liveness,
            valence: trackFeatures.valence,
            tempo: trackFeatures.tempo,
            popularity: trackData.popularity,
        }

        SongModel.create(newSong);

        return newSong;
    }

}