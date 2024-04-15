/* 
  functions that we use in jwt are not async so we cant use async await
  so what we do we make a promise and return for us.
  Since these functions do not return promises directly, they cannot be used directly
   with async/await syntax, which is a more modern and cleaner way of handling asynchronous operations.

   to make these functions compatible with async/await, promises are manually created and returned. 
*/

import jwt from 'jsonwebtoken';
import logger from '../config/logger.config.js';

//here we are just generating the token

export const sign = async (payload, expiresIn, secret) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			secret,
			{
				expiresIn: expiresIn,
			},
			(error, token) => {
				if (error) {
					logger.error(error);
					reject(error);
				} else {
					resolve(token);
				}
			}
		);
	});
};

export const verify = async (token, secret) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (error, payload) => {
			if (error) {
				logger.error(error);
				reject(error);
			} else {
				resolve(payload);
			}
		});
	});
};

// This function converts a period like '1d' or '30d' to milliseconds and returns the future timestamp
export const getFutureTimestamp = (duration) => {
	const units = {
		s: 1000, // seconds
		m: 60 * 1000, // minutes
		h: 60 * 60 * 1000, // hours
		d: 24 * 60 * 60 * 1000, // days
	};
	const unit = duration.slice(-1);
	const amount = parseInt(duration.slice(0, -1));
	const durationInMilliseconds = amount * (units[unit] || 0);
	return Date.now() + durationInMilliseconds;
};
