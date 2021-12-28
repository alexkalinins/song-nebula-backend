import { NebulaCache } from '../model/NebulaCacheModel.schema';
import { mongooseConnect } from '../util/MongooseConnector';
import CacheModel from '../model/NebulaCacheModel';
import NebulaPoint from '../model/NebulaPoint';

/**
 * Controller for caching Nebula queries. Nebula queries query the entire database, which is slow and expensive.
 * Caching would allow to save the state of the nebula for future use. If the client added new songs after the cache 
 * has been made, they can add those songs to the nebula themselves. A cache is remade after it expires.
 */
export default class NebulaCacheController {

    /**
     * Queries the cache for the selected axis set. Does not consider axis order. Returns with the axis in sorted order.
     * @param axis1 the first axis
     * @param axis2 the second axis
     * @param axis3 the third axis
     * @return a promise that resolves either to the nebula cache object or to null if cache does not exist.
     */
    static async getFromCache(axis1: string, axis2: string, axis3: string): Promise<NebulaCache> {
        await mongooseConnect()
        const axes = [axis1, axis2, axis3].sort().toString();

        const cache = await CacheModel.findOne({ axes: axes }).exec();
        return cache;
    }

    /**
     * Adds the provided date to the cache. Assumes data is not in cache
     * @param axis1 the first axis
     * @param axis2 the second axis
     * @param axis3 the third axis
     * @param nebula the nebula data being cached 
     * @returns void
     */
    static async makeCache(axis1: string, axis2: string, axis3: string, nebula: NebulaPoint[]): Promise<void>{
        const axes = [axis1, axis2, axis3].sort().toString();

        const newCache: NebulaCache = {
            axes: axes,
            nebula: nebula,
        }

        await mongooseConnect();
        await CacheModel.create(newCache);

        return null;
    }



}