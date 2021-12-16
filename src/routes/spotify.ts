import express from 'express';
import {Song} from '../model/Song.schema';
import SpotifyController from '../controller/SpotifyController';

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


export default router;