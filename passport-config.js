const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function init(passport, getUserByUsername, getUserByID) {

    const authUser = async function(username, password, done) {

        var user = await getUserByUsername(username)

        console.log(`user: ${JSON.stringify(user)}`);
        //  if userDetails.password is null, that means that there is
        //  no one with the user provided username.

        if (!user) {
            return done(null, false, { message: `There's no one with that username: ${username}`});
        }

        //  At this point, we know that username exists, so we have to check the password.
        if (bcrypt.compare(password, user.password)) {
            console.log(`User ${user.username} with id ${user.id} has authenticated.`);
            answer = true;
            return done(null, user);
        }
        else {
            return done(null, false, { message: `Incorrect password for user ${username}`});
        }

    }

    passport.use( new LocalStrategy({ usernameField: 'username' }, authUser ));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserByID(id))
    });

}

module.exports = init;