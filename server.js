require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const { addUserData, handleExpiredSession } = require('./middleware/auth');

const app = express();

// Trust proxy - Required for rate limiting behind reverse proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Validate SESSION_SECRET
if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: SESSION_SECRET not found in environment variables. Using fallback secret.');
  console.warn('Please add SESSION_SECRET to your .env file for production use.');
}

// MySQL session store configuration
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Session middleware
app.use(session({
  key: 'session_cookie_name',
  secret: process.env.SESSION_SECRET || 'spmb-smkjp1-fallback-secret-key-change-in-production',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// EJS and layout configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(addUserData);

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard/index');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 Not Found - SPMB SMK Jakarta Pusat 1',
    message: 'Halaman Tidak Ditemukan',
    error: {
      status: 404,
      stack: 'Halaman yang Anda cari tidak ditemukan'
    },
    layout: false
  });
});

// Error handler
app.use(handleExpiredSession);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    title: 'Error - SPMB SMK Jakarta Pusat 1',
    message: err.message || 'Terjadi Kesalahan',
    error: process.env.NODE_ENV === 'development' ? err : {
      status: err.status || 500,
      stack: 'Terjadi kesalahan pada sistem'
    },
    layout: false
  });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {  // Gantilah 'localhost' atau '127.0.0.1' dengan '0.0.0.0'
  console.log(`Server is running on port ${PORT}`);
});