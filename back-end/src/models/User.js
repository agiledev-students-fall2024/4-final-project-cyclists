/**
 * @module User
 * @description Defines the User model and validation functions.
 */

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    // A method to validate user properties
    static validate(user) {
        const errors = [];
        if (!user.email || !user.email.includes('@')) {
            errors.push('Invalid email format.');
        }
        if (!user.password || user.password.length < 6) {
            errors.push('Password must be at least 6 characters long.');
        }
        return errors;
    }
}

module.exports = User;