import React, { Component } from 'react';
import io from "socket.io-client";
import config from '../../app.config';

import { decrypt, encrypt } from '../../Actions/MorseActions';

import SignIn from '../../Components/SignIn';
import ChatForm from '../../Components/ChatForm';
import { MessageList } from '../../Components/Messages';

import './ChatPage.css';

class ChatPage extends Component {
	state = {
		loggedin: false,
		securityToken: '',
		username: '',
		message: '',
		messages: [],
		numSignedIn: 0
	}

	componentDidMount = () => {}

	/**
	 * saves form field to state based on name and value
	 */
	onChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
			error: false
		});
	}

	/**
	 * handle form submit from signin
	 */
	signInFormSubmit = (e) => {
		e.preventDefault();
		this.connectSocketsAndLogin();
	}

	/**
	 * start up socket connection and subscribe to
	 * socket events for disconnect and error then tries to
	 * connect to server by logging in user
	 */
	connectSocketsAndLogin = () => {

		try {
			this.socket = io(config.morseSocketURL);

			this.socket.on('disconnect', () => {
				this.socket.close();
				this.setState({ loggedin: false });
			});

			this.socket.on('connect_error', () => {
				this.setState({ error: 'Unable to connect at this time. Please try again later.' });
				this.socket.close();
			});

			this.socket.emit('CONNECT', {
				username: this.state.username
			}, this.signIn);

		} catch (err) {
			console.log(err);
			this.socket.close();
		}
	}

	/**
	 * checks for errors, sets state, and subscribes to socket events
	 * @param  {String} error       error message from server
	 * @param  {String} token       security token for user
	 * @param  {Number} numSignedIn number of active users in chat
	 * @param  {String} username    signed in user
	 */
	signIn = ({ error, token, numSignedIn, username }) => {

		if (error) {
			this.setState({ error });
			return;
		}

		this.setState({
			loggedin: true,
			securityToken: token,
			numSignedIn: parseInt(numSignedIn)
		});

		this.socket.on('USER_CONNECTED', (data) => {
			if (data.username !== username) {
				this.setState({ numSignedIn: this.state.numSignedIn + 1 });
			}
			this.addMessage({ connected: data.username });
		});

		this.socket.on('USER_DISCONNECTED', (data) => {
			if (data.username !== username) {
				this.setState({ numSignedIn: this.state.numSignedIn - 1 });
			}
			this.addMessage({ disconnected: data.username });
		});

		this.socket.on('RECEIVE_MESSAGE', (data) => {
			console.log('data', data);
			this.addMessage({ ...data, encrypted: true });
		});
	}

	/**
	 * send a message to all users
	 */
	sendMessage = e => {
		e.preventDefault();
		this.socket.emit('SEND_MESSAGE', {
			username: this.state.username,
			message: this.state.message,
			token: this.state.securityToken
		});
		this.setState({ message: '' });
	}

	/**
	 * add a message to the output screen and
	 * scroll window down to the bottom
	 */
	addMessage = data => {
		this.setState({ messages: [...this.state.messages, data] });
		const listContainer = document.getElementsByClassName('message-list')[0];
		listContainer.scrollTop = listContainer.scrollHeight;
	};

	/**
	 * take index of message to decrypt and call api then, with response,
	 * update the message list
	 * @param {Number} idx index of string to encrypt in message list
	 */
	decryptMessage = async (idx) => {
		const { messages } = this.state;
		const messageToDecrypt = messages[idx].message;
		try {
			const { data: response } = await decrypt(messageToDecrypt);
			messages[idx].message = response.message;
			messages[idx].encrypted = false;
			this.setState({ messages });
		} catch (err) {
			console.log('could not decrypt message!');
		}
	}

	/**
	 * take index of message to encrypt and call api then, with response,
	 * update the message list
	 * @param {Number} idx index of string to encrypt in message list
	 */
	encryptMessage = async (idx) => {
		const { messages } = this.state;
		const messageToDecrypt = messages[idx].message;
		try {
			const { data: response } = await encrypt(messageToDecrypt);
			messages[idx].message = response.message;
			messages[idx].encrypted = true;
			this.setState({ messages });
		} catch (err) {
			console.log('could not encrypt message!');
		}
	}

	render = () => {
		const {
			username,
			messages,
			message,
			loggedin,
			numSignedIn,
			error
		} = this.state;

		return (
			<div className={`chat`}>
				{ !loggedin && <SignIn onSubmit={this.signInFormSubmit} onChange={this.onChange} username={username} error={error}/> }
				{ loggedin > 0 &&
					<div className={`chat-control`}>
						<h2 className={`title`}>Morse Chat Room</h2>
						<p>Your Username: <b>{username}</b> | {numSignedIn - 1} Other Users</p>
						<MessageList messages={messages} currentUser={username} decrypt={this.decryptMessage} encrypt={this.encryptMessage}/>
						<ChatForm onSubmit={this.sendMessage} onChange={this.onChange} username={username} message={message}/>
					</div>
				}
			</div>
		)
	}
}

export default ChatPage;
