import { bugService } from '../services/bugs.service.js'
import { showSuccessMsg, showErrorMsg } from '../public/services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { BugsFilter } from '../cmps/BugsFilter.jsx'
import { userService } from '../services/user.service.js'
const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    // const debouncedSetFilter = useRef(utilService.debounce(onSetFilterBy, 500))
    const [sortrBy, setSortrBy] = useState({ key: '', dir: 1 })

    useEffect(() => {
        loadBugs()

        // console.log(filterBy);
    }, [sortrBy, filterBy])

    function loadBugs() {
        bugService.query(sortrBy, filterBy).then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        console.log(user);
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            createdAt: Date.now(),
            creator: {
                _id: user._id,
                fullname: user.fullname
            }
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

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
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugsFilter filterBy={filterBy} setFilterBy={setFilterBy} />
                <BugSort sortBy={sortrBy} onSort={setSortrBy} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
