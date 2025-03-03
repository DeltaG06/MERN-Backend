import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//register a new endpoint /auth/register
router.post('/register',(req,res)=>{

    const { username, password } = req.body
    // save the username and an irreversibly encrypted password
    // gaurav123 | aklsdjfasdf.asdf..qwe..q.we...qwe.qw.easd

    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to the db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        // now that we have a user, I want to add their first todo for them
        const defaultTodo = `Hello! Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create a token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(error.message)
        res.sendStatus(503)
    }
    
})

router.post('/login',(req,res) => {

    //we get email and we look for password associated with it
    //when we get it back the password is encrypted
    //so it cannot be compared with the password entered by the user
    //so what we can do is again, one way encrypt the password user entered
    const {username,password} = req.body
    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        if (!user){return res.status(404).send({message: " User not found"})}
      //if we do not find a user with that username return out of the funtion
        const passwordIsValid = bcrypt.compareSync(password,user.password)
        // id password does not match , return out of the funtion
        
        if(!passwordIsValid){return res.status(101).send({message: "Invalid Password"}) }
        console.log(user)
        
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })
    } catch (error) {
        console.log(error.message)
        res.sendStatus(583)
    }

    

    

    

})

export default router
