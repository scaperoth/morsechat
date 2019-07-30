import React from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Button } from 'reactstrap';

import './SignIn.css';

const SignIn = ({ onSubmit, onChange, username, error = false }) => (
	<div className={`sign-in`}>
		<div className={`title-section`}>
			<h2 className={`title`}>Morse Chat</h2>
			<p className={`subtitle`}>Login in with any username. No password needed. Nothing is stored.</p>
		</div>
		<Form className={`sign-in-form`} onSubmit={onSubmit}>
			{error.length && <p className={`text-danger error-message`}>{error}</p>}
			<Input placeholder={`Example: CoolPerson`} className={error ? 'error': ''} autoFocus value={username} name={`username`} onChange={onChange}/>
			<Button type={`submit`} color={`primary`}>Let's Go!</Button>
		</Form>
	</div>
);

SignIn.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	error: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.string
	])
};

export default SignIn;
