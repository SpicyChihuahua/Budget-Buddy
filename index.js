if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const expressHandlebars = require('express-handlebars');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const initPassport = require('./passport-config');
initPassport(
	passport,
	username => users.find(user => user.username === username),
	id => users.find(user => user.id === id)
);
const flash = require('express-flash');
const session = require('express-session');

const app = express();

//	Local users and passwords
//	Connect to Database later :)
const users = [];

app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({
	extended: true
}))
app.use(flash());
app.use(session({
	//secret: process.env.SESSION_SECRET,
	secret: 'secretlol',
	resvae: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', expressHandlebars.engine({
	defaultLayout: 'main',
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');

const port = process.env.PORT || 3000

app.get('/', function(request, response) {
	// response.render('home', { username: request.user.username });
	response.render('home');
});

app.get('/login',  function(request, response) {
	response.render('login');
});

app.get('/about',  function(request, response) {
	response.render('about');
});

app.get('/test', function(request, response) {
	response.type('text/plain');
	response.send('Node.js and Express running on port='+port);
});

app.get('/budget', checkAuthenticated, function(request, response) {
	// response.render('budget');
	response.render('budget');
});

app.post('/processlogin', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

// {
// 	id: 9001,
// 	username: "kyle",
// 	password: bcrypt.hash("kyle123", 10)
// }
app.get('/regtemp', async function(request, response) {
	
	regtemp();
	response.redirect('/');

});

app.get('/getuserdata', function(request, response) {

	//
	//	If the user is not authenticated,
	//	then there is no user data to get.
	//
	if (!request.isAuthenticated()) {
		response.json(null);
		return;
	}

	//
	//	Send back the current user's
	//	id and username to update the
	//	page with.
	//
	const id = request.user.id;
	const username = request.user.username;
	var responseObj = {
		id: id,
		username: username
	}
	var responselog = `[id:${responseObj.id}; username:${responseObj.username}]`;
	console.log("Sending the following back: " + responselog);

	response.json(responseObj);
	
});

app.post('/processregister', async function(request, response) {

	//	Form inputs
	const username = request.body.username;
	const password = "";
	const id = Date.now().toString();

	try {
		password = await bcrypt.hash(request.body.password, 10);
		users.push({
			id: id,
			username: username,
			password: password
		})
		response.redirect('/login');
	}
	catch {
		console.log("Failed to register \"${username}\".");
		response.redirect('/register');
	}

	var responselog = `Registered \"${username}\" with id \"${id}\" to accounts.`;
	console.log(responselog);

});

function checkAuthenticated(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	else response.redirect("/login");
}

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/");
	console.log("Registering a temp user...");
	regtemp();
});

async function regtemp() {

	id = Date.now().toString();
	username = "kyle";
	password = await bcrypt.hash("kyle123", 10);

	users.push({
		id: id,
		username: username,
		password: password
	})


	var responselog = `Registered \"${username}\" with id \"${id}\" to accounts.`;
	console.log(responselog);

}
