import HttpClient from '../Utils/HttpClient';

export const decrypt = (message) => {
	return HttpClient.get('/morse/decrypt', {
		params: {
			message
		}
	})
};

export const encrypt = (message) => {
	return HttpClient.get('/morse/encrypt', {
		params: {
			message
		}
	})
}
