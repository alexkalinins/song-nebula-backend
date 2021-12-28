import { model, models } from 'mongoose';
import NebulaCacheSchema, { INebulaCacheDocument } from './NebulaCacheModel.schema';

export default models['nebula_cache'] || model<INebulaCacheDocument>('nebula_cache', NebulaCacheSchema);