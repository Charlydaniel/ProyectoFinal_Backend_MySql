import mongoose, { Types } from "mongoose";


const userSchema= new mongoose.Schema(
    {
        name: {type: String,
                required:true
                },
        email: {type: String,
                unique:true,
                required:true
                },
        password:{type: String,
                    required:true
                },
        created_at: {type: Date,
                        default: Date.now
                    },
        last_session:{
                type:Date,
                default:Date.now
        },
        active: {type: Boolean,
                default: true
                },
        verified:{
                type:Boolean,
                default:false
        }

    }
)

const Users= mongoose.model('User',userSchema)

export default Users