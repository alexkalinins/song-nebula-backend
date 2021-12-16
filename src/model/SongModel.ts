import SongSchema, {ISongDocument} from "./Song.schema";
import {model, models} from 'mongoose';

export default models['song'] || model<ISongDocument>("song", SongSchema);
