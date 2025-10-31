import mongoose from "mongoose";

const channeslSchema = new mongoose.Schema(

    {
        name:{type:String,
            required:true
        },
        private:{
            type:Boolean,
            default:false
        },
        active:{
            type:Boolean,
            default:true
        },
        created_at:{
            type:Date,
            default: Date.now
        },
        modify_at:{
            type:Date,
            default: Date.now
        },
        //Establecer relacion con Workspaces
        workspace:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Workspaces",
            required:true
        }

    }
)

const Channels=mongoose.model('Channel',channeslSchema)

export default channeslSchema