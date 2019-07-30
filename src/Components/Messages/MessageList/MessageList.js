import React from 'react';
import PropTypes from 'prop-types';
import Message from '../Message';

import './MessageList.css';

const MessageList = ({ messages, currentUser }) => {
	let userGroup = '';
	let showAuthor = true;
	return (
		<div className="message-list">
			{messages.map((message, idx) => {

				if(message.message && userGroup === message.author){
					showAuthor = false;
				}else if ( message.author ){
					userGroup = message.author;
					showAuthor = true;
				}

				return (
					<div key={idx}>
						{ message.message && <Message {...message} showAuthor={showAuthor} isAuthor={currentUser === message.author}/>}
						{ message.connected && currentUser !== message.connected && <p className={`connection-message`}>User {message.connected} Connected!</p>}
						{ message.disconnected && currentUser !== message.disconnected && <p className={`connection-message`}>User Disonnected!</p>}
					</div>
				)
			})}
		</div>
	)
};

MessageList.propTypes = {
	messages: PropTypes.array.isRequired,
};

export default MessageList;
