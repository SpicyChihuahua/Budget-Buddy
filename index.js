if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

///
///	Node Modules
///

//	Express
const express = require('express');
const expressHandlebars = require('express-handlebars');

//	Passport
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

//	FTP
const multer = require('multer');
const fileUpload = require('express-fileupload');
const fs = require('fs');

///
/// Express Middleware Configuration
///

//	Express App
const app = express();
const port = process.env.PORT || 3000
const users = [];
app.engine('handlebars', expressHandlebars.engine({
	defaultLayout: 'main',
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');
app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/");
	console.log("Registering a temp user...");
	regtemp(); // Register a user upon start up

});

//	Express Node MiddleWare
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({
	extended: true
}));
app.use(fileUpload());
// app.use(
// 	// 10 mb limit
//     fileUpload({limits: {fileSize: 10000000, }, abortOnLimit: true,})
// );

//	Express/Passport MiddleWare
app.use(flash());
app.use(session({
	//secret: process.env.SESSION_SECRET,
	secret: 'secretlol',
	resvae: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

///
/// Database
///
let MongoClient = require('mongodb').MongoClient;

const constants = require('./ConnectionConstant.js');

const { ObjectID } = require('bson');

///
/// Database Functions
///

///
///	Routing
///

app.get('/', function(request, response) {
	// response.render('home', { username: request.user.username });
	response.render('home');
});

app.get('/login',  function(request, response) {
	response.render('login');
});

app.get('/register', function(request, response) {
	response.render('register');
});

app.get('/about',  function(request, response) {
	response.render('about');
});

app.get('/test', function(request, response) {
	response.type('text/plain');
	response.send('Node.js and Express running on port='+port);
});

app.get('/contact',  function(request, response) {
	response.render('contact');
});

app.get('/budget', checkAuthenticated, function(request, response) {
	response.render('budget');
});

app.get('/profile', checkAuthenticated, function(request, response) {
	response.render('profilepage');
});

//
//	Uploaded Image will be named: <idnumber>.<fileExtension>
//	Example: 
//		User with profile id "2991" uploads a png file.
//		It will be saved under the profileimages folder as "2991.png"
//
app.post('/uploadimg', function(request, response) {
	const { image } = request.files;

	//	Check image
	if (!image) return res.sendStatus(400);

	//	Check if profile image already exists...
	//	Delete if so :)
	var fileNameBase = __dirname + '/profileimages/' + request.user.id;
	if (fs.existsSync(fileNameBase + ".png")) {
		fs.unlinkSync(fileNameBase + ".png");
	}
	else if (fs.existsSync(fileNameBase + ".jpg")) {
		fs.unlinkSync(fileNameBase + ".jpg");
	}
	else if (fs.existsSync(fileNameBase + ".jpeg")) {
		fs.unlinkSync(fileNameBase + ".jpeg");
	}

    // <idnumber>.<fileExtension>
	var imageFileName = request.user.id + "." + image.name.split('.')[1];
	image.mv(__dirname + '/profileimages/' + imageFileName);

	//	Back to Profile Page
    response.redirect('back');
});

app.post('/processlogin', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/logout', function(request, response, next){
	request.logout(function(err) {
	  if (err) { return next(err); }
	  response.redirect('/');
	});
  });

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

app.post('/processProfileBios', function(request, response) {

	const biostext = request.body.profileBiosField;

	//	Rewrite profile bios file
	var fileNameBase = __dirname + '/profilebios/' + id;
	var ext = ".dat";
	var datStream = fs.createWriteStream(fileNameBase+ext);
	datStream.write(biostext);
	datStream.close();

	//	Back to Profile Page
    response.redirect('back');
});

app.get('/getprofilepicture', function(request, response) {

	//
	//	If the user is not authenticated,
	//	then there is no user data to get.
	//
	if (!request.isAuthenticated()) {
		response.sendFile(null);
		return;
	}

	//
	//	Send back the current user's
	//	profile picture
	//
	const id = request.user.id;
	const username = request.user.username;
	var responseImage;
	var fileNameBase = __dirname + '/profileimages/' + id;
	var ext = "";

	if (fs.existsSync(fileNameBase + ".png")) ext = ".png";
	else if (fs.existsSync(fileNameBase + ".jpg")) ext = ".jpg";
	else if (fs.existsSync(fileNameBase + ".jpeg")) ext = ".jpeg";

	if (ext === "") {
		//	Return Default Picture
		fileNameBase = __dirname + '/profileimages/default';
		ext = ".png";
	}

	response.sendFile(fileNameBase + ext);

	var responselog = `[image:${id};]`;
	console.log("Sending the following back: " + responselog);
	
});

app.post('/processhelp', function(request, response) {

	//	Contact Us Elements
	const name = "";
	const problemText = "";

	var responselog = `Contact Us Form Submitted!`;
	console.log(responselog);

});

app.get('/getprofilebios', async function(request, response) {

	var responseJSON = {
		biostxt: ""
	};

	//
	//	If the user is not authenticated,
	//	then there is no user data to get.
	//
	if (!request.isAuthenticated()) {
		response.json(responseJSON);
		return;
	}

	//
	//	Send back the current user's
	//	profile bios in json
	//

	const id = request.user.id;
	const username = request.user.username;
	var fileNameBase = __dirname + '/profilebios/' + id;
	var ext = ".dat";
	var datastr = "";

	if (!fs.existsSync(fileNameBase + ext)) {
		console.log("DOESNT EXIT!")
		var datStream = fs.writeFileSync(fileNameBase+ext, "Feel free to update your bios. :)");
	}

	datastr = fs.readFileSync(fileNameBase+ext, 'utf8');

	responseJSON.biostxt = datastr;

	var responselog = `{responseJSON: ${JSON.stringify(responseJSON)}}`;
	console.log("Sending the following back: " + responselog);

	response.json(responseJSON);

});

app.post('/processregister', async function(request, response) {

	//	Form inputs
	const username = request.body.username;
	var password = "";
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
	catch (err) {
		console.log(err);
		console.log("Failed to register \"${username}\".");
		response.redirect('/register');
	}

	var responselog = `Registered \"${username}\" with id \"${id}\" to accounts.`;
	console.log(responselog);

});

///
///	Functions
///

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

function checkAuthenticated(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	else response.redirect("/login");
}

module.exports = { app }