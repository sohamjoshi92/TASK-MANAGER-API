const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONNECT_URL, { useNewUrlParser : true, 
useCreateIndex : true,
useUnifiedTopology : true,
useFindAndModify : false })

// const user_one = new user({ name : 'Ron  ', email : 'ron23@gmail.cOM   ', password : '   ron@1234  ' })
// user_one.save().then(() => {
//     console.log('done')
// }).catch((error) => {
//     console.log(error)
// })

// const task_one = new task({ description : 'jogging' })
// task_one.save().then(() => {
//     console.log('done')
// }).catch((error) => {
//     console.log(error)
// })