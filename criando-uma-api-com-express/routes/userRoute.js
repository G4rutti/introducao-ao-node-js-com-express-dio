const fs = require('fs')
const {join} = require('path')

const filePath = join(__dirname, 'users.json')

const getUsers = () => {
    const data = fs.existsSync(filePath)
        ?fs.readFileSync(filePath)
        :[]

    try {
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

const SaveUser = (users) => {
    fs.writeFileSync(filePath,JSON.stringify(users,null,'\t'))
}

const userRoute = (app) => {
    app.route('/users/:id?').get((req,res) =>{
        const users = getUsers()
        res.send({users})
    })
    app.route('/users/').post((req,res) =>{
        const users = getUsers()
        users.push(req.body)
        SaveUser(users)

        res.status(201).send('OK')
    })
    app.route('/users/:id?').put((req,res) =>{
        const users = getUsers()

        SaveUser(users.map(user => {
            if(user.id == req.params.id){
                return{
                    ...user,
                    ...req.body
                }
            }
            return user
        }))

        res.status(200).send('Ocorreu certo')
    })
    app.route('/users/:id?').delete((req,res) =>{
        const users = getUsers()

        SaveUser(users.filter(user => user.id !== req.params.id))

        res.status(200).send('Ocorreu certo')
    })
}

module.exports = userRoute