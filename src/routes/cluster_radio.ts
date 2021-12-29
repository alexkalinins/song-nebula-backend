import express from 'express'
import SpotifyController from '../controller/SpotifyController';
import GMMController from '../controller/GMMController';

const router = express.Router();


router.get('/radio/:num', async (req, res) => {
    if(!req.params.num){
        console.error('Cluster radio: bad num query')

        res.status(400);
        res.send({error: 'num parameter is required'});
        return;
    }

    const songs = await SpotifyController.getSongsFromCluster(+req.params.num);
    res.send({songs: songs});
})

router.get('/num_clusters', async (req, res)=>{
    const num = await GMMController.getNumClusters();
    res.send({num: num});
})

export default router;