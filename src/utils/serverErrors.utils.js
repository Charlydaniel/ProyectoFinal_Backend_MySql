export class serverError extends Error{

    constructor(status, message){
        super(message)
        this.status=status
    }
}