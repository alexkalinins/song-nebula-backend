import { Song } from '../model/Song.schema';


export default class GMMController {
    static infer(song: Song): Promise<number>;
    static remodel(): Promise<void>;
}
