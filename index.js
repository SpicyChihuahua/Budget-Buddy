
const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express();

//app.use(express.static(__dirname + '/client'))
app.engine('handlebars', expressHandlebars.engine({
	defaultLayout: 'main',
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');

const port = process.env.PORT || 3000

app.get('/',  function(request, response) {
	response.render('home');
});

app.get('/test', function(request, response) {
	response.type('text/plain')
	response.send('Node.js and Express running on port='+port)
});

app.listen(port, function() {
	console.log("Server is running at http://localhost:3000/")
});
