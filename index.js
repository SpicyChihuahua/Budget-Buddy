if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const expressHandlebars = require('express-handlebars');
const bcrypt = require('bcrypt');
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
	secret: process.env.SESSION_SECRET,
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
	response.render('budget', { username: request.user.username });
});

app.post('/processlogin', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}))

app.post('/processlogin-old', function(request, response) {

	// //Preset Passwords
	const username = "user1";
	const password = "1234";

	//	Form inputs
	const inputusername = request.body.username;
	const inputpassword = request.body.password;

	// Right now, I made the response to display what you entered
	// on the login page.
	let responseMsg = "So... this is what we got on the backend...\n";
	responseMsg += "Username: " + inputusername + "\n";
	responseMsg += "Password: " + inputpassword + "\n";

	response.type('text/plain');
	//response.send(responseMsg);
	if (inputusername == username && inputpassword == password) {
		response.send("Valid UserName and Password")
		console.log("Valid")
		
	} else {
		response.send("Invalid Username and Password")
		console.log("Invalid")
		
	}

});

// {
// 	id: 9001,
// 	username: "kyle",
// 	password: bcrypt.hash("kyle123", 10)
// }
app.get('/regtemp', async function(request, response) {
	
	id = Date.now().toString();
	username = "kyle";
	password = await bcrypt.hash("kyle123", 10);

	users.push({
		id: id,
		username: username,
		password: password
	})

	console.log("Registered \"${username}\" with id \"${id}\" to accounts.")
	response.redirect('/');

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
	console.log("Registered \"${username}\" with id \"${id}\" to accounts.")
});

function checkAuthenticated(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	else response.redirect("/login");
}

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/");
});
