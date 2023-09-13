import { utilService } from "./utils.service.js";
import fs from 'fs'
import Cryptr from 'cryptr'

const cryptr = new Cryptr(process.env.SECRET || 'Secret-Puk-1234')

const users = utilService.readJsonFile('data/user.json')

export const userService = {
    add,            // Create (Signup)
    getById,        // Read (Profile page)
    query,          // List (of users)
    getLoginToken,
    validateToken,
    checkLogin,
    remove
}



function checkLogin({ username, password }) {
    var user = users.find(u => u.username === username && u.password === password)
    if (user) {
        // mini-user:
        user = {
            _id : user._id,
            fullname : user.fullname,
            score: user.score,
            isAdmin: user.isAdmin
        }
    }
console.log(user);
    return Promise.resolve(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    if (!loginToken) return null
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
}

function query() {
    const res = users.map(user => {
        user = {...user}
        delete user.password
        return user

    })
    return Promise.resolve(res)
}

function getById(userId) {
    var user = users.find(user => user._id === userId)
    if (user) {
        user = {
            _id : user._id,
            fullname : user.fullname,
            score: user.score

        }
    }
    return Promise.resolve(user)
}

function add({ fullname, username, password }) {

    const user = {
        _id: utilService.makeId(),
        fullname,
        username,
        password,
        score: 1000
    }

    users.push(user)
    return _saveUsersToFile().then(() => ({_id: user._id, fullname: user.fullname}))
}


function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

function remove(userId) {
    console.log(userId, 'userId');

    const userIdx = users.findIndex(user => user._id === userId)
    users.splice(userIdx, 1)
    return _saveUsersToFile()
    // return Promise.resolve()
}