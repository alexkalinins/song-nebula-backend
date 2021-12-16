import express from 'express';
import {Song} from '../model/Song.schema';
import SpotifyController from '../controller/SpotifyController';
import SearchModel from '../model/SearchModel';

const router = express.Router();

router.get('/:id', async (req, res) => {
    console.log('getting song');
    const song: Song = await SpotifyController.getSong(req.params.id);

    if(song){
        res.send(song);
    } else {
        res.status(404).json({error:'Song not found'});
    }
    
})

router.get('/search/:query', async (req, res) => {
    console.log('searching spotify: '+req.params.query);
    const search: SearchModel[] = await SpotifyController.searchSpotify(req.params.query);

    if(search){
        res.send(search);
    } else {
        res.status(404).json({error:'Song not found'});
    }
})


export default router;