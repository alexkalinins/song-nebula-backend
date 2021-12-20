
import axios from 'axios';
import { Song } from '../model/Song.schema';
import getToken from '../auth/s2s_spotify';
import ArtistModel from '../model/ArtistModel';
import { Artist } from '../model/Artist.schema';
import { APIArtist, TrackData, TrackFeatures } from '../model/APIModel';
import { mongooseConnect } from '../util/MongooseConnector';
import SongModel from '../model/SongModel';
import SearchModel from '../model/SearchModel';
import GMMController from './GMMController';
import NebulaPoint from '../model/NebulaPoint';

const SEARCH_LIMIT = 5;

export default class SpotifyController {

    static async searchSpotify(query: string): Promise<SearchModel[]> {
        console.log('Searching for : ' + query);

        query = query.trim().replace(' ', '%20');

        const queryString = `q=${query}&type=track&limit=${SEARCH_LIMIT}`;

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
                url: `https://api.spotify.com/v1/search?${queryString}`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error(err);
            return null;
        }
        const tracks: TrackData[] = res.data.tracks.items;
        // todo possibly add to database if we already have the data

        const result: SearchModel[] = tracks.map(track => {
            const song: SearchModel = {
                id: track.id,
                title: track.name,
                artist_names: track.artists.map(artist => artist.name),
                image_url: track.album.images[0].url,
            }
            return song;
        });

        // console.log(res.data);
        // console.log('\n TRACKS:')
        // console.log(res.data.tracks.items);

        return result;
    }

    /**
     * Gets the analysis of a song. Returns from database if it exists. Otherwise, fetches info from spotify.
     * @param id spotify id of this song
     * @returns a promise of the song interface containing metadata
     */
    static async getSong(id: string): Promise<Song> {
        mongooseConnect();

        const songSearch = await SongModel.findOne({ spotify_id: id }).exec();
        if (songSearch) {
            console.log('Song in database');
            return songSearch;
        }

        console.log('Song not found in database');

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

        try {
            res = await axios({
                method: 'get',
                url: `https://api.spotify.com/v1/audio-features/${id}`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            })
        } catch (err) {
            console.error(err);
            return null;
        }

        const trackFeatures: TrackFeatures = res.data;

        return await this.makeSong(trackFeatures, trackData);
    }

    /**
     * Takes features and data and makes the song model. Stores the model in the database. Checks if artists
     * exist in the database and makes new artists if they do not exist.
     * 
     * @param features the audio features of track
     * @param data metadata of track
     * @returns promise that resolves to the song model made from features and data
     */
    private static async makeSong(features: TrackFeatures, data: TrackData): Promise<Song> {
        mongooseConnect();
        data.artists.forEach(async (artist: APIArtist) => {
            const dbArtist = await ArtistModel.findOne({ spotify_id: artist.id }).exec();

            if (!dbArtist) {
                console.log(`Artist "${artist.name}" not found in database. Adding to database.`);

                //make new artist
                const newArtist: Artist = {
                    spotify_id: artist.id,
                    name: artist.name,
                    genres: artist.genres,
                    url: artist.external_urls.spotify,
                    image_url: data.album.images[1].url
                };
                try {
                    // sometimes duplicate key
                    await ArtistModel.create(newArtist);
                } catch (err) {
                    console.error(err);
                }
            }
        });

        const newSong: Song = {
            spotify_id: data.id,
            title: data.name,
            artists: data.artists.map(artist => artist.id),
            artist_names: data.artists.map(artist => artist.name),
            duration_ms: data.duration_ms,

            date_added: Date.now(),

            image_url: data.album.images[0].url,
            preview_url: data.preview_url,
            song_url: data.external_urls.spotify,

            album: data.album.name,

            danceability: features.danceability,
            energy: features.energy,
            key: features.key,
            loudness: features.loudness,
            mode: features.mode,
            speechiness: features.speechiness,
            acousticness: features.acousticness,
            instrumentalness: features.instrumentalness,
            liveness: features.liveness,
            valence: features.valence,
            tempo: features.tempo,
            popularity: data.popularity,
        }

        try {
            await SongModel.create(newSong);
        } catch (err) {
            // possible duplicate key
            console.error(err);
        }

        newSong.cluster = await GMMController.infer(newSong);
        return newSong;
    }

    /**
     * Adds all the songs from the array of spotify ids to the database.
     * @param ids array of spotify ids
     * @returns promise resolving to the number of added songs
     */
    static async batchAdd(ids: string[]): Promise<number> {
        let count = 0;

        mongooseConnect();
        let token = ''
        try {
            token = await getToken()
        } catch (err) {
            console.error(err);
            return null;
        }

        const CHUNK = 50;
        let rem = ids.length;
        for (let i = 0, j = ids.length; i < j;) {
            const size = Math.min(CHUNK, rem);
            rem -= size;
            const req_ids = ids.slice(i, i + size).toString();
            i += size;

            let res;
            try {
                res = await axios({
                    method: 'get',
                    url: `https://api.spotify.com/v1/tracks?ids=${req_ids}`,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                })
            } catch (err) { console.error(err); return null; }

            const trackData: TrackData[] = res.data.tracks;

            try {
                res = await axios({
                    method: 'get',
                    url: `https://api.spotify.com/v1/audio-features?ids=${req_ids}`,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                })
            } catch (err) {
                console.error(err);
                return null;
            }

            const trackFeatures: TrackFeatures[] = res.data.audio_features;

            for (let i = 0; i < trackData.length; i++) {
                if (!trackData[i] || !trackFeatures[i]) {
                    console.log('Null data; skipping')
                    continue;
                }
                const songSearch = await SongModel.findOne({ spotify_id: trackData[i].id }).exec();
                if (songSearch) {
                    console.log('BATCH: Song in database:');
                    continue;
                }
                console.log(`BATCH: Song not found ("${trackData[i].name}") in database`);
                this.makeSong(trackFeatures[i], trackData[i]); // dont care about awaiting for this to finish
                count++;
            }
        }
        console.log('Done page; added = ' + count);
        return count;
    }

    /**
     * Adds all the songs from the playlist with the provided id to the database
     * @param spotify_id the spotify id of the song
     * @return the number of songs that were added
     */
    static async batchAddPlaylist(spotify_id: string): Promise<number> {
        let token = ''
        try {
            token = await getToken()
        } catch (err) {
            console.error(err);
            return null;
        }

        let res;
        let total = 1;
        let count = 0;
        let page = 0;
        let added = 0;
        const LIMIT = 50;

        console.log(`BATCH: Getting playlist tracks`);
        while (count < total) {
            console.log(`\t getting page ${page}`);
            try {
                res = await axios({
                    method: 'get',
                    url: `https://api.spotify.com/v1/playlists/${spotify_id}/tracks?limit=${LIMIT}&offset=${page * LIMIT}`,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
                });
            } catch (err) {
                console.error(err);
                return null;
            }

            const ids = res.data.items.filter((item: { track: { id: any; }; }) => item != null && item.track != null).map((item: { track: { id: any; }; }) => item.track.id)
            count += ids.length;
            total = res.data.total;
            console.log(`total songs in playlist: ${total}`);
            added += await this.batchAdd(ids);

            page++; //next page
        }

        console.log(`Done BATCH PLAYLIST; total added = ${added}`);

        return added;
    }

    static async getNebula(axis1: string, axis2: string, axis3: string): Promise<NebulaPoint[]> {
        const points = await SongModel.find({}, {
            'spotify_id': 1,
            'title': 1,
            'artist_names': 1,
            'image_url': 1,
            'song_url': 1,
            'cluster': 1,
            [axis1]: 1,
            [axis2]: 1,
            [axis3]: 1
        }).exec();

        return points;
    }




}