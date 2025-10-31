import mongoose from "mongoose"

function validarID(id) {
    return mongoose.isValidObjectId(id)
}
export default validarID