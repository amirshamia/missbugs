import fs from 'fs'
import { utilService } from './utils.service.js'

const STORAGE_KEY = 'bugDB'



export const bugService = {
    query,
    getById,
    save,
    remove,
}


const bugs = utilService.readJsonFile('data/bugs.json')


function query(filterBy = {}) {
    let bugsToSend = bugs
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugsToSend = bugsToSend.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.severity) {
        bugsToSend = bugsToSend.filter(bug => bug.severity >= filterBy.severity)
    }
    if (filterBy.label) {
        bugsToSend = bugsToSend.filter(bug => bug.labels.includes(filterBy.label))
    }
    return Promise.resolve(bugsToSend)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    console.log(bugId, 'bugid');

    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    return _savebugsToFile()
    // return Promise.resolve()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currbug => currbug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }

    return _savebugsToFile().then(() => bug)
}



function _savebugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
