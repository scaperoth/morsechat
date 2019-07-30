// src/app.config
// environment variables

export default {
	morseApiURL: process.env.REACT_APP_MORSE_API_URL || 'http://localhost:8080',
	morseSocketURL: process.env.REACT_APP_MORSE_SOCKET_URL || 'http://localhost:8080',
};
