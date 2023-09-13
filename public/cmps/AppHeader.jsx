
const { Link, NavLink } = ReactRouterDOM
const { useState } = React
const { useNavigate } = ReactRouter

import { LoginSignup } from './LoginSignup.jsx'
import { UserMsg } from './UserMsg.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedinUser())
  const navigate = useNavigate()

  function onLogout() {
    userService.logout()
      .then(() => {
        onSetUser(null)
        navigate('/')
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }


  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }


  return (
    <header>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/bug">Bugs</NavLink>
        <NavLink to="/about">About</NavLink>
        {user && user.isAdmin && <NavLink to="/users">Users</NavLink>}

      </nav>
      <h1>Bugs are Forever</h1>
      {user ? (
        < section >

          <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
          <button onClick={onLogout}>Logout</button>
        </ section >
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}
      <UserMsg />
    </header>

  )
}
