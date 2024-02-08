const mongoose = require("mongoose")
const User = require("./model/user")
const Post = require("./model/post")
const Commnent = require("./model/comment")

const { faker } = require('@faker-js/faker');
const bcrypt = require("bcryptjs")
const fs = require('fs')

let data = ""
const userAndPasswordData = []
 
// Write data in 'Hello.txt' .

require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URI);
        console.log("connected to db");
    } catch (error) {
        console.error(error);
    }
};

const generateUsers = (num) => {
    const user = [];
    
    for (let i = 0; i < num; i++) {
        const user_name =  faker.internet.userName()
        let password = faker.internet.password()
        bcrypt.hash( password, 10, async (err, hashedPassword) => {
            if (err){
            console.log(`error adding the password ${err}`);
            return 
        }
        userAndPasswordData.push(`user: ${user_name} password:${password}`)
        password = hashedPassword   
    });
        const email = faker.internet.email()
        const about = faker.lorem.sentences(2)
        const birt_date = faker.date.past({ years: i+2})
        const image = faker.image.avatar()
        user.push({
        user_name,
        password,
        email,
        about,
        birt_date,
        image
    });
}

return user;
};

const generatePosts = (users, num) => {
    const posts = []

    for (let i = 0; i<num; i++) {
        const author = users[Math.floor(Math.random()*users.length)]._id;
        const content = faker.lorem.sentences(i*2 + 1);
        
        const likes = {}
        for (let j = 0; j <= i; j++){
            const userLikes = users
            .map(user => user._id)
            .splice(j)
            const validUserLikes = userLikes.filter(user => user._id !== author._id)
            
            likes.total = j
            likes.likes = validUserLikes
        }

        posts.push({
            author,
            content,
            likes,
        }) 
    }
    
    return posts
}

const generateComments = (users, posts, num) =>{
    
    const comments = []
    
    for(let i = 0; i<num; i++){
        const post = posts[Math.floor(Math.random()*posts.length)]._id
        const author = users
        .filter(user => user._id !== post.author)
        [Math.floor(Math.random()*users.length)]
        ._id
        const content = faker.lorem.sentences(1)
        
        comments.push({
            author,
            post,
            content
        })
    }
    
    return comments
}

const populate = async () =>{
    
    connectDB()
    let user = null 
    await User.insertMany(generateUsers(5))
    .then(docs => {
        console.log(`${docs.length} users have been inserted into the database.`);
        user = docs
    })
    .catch(err => {
        console.error(err);
        console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    });
    
    let post = null
    await Post.insertMany(generatePosts(user, 10))
    .then(docs => {
        console.log(`${docs.length} Posts have been inserted into the database.`);
        post = docs
    })
    .catch(err => {
        console.error(err);
        console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    });
    
    let comments = null
    await Commnent.insertMany(generateComments(user,post,10))
    .then(docs => {
        console.log(`${docs.length} Comments have been inserted into the database.`);
        comments = docs
    })
    .catch(err => {
        console.error(err);
        console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    });
    
    console.log(userAndPasswordData);

    data = userAndPasswordData.join('\n')
    
    fs.writeFile('UsersData.txt', data, (err) => {
     
        // In case of a error throw err.
        if (err) throw err;
    })
    
}
populate()