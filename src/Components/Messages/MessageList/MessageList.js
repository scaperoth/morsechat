import React from 'react';
import PropTypes from 'prop-types';
import Message from '../Message';

import './MessageList.css';

const MessageList = ({ messages, currentUser, decrypt, encrypt }) => {
	let userGroup = '';
	let showAuthor = true;

	/**
	 * compares the current group of messages with given author. If they are
	 * the same, false is returned and messages will be shown under same group. If
	 * they are different, true is returned and group is updated.
	 * @param  {String} author    name of author for message
	 * @param  {String} userGroup current user name for grouping messages
	 * @return {[bool, String]}   array of bool result and new user group
	 */
	const shouldShowAuthor = (author, userGroup) => {
		if (author && userGroup === author) {
			showAuthor = false;
		} else if (author) {
			userGroup = author;
			showAuthor = true;
		}

		return [showAuthor, userGroup];
	}

	return (
		<div className="message-list">
			{messages.map((m, idx) => {

				[ showAuthor, userGroup ] = shouldShowAuthor(m.username, userGroup);

				return (
					<div key={idx}>
						{ m.message && <Message {...m} onClick={() => m.encrypted ? decrypt(idx) : encrypt(idx)} showAuthor={showAuthor} isAuthor={currentUser === m.username}/>}
						{ m.connected && currentUser !== m.connected && <p className={`connection-message`}>User {m.connected} Connected!</p>}
						{ m.disconnected && currentUser !== m.disconnected && <p className={`connection-message`}>User {m.disconnected} Disonnected!</p>}
					</div>
				)
			})}
		</div>
	)
};

MessageList.propTypes = {
	messages: PropTypes.array.isRequired,
	currentUser: PropTypes.string.isRequired,
	decrypt: PropTypes.func.isRequired,
	encrypt: PropTypes.func.isRequired
};

export default MessageList;
