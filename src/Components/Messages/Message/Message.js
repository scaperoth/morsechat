import React from 'react';
import PropTypes from 'prop-types';

import './Message.css';

const Message = ({ username, message, showAuthor, isAuthor, onClick }) => (
	<div onClick={onClick} className={`message-container ${isAuthor ? 'my-message' : 'their-message'}`}>
		<div className={`message-box ${showAuthor ? 'mt-3' : ''}`}>
			{
				showAuthor && <div className={`message-author`}>
					{username}
				</div>
			}
			<div className={`message-text`}>
				{message}
			</div>
		</div>
	</div>
);

Message.propTypes = {
	username: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	showAuthor: PropTypes.bool.isRequired,
	isAuthor: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
};

export default Message;
