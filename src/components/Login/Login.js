import React, {useEffect, useState, useReducer} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const initialEmailState = {
    value: "",
    isValid: undefined
}
const initialPasswordState = {
    value: "",
    isValid: undefined
}
const emailReducer = (previousState, action) => {
    if (action.type === "USER_INPUT") {
        return {value: action.value, isValid: action.value.includes('@')}
    }
    // react guarantees that the first argument in reducer function has the absolute latest value fo the state
    if (action.type === "INPUT_BLUR") {
        return {value: previousState.value, isValid: previousState.value.includes('@')}
    }
    return {value: "", isValid: false}
}
const passwordReducer = (previousState, action) => {
    if (action.type === "USER_INPUT") {
        return {value: action.value, isValid: action.value.trim().length > 6}
    }
    if (action.type === "INPUT_BLUR") {
        return {value: previousState.value, isValid: previousState.value.trim().length > 6}
    }
    return {value: "", isValid: false}
}
const Login = (props) => {
    const [formIsValid, setFormIsValid] = useState(false);
    const [emailState, dispatchEmail] = useReducer(emailReducer, initialEmailState);
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, initialPasswordState)
    const {isValid: isEmailValid} = emailState
    const {isValid: isPasswordValid} = passwordState
    // don't check for form validity after each keystroke so set a timer
    // after each keystroke remove that timer immediately if there is another keystroke
    // only after last keystroke don't delete the timer instead finish it after 500ms run the validity check
    // thus saving app from unnecessary renders and lag
    useEffect(() => {
        const formValidationTimer = setTimeout(() => {
            console.log("Checking for validity ...");
            setFormIsValid(
                isEmailValid && isPasswordValid
            );
        }, 500)
        return (() => {
            clearTimeout(formValidationTimer)
            console.log("cleanup")
        })
    }, [isEmailValid, isPasswordValid])

    const emailChangeHandler = (event) => {
        dispatchEmail({type: "USER_INPUT", value: event.target.value})
    };

    const passwordChangeHandler = (event) => {
        dispatchPassword({type: "USER_INPUT", value: event.target.value});
    };

    const validateEmailHandler = () => {
        dispatchEmail({type: "INPUT_BLUR"})
    };

    const validatePasswordHandler = () => {
        dispatchPassword({type: "INPUT_BLUR"})
    };

    const submitHandler = (event) => {
        event.preventDefault();
        props.onLogin(emailState.value, passwordState.value);
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <div
                    className={`${classes.control} ${
                        emailState.isValid === false ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        value={emailState.value}
                        onChange={emailChangeHandler}
                        onBlur={validateEmailHandler}
                    />
                </div>
                <div
                    className={`${classes.control} ${
                        passwordState.isValid === false ? classes.invalid : ''
                    }`}
                >
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={passwordState.value}
                        onChange={passwordChangeHandler}
                        onBlur={validatePasswordHandler}
                    />
                </div>
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn} disabled={!formIsValid}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
