import { model, models } from 'mongoose';
import ModelParamSchema, { IModelParamDocument } from './ModelParam.schema';


export default models['model'] || model<IModelParamDocument>('model', ModelParamSchema);
