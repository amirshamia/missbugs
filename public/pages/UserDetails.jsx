const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bugs.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)

    const { userId } = useParams()
    useEffect(() => {
        userService.get(userId)
            .then(user => {
                setUser(user)
            })
            .catch(err => {
                showErrorMsg('Cannot load user')
            })
    }, [])
    useEffect(() => {
        if(user){
        bugService.query('', '', user)
            .then(setBugs)
        }
    }, [user])

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                // showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                // showErrorMsg('Cannot update bug')
            })
    }
    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                // showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                // showErrorMsg('Cannot remove bug')
            })
    }

    if (!user) return <div>loading</div>
    return (
        <section>
            <h3>{user.fullname}</h3>
            <BugList bugs={bugs} onEditBug={onEditBug} onRemoveBug={onRemoveBug}/>
        </section>
    )
}