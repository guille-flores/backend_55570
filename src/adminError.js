import EError from "./typesError";

export default class AdminError {
    static createError({
        name = 'Error',
        cause,
        message,
        code = 1
    }){
        const error = new Error(message, {cause});
        error.name = name;
        error.code = code        
    }
}