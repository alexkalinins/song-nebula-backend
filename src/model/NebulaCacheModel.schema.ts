import NebulaPoint from './NebulaPoint';
import { Schema, Model } from 'mongoose';

// how long for cache to expire
const CACHE_EXPIRES = process.env.CACHE_EXPIRES ? process.env.CACHE_EXPIRES : 3600;

export interface NebulaCache {
    // the axes sorted and converted to string (basically the key)
    axes: string;

    // the x, y, z axis order is in the sorted order
    nebula: NebulaPoint[];
    createdAt?: number;
}

const NebulaCacheSchema = new Schema({
    axes: { type: String, required: true, index: { unique: true } },
    createdAt: { type: Date, expires: CACHE_EXPIRES, default: Date.now },
    axis_order: { type: [String], required: true },
    nebula: {
        type: [{
            spotify_id: String,
            title: String,
            artist_names: [String],

            preview_url: String,
            song_url: String,
            image_url: String,

            x: Number,
            y: Number,
            z: Number,
            cluster: Number,
        }], required: true
    },
    // expires: { type: Number, required: true }
})

export interface INebulaCacheDocument extends NebulaCache, Document { }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INebulaCacheModel extends Model<INebulaCacheDocument> { }

export default NebulaCacheSchema;