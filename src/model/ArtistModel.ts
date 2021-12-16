import ArtistSchema, {IArtistDocument} from "./Artist.schema";
import {model, models} from 'mongoose';

export default models['artist'] || model<IArtistDocument>("artist", ArtistSchema);
