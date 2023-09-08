import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete'
import { Task } from 'src/tasks/schemas/task.schema';
import { User } from 'src/users/schemas/user.schema';
export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    FileUrlDocument: string

    @Prop({ type: mongoose.Schema.Types.Array, ref: () => "Task" })
    tasks: string[];

    
    @Prop({ type: mongoose.Schema.Types.Array, ref: () => "User" })
    members: string[];



    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop()
    createAt: string;

    @Prop()
    isDelete: boolean;

    @Prop()
    deleteAt: string;



    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop()
    updateAt: string;


    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

}



export const ProjectSchema = SchemaFactory.createForClass(Project).plugin(mongooseDelete);