import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'


import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js' 
const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:






// Get bugs (READ)
app.get('/api/bug/', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        severity: req.query.severity || 0,
        label: req.query.label
        // pageIdx: req.query.pageIdx ? +req.query.pageIdx : undefined
    }
    bugService.query(filterBy)
        .then(bugs => {
            console.log(bugs,'tosend');
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})



// Save bug (CREATE/UPDATE)
app.put('/api/bug/', (req, res) => {
    console.log('req.query:', req.body)
    const bug = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        createdAt: +req.body.createdAt
    }

    bugService.save(bug)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.post('/api/bug/', (req, res) => {
    console.log('req.query:', req.body)
    const bug = {
      
        title: req.body.title,
        severity: +req.body.severity,
        createdAt: +req.body.createdAt,
        creator: {
            _id: req.body.creator._id,
            fullname: req.body.creator.fullname
        }
    }

    bugService.save(bug)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Get bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    let visitedCount = req.cookies.visitedCount || {}
    visitedCount[bugId]? visitedCount[bugId]+=1 :visitedCount[bugId]=0
    res.cookie('visitedCount', visitedCount)
    console.log('visitedCount:', visitedCount)
  // Check if there are 3 unique bug IDs in visitedCount
  const uniqueBugIds = Object.keys(visitedCount).length;
  if (uniqueBugIds >= 3) {
    console.log('Over 3 unique bug IDs visited.');
return res.status(401).send('Wait for a bit')
}
    bugService.getById(bugId)

        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove bug (Delete)
app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(() => {
            console.log(`bug ${bugId} removed!`);
            // res.redirect('/api/bug/')
            res.send('Bug removed successfully')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })

})

// Get Users (READ)
app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot get users')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const userId = req.params.userId
    console.log(userId,'userid');
    userService.remove(userId)
        .then(() => {
            console.log(`user ${userId} removed!`);
            // res.redirect('/api/user/')
            res.send('user removed successfully')
        })
        .catch((err) => {
            loggerService.error('Cannot remove user', err)
            res.status(400).send('Cannot remove user')
        })

})

// Get Users (READ)
// app.get('/api/users'), (req,res)=>{
//     userService.query()
//     .then(users=>res.send(users))
//     .catch(err => {
//         loggerService.error('Cannot get users', err)
//         res.status(400).send('Cannot get users')
//     })
// }


app.get('/api/user/:userId', (req, res) => {

    const { userId } = req.params

    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    console.log(credentials );

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})




app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.add(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout..')
})

// app.get('/api/car/pdf', (req, res) => {

// // })

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

