import { userService } from "../services/user.service.js";
import { bugService } from "../services/bugs.service.js";

const { useState, useEffect } = React


export function UserList() {
    const [users, setUsers] = useState()

    useEffect(() => {
        userService.query()
            .then(setUsers)
        console.log(users);
    }, [])

    function onRemove(userId) {
        userService.get(userId)
            .then(user => {
                checkOwner(user).then(res => {
                    console.log(res);
                    if (!res){ userService.remove(userId)
                    console.log('Deleted Succesfully!')
                    const usersToUpdate = users.filter((user) => user._id !== userId)
                    setUsers(usersToUpdate)
                    }
                    // showSuccessMsg('Bug removed')
                })


            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                // showErrorMsg('Cannot remove bug')
            })
    }

    function checkOwner(user) {
        return bugService.query('', '', '')
            .then(bugs => {
                console.log(bugs, 'sssss');
                return bugs.some(bug => bug.creator._id === user._id)
            })
    }

    if (!users) return <div>loading</div>
    return (
        <ul>
            {users.map(user => {
                return <li key={user._id}>{user.fullname} <button onClick={() => onRemove(user._id)}>X</button></li>
            })}

        </ul>
    )

}