
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({
	extended: true
}))
app.engine('handlebars', expressHandlebars.engine({
	defaultLayout: 'main',
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');

const port = process.env.PORT || 3000

app.get('/',  function(request, response) {
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

app.get('/budget', function(request, response) {
	response.render('budget');
});
app.post('/processlogin', function(request, response) {

	//Preset Passwords
	const username = "user1"
	const password = "1234"

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

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/");
});
