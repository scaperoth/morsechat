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
		username: '',
		message: '',
		messages: []
	}

	componentDidMount = () => {
		this.socket = io(config.morseSocketURL);
	}

	/**
	 * saves form field to state based on name and value
	 */
	onChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	}

	/**
	 * handle form submit from signin
	 */
	signInFormSubmit = (e) => {
		e.preventDefault();
		this.signIn();
	}

	/**
	 * perform all that needs to happen on sign in.
	 * This includes setting logged in state and subscibing
	 * to messages
	 */
	signIn = () => {

		this.socket.emit('CONNECT', {
			user: this.state.username
		});

		this.setState({ loggedin: true });

		this.socket.on('USER_CONNECTED', (data) => {
			this.addMessage({ connected: data.user });
		});

		this.socket.on('USER_DISCONNECTED', (data) => {
			this.addMessage({ disconnected: true });
		});

		this.socket.on('RECEIVE_MESSAGE', (data) => {
			this.addMessage({...data, encrypted: true});
		});
	}

	/**
	 * send a message to all users
	 */
	sendMessage = e => {
		e.preventDefault();
		this.socket.emit('SEND_MESSAGE', {
			author: this.state.username,
			message: this.state.message
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
			loggedin
		} = this.state;

		return (
			<div className={`chat`}>
				{ !loggedin && <SignIn onSubmit={this.signInFormSubmit} onChange={this.onChange} username={username}/> }
				{ loggedin > 0 &&
					<div className={`chat-control`}>
						<h2 className={`title`}>Current Channel</h2>
						<MessageList messages={messages} currentUser={username} decrypt={this.decryptMessage} encrypt={this.encryptMessage}/>
						<ChatForm onSubmit={this.sendMessage} onChange={this.onChange} username={username} message={message}/>
					</div>
				}
			</div>
		)
	}
}

export default ChatPage;
