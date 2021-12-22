import GMM from 'gaussian-mixture-model'
import ModelParamModel from '../model/ModelParamModel'
import { spawn } from 'child_process'

/**
 * A controller for infering clusters
 * @class GMMController
 */
export default class GMMController {
    static _gmm = null;

    /**
     * Infers the cluster of the provided song
     * @param {Song} song the same song object
     * @returns {Promise<number>} the number of the cluster of this song
     */
    static async infer(song) {
        const point = [
            song.danceability,
            song.energy,
            song.speechiness,
            song.acousticness,
            song.instrumentalness,
            song.liveness,
            song.valence,
            song.tempo
        ]

        const model = await GMMController._getModel();

        let cluster = 0;
        let max_prob = 0;

        model.predictNormalize(point).forEach((prob, i) => {
            if (prob > max_prob) {
                max_prob = prob;
                cluster = i;
            }
        })

        return cluster;
    }

    /**
     * Returns GMM model object. If it is not yet loaded, it will be loaded.
     */
    static async _getModel() {
        if (!GMMController._gmm) {
            const [covariances, means, weights] = await Promise.all([
                ModelParamModel.findOne({ 'param': 'covariances' }).exec(),
                ModelParamModel.findOne({ 'param': 'means' }).exec(),
                ModelParamModel.findOne({ 'param': 'weights' }).exec()
            ])

            GMMController._gmm = new GMM({
                means: means.data,
                covariances: covariances.data,
                weights: weights.data
            });
        }

        return GMMController._gmm;
    }

    /**
     * Spawns python script to remodel all the songs in the database.
     * @returns {Promise<void>}
     */
    static async remodel() {
        // eslint-disable-next-line no-undef
        spawn('python', ['../python/gmm_remodel.py', process.env.MONGODB_URI]);
        return null;
    }
}