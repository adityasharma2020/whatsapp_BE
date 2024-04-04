import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import createHttpError from 'http-errors';
import routes from './routes/index.js';
// dotenv configuration
dotenv.config();

//------create express app-----------------
const app = express();

//morgan
if (process.env.NODE_ENV != 'production') {
	app.use(morgan('dev'));
}
//helmet
app.use(helmet());

//parse josn request url
app.use(express.urlencoded({ extended: true }));

//parse json request body
app.use(express.json());

//express mongo sanitize user data
app.use(mongoSanitize());

// cookie parser
app.use(cookieParser());

//gzip compression
app.use(compression());

//express fileupload
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
	})
);

//cors
app.use(cors());

//---------------------routes----------------------
//api v1 routes
app.use('/api/v1', routes);

app.get('/test', (req, res) => {
	throw createHttpError.BadRequest('this test route has an error');
});

app.use('/', (req, res) => {
	res.send(`<div>this is  main page</div>`);
});

// -----------------Error handling-------------------------------
app.use(async (req, res, next) => {
	next(createHttpError.NotFound('this route does not exist.'));
});

//Error handling
app.use(async (err, req, res, next) => {
	res.status(err.status || 500);
	res.send({
		error: {
			status: err.status || 500,
			message: err.message,
		},
	});
	next();
});

export default app;
