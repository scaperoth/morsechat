import React from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Button } from 'reactstrap';

import './SignIn.css';

const SignIn = ({ onSubmit, onChange, username }) => (
	<div className={`sign-in`}>
		<h2 className={`title`}>Morse Chat</h2>
		<Form className={`sign-in-form`} onSubmit={onSubmit}>
			<Input placeholder={`username`} autoFocus value={username} name={`username`} onChange={onChange}/>
			<Button type={`submit`} color={`primary`}>Login</Button>
		</Form>
	</div>
);

SignIn.propTypes = {
	onSubmit: PropTypes.func.isRequired
};

export default SignIn;
