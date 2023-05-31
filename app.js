require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser} = require('./middleware/authMiddleware');
const chinController = require('./controllers/chinController');
const Todo = require('./models/chinModels');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.DBSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));


// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.redirect('/home'));


app.get('/home',  async (req, res) => {
  try {
    const todo = await Todo.find();
    res.render('home', { 
      todo
    });
  } catch (error) {
    console.log(error );
    res.status(500).send('Error getting todos');
  }
});

app.get('/veileder', requireAuth, (req, res) => {
  try {
    res.render('veileder', {
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting veileder');
  }
});

app.get('/forklaring', requireAuth, (req, res) => {
  try {
    res.render('forklaring', {});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting forklaring');
  }
});

app.get('/toDo', requireAuth, chinController.getTodo);
app.post('/createTodo', chinController.createTodo);
app.post('/updateTodo/:id', requireAuth, chinController.updateTodo);
app.delete('/deleteTodo/:id', requireAuth, chinController.deleteTodo);
app.get('/getToDo/:id', requireAuth, chinController.getTodoById);
app.post('/markDone/:id', requireAuth, chinController.markDone);
app.post('/markUndo/:id', requireAuth, chinController.markUndo);


app.use(authRoutes);