/*
 * adding morgan middleware for our http request logger
 * helmet middleware helps us in secure our exprss apps by adding various http headers.
 * add express json and urlencoded middleware to parse json request form body and url
 * adding express-mongo-sanatize middleware to sanitizes user supplied data to prevent mongodb operator injections.
 * adding cookie parser middleware to parse cookie header and populate req.cookies with an object keyed by the cokkie names.
 * adding compression middleware to compress response bodies for all request that traverse through the middlewares.
 * adding express file upload middleware to make uploaded files accessible from req.files.
 * adding CORS to protect our backend , so that we only wants some origins to access it.(basically restrict access to the server).
 * http errors middleware to handle http errors
 */
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

// CORS Allowed origin
const allowedOrigins = ['https://the-chatapp.netlify.app'];
const corsOptions = {
	origin: function (origin, callback) {
		// Check if the origin is in the list of allowed origins
		// When a request is made from a page to the same origin (the same scheme, hostname, and port), browsers typically do not include an Origin header.
		// This behavior is part of the browser's same-origin policy to allow same origin requests and Non-CORS Requests.
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true); // Allow the request
		} else {
			callback(new Error('Not allowed by CORS')); // Block the request
		}
	},
};

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

//cookie parser
app.use(cookieParser());

//gzip compression
app.use(compression());

//express fileupload
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/', // when we upload a file it create a temp folder
	})
);

//cors
app.use(cors(corsOptions));

//---------------------routes----------------------
//api v1 routes
app.use('/api/v1', routes);

app.get('/test', (req, res) => {
	throw createHttpError.BadRequest('this test route has an error');
});

app.get('/', (req, res) => {
	res.send(`<div>this is  main page</div>`);
});

// Default Route Handler : acts as a catch-all for unmatched routes.
app.use(async (req, res, next) => {
	next(createHttpError.NotFound('this route does not exist.'));
});

// -----------------Error handling-------------------------------

// this is our error-handling middleware : It's a centralized place to handle application errors
// here using async is not necessary, but using async might be helpful in future if we wnat to logging to DB.
app.use(async (err, req, res, next) => {
	res.status(err.status || 500);
	res.send({
		error: {
			status: err.status || 500,
			message: `message::${err.message}`,
		},
	});
});

export default app;
