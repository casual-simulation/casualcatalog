function getErrorMessage(error) {
    if (error) {
        if (typeof error === 'string') {
            return error;
        } else if (error.message) {
            return error.message;
        } else if (error.error) {
            return getErrorMessage(error.error);
        }
    }
}

return getErrorMessage(that);