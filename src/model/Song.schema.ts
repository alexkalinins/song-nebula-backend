import {Schema, Model, Document} from 'mongoose';

export interface Song{
    spotify_id: string;
    title: string;
    artists: string[];
    artist_names: string[];
    duration_ms: number;

    date_added: number;

    image_url: string;
    preview_url?: string;
    song_url: string;

    album: string;

    cluster?: number;

    // analysis
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
    popularity: number;
}

const SongSchema = new Schema({
    spotify_id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    artists: {type: [String], required: true},
    artist_names:{type: [String], required: true},
    duration_ms: {type: Number, required: true},

    date_added: {type: Number, required: true},

    image_url: {type: String, required: true},
    preview_url: {type: String, required: false},
    song_url: {type: String, required: true},

    album: {type: String, required: true},
    cluster: {type: Number, required: false},

    // analysis
    danceability: {type: Number, required: true},
    energy: {type: Number, required: true},
    key: {type: Number, required: true},
    loudness: {type: Number, required: true},
    mode: {type: Number, required: true},
    speechiness: {type: Number, required: true},
    acousticness: {type: Number, required: true},
    instrumentalness: {type: Number, required: true},
    liveness: {type: Number, required: true},
    valence: {type: Number, required: true},
    tempo: {type: Number, required: true},
    popularity: {type: Number, required: true},
});

export interface ISongDocument extends Song, Document { }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISongModel extends Model<ISongDocument> { }
export default SongSchema
