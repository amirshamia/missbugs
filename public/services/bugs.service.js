import { utilService } from './util.service.js'


const BASE_URL = '/api/bug/'



export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptybug,
    getDefaultFilter,
}

function query(sortBy, filterBy, creator) {
    return axios.get(BASE_URL, { params: { ...filterBy } }).then(res => {
        console.log(res.data)
        return res.data
    })
        .then(bugs => {
            if (creator) {
                bugs = bugs.filter(bug => bug.creator._id === creator._id)
            }
            if (sortBy.key) utilService.sortBy(bugs, sortBy.key, sortBy.dir)
            return bugs
        })
        .catch(err => console.log(err))
}

function get(bugId) {
    // return storageService.get(bug_KEY, bugId)
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    


    // let queryParams = `?title=${bug.title}&severity=${bug.severity}`

    // if (bug._id) queryParams += `&_id=${bug._id}`
    // return axios.get(url + queryParams).then(res => res.data)
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)
}

function getEmptybug(title = '', severity = '') {
    return { title, severity }
}

function getDefaultFilter() {
    return { title: '', severity: '', label: '' }
}

