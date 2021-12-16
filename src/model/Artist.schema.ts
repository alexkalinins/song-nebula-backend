import {Model, Document, Schema} from 'mongoose';

export interface Artist{
    spotify_id: string;
    name: string;
    genres: string[];
    
    image_url: string;
    url: string;
}

const ArtistSchema = new Schema({
    spotify_id: {type: String, required: true, unique: true, indexed: true},
    name: {type: String, required: true},
    genres: {type: [String], required: true},

    image_url: {type: String, required: true},
    url: {type: String, required: true},
});

export interface IArtistDocument extends Artist, Document { }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IArtistModel extends Model<IArtistDocument> { }
export default ArtistSchema;

