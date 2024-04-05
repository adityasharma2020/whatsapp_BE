/* 

    * SIGTERMSIGTERM is a signal in Unix-like operating systems that stands for
      "termination signal." It's a way for a process to receive a request to terminate gracefully.
    * This is especially important in environments like Docker containers or
      cloud-based services where you might need to stop or restart services efficiently and safely.
    * The key aspect of handling SIGTERM is to terminate your process gracefully. This means closing
      database connections, stopping server listeners, flushing logs, and performing any cleanup needed to
      ensure that the program stops in a controlled and predictable manner. This is especially important in
      production environments to minimize data loss or corruption.


      we should do .on event before going for mongoose.connection as 
       If an error occurs before the event handler is registered, there won't be a listener in place to handle it. 
       In this case, the error might be thrown as an unhandled exception, leading to a crash of the Node.js process.
*/

import mongoose from 'mongoose';
import app from './app.js';
import logger from './config/logger.config.js';

//env variables
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

// -----------------mongodb setup-------------------------------------

// event listener for events emitted by the mongoose.connection : exit on mongodb error
mongoose.connection.on('error', (error) => {
	logger.error(`MONGOdb Connection error: ${error}`);
	process.exit(1);
});

//mongodb debug mode : to show any operation happens on mongodb only for development only
if (process.env.NODE_ENV != 'production') {
	mongoose.set('debug', true);
}

//mongodb connection
mongoose
	.connect(DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		logger.info('connected to MONGODB.');
	});

// -------------listen to server -------------------------

let server = app.listen(PORT, () => {
	logger.info(`server is listening at ${PORT}`);
	// console.log(process.pid);
	// throw new Error('error in server');
});

//----------handle server errors----------------------
const exitHandler = () => {
	if (server) {
		logger.info('server closed');
		process.exit(1);
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	logger.error(error);
	exitHandler(); // to exit the server
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// SIGTERM is a termination signa In UNIX to terminate our process gracefully.
process.on('SIGTERM', () => {
	if (server) {
		logger.info('server closed');
		process.exit(1);
	}
});
