export const generateUserErrorInfo = (user) => {
    return `One or more properties were invalid.
    List of required properties:
    * email: needs to be a string, received ${user.email}.
    * password: needs to be a string with more than 3 characters and at least one number.
    * age: needs to be a number between 1 and 120, received ${user.age}.
    `
}  