const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up at port '+port)
})

//request -> middleware -> rooute handler.
//encrypted data can be decrypted but hashing algorithms are irreversible.
//before res.send() toString() is called on the object which converts the return value from toJSON into a string.
//each object has it's toJSON method and we can also customize it.
//...is used to populate objects

// const multer = require('multer')
// const upload = multer({
//     dest : 'images',
//     limits : {
//         fileSize : 1000000
//     },
//     fileFilter(req,file,cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             cb(new Error('File type not supported'))
//         }
//         cb(undefined, true)
//     }
// })
// app.post('/upload', upload.single('upload'), (req,res) => {
//     res.send()
// })


//MIDDLEWARE
// app.use((req,res,next) => {
//     if(req.method === 'GET'){
//         res.send('Access Denied')         
//     }
//     else{
//         next()
//     }
// })