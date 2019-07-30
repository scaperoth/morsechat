import React from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Button } from 'reactstrap';

import './ChatForm.css';

const ChatForm = ({ onSubmit, onChange, username, message }) => (
	<Form className={`chat-form`} onSubmit={onSubmit}>
		<Input type={`text`} value={message} name={'message'} onChange={onChange}/>
		<Button type={`submit`} color={`primary`}>Send</Button>
	</Form>
);

ChatForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired
};

export default ChatForm;
