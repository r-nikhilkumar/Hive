class ApiResponse {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    static success(data, message = 'Request successful') {
        return new ApiResponse('success', message, data);
    }
}

module.exports = ApiResponse;
