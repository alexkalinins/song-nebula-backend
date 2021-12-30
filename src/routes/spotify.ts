import express from 'express';
import { Song } from '../model/Song.schema';
import SpotifyController from '../controller/SpotifyController';
import SearchModel from '../model/SearchModel';
import NebulaPoint from '../model/NebulaPoint';

const router = express.Router();

router.get('/:id', async (req, res) => {
    console.log('getting song');
    const song: Song = await SpotifyController.getSong(req.params.id);

    if (song) {
        res.send(song);
    } else {
        res.status(404).json({ error: 'Song not found' });
    }

})

router.get('/search/:query', async (req, res) => {
    console.log('searching spotify: ' + req.params.query);
    const search: SearchModel[] = await SpotifyController.searchSpotify(req.params.query);

    if (search) {
        res.send(search);
    } else {
        res.status(404).json({ error: 'Song not found' });
    }
})

// router.get('/playlist/:id', async (req, res) => {
//     console.log('batch add songs');
//     const num = await SpotifyController.batchAddPlaylist(req.params.id);

//     if (num) {
//         res.send({ 'added': num });
//     } else {
//         res.status(404).json({ error: 'Playlist not found' });
//     }
// })

router.get('/nebula/previews', async (req, res) => {
    const axis1 = req.query.axis1;
    const axis2 = req.query.axis2;
    const axis3 = req.query.axis3;

    if (!axis1 || !axis2 || !axis3 || typeof (axis1) !== 'string' || typeof (axis2) !== 'string' || typeof (axis3) !== 'string') {
        res.status(400).json({ error: 'Axis parameters are required' });
        return;
    }
    console.log(`Nebula Request: ${axis1} ${axis2} ${axis3}`);

    const nebula: NebulaPoint[] = await SpotifyController.getNebula(axis1, axis2, axis3);

    if (nebula) {
        res.send(nebula);
        return;
    }

    res.status(500).json({ error: 'Something went wrong' });
})


export default router;