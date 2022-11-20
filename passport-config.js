const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function init(passport, getUserByUsername, getUserByID) {

    const authUser = async function(username, password, done) {
        
        const user = getUserByUsername(username);

        //  Return if the entered username cannot be found
        if (user == null) {
            return done(null, false, { message: "No user with username \"${username}\""});
        }

        //  Validate password
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: "Incorrect password for user \"${username}\""});
            }
        }
        catch (e) {
            return done(e);
        }
        
    }

    passport.use( new LocalStrategy({ usernameField: 'username' }, authUser ));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id))
    });
}

module.exports = init;