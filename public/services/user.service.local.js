import { storageService } from './async-storage.service.js'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials
}

const KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function login({ username, password }) {
    return storageService.query(KEY)
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password)
            if (user) return setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }
    return storageService.post(KEY, user)
        .then(setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return Promise.resolve()
}

function setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}