// Create a funcition that finds a name in a list of names of ENSIA students and returns a boolean 
// true if the name is in the list - false otherwise

const contacts = require('./contacts.json')


function isStudent(email) {
    return contacts[email] !== undefined;
}

module.exports = {isStudent};
