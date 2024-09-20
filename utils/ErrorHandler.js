class ErrorHandler extends Error {
    constructor(message, statusCode){
        //super is used to call the the constructor of the parent class, error in this case. It passes the message argument to the error class constructor, which sets the error message for the instance.
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    serialize() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            stack: process.env.NODE_ENV !== 'production' ? this.stack : undefined
        };
    }
}



export default ErrorHandler;