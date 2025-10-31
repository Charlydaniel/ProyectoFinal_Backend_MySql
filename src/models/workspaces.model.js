import mongoose from "mongoose";

const workspaceSchema=new mongoose.Schema(
{
    name: {type:String,
         required:true,
         unique:true
        },
    url_image: {
        type:String,
        required:true
    },
    modifi_at:{ type:Date,
                default: Date.now
    },
    created_at:{ type:Date,
                default: Date.now
    },
    active:{type:Boolean,
        default:true
    }
}

)

const Workspaces= mongoose.model('Workspaces',workspaceSchema)

export default Workspaces