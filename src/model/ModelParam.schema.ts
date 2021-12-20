import { Schema, Model, Document } from 'mongoose';

export interface ModelParam{
    param: string;
    data: unknown;
}

const ModelParamSchema = new Schema({
    param: {type: String, required: true},
    data: {type: Schema.Types.Mixed, required: true}
})

export interface IModelParamDocument extends ModelParam, Document { }
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IModelParamModel extends Model<IModelParamDocument> { }

export default ModelParamSchema;
