import mongoose from "mongoose"

const channelMessageScehmma= new mongoose.Schema(
    {
        id:{
            type:Number,
            required:true,
        },
        channel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'channels',
            required:true
        },
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        content:{
            type:String,
            required:true
        },
        created_at:{
            type:Date,
            default:Date.now
        }
    }
)   

const channel_message =mongoose.model('channel_message',channelMessageScehmma)
export default channel_message