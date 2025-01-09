class ApiError {
    constructor(status, message, error) {
        this.status = status;
        this.message = message;
        this.error = error;
    }

    static error(message = 'An error occurred', error = null) {
        return new ApiError('error', message, error);
    }
}

module.exports = ApiError;
