import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginForm } from './LoginForm.jsx'

const { useState } = React

export function LoginSignup({ onSetUser }) {

    const [isSignup, setIsSignUp] = useState(false)

    function onLogin(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    function login(credentials) {
        console.log(credentials);
        userService.login(credentials)
            .then(onSetUser)
            .then(() => { showSuccessMsg('Logged in successfully') })
            .catch((err) => {
                console.log(err);
                showErrorMsg('OoPs try again') })
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then(onSetUser)
            .then(() => { showSuccessMsg('Signed in successfully') })
            .catch((err) => { showErrorMsg('OopS try again') })
    }

    return (
        <div className="login-page">
            <LoginForm
                onLogin={onLogin}
                isSignup={isSignup}
            />
            <div className="btns">
                <a href="#" onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a >
            </div>
        </div >
    )
}
