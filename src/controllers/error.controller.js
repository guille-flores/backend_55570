import EError from "../services/errors/typesError.service.js";
const errorHandler = (error, req, res, next)=>{
    console.log(error.cause);
    switch (error.code){
        case EError.INVALID_TYPE:
            res.send({
                status: "error",
                error: error.name
            })
            break;
        default:
            res.send({
                status: "error",
                error: "Unhandled error"
            })
    }
}

export default errorHandler