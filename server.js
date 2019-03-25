const express=require('express');
const uuid = require('uuid');
const app = express();

let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let postsArray = [
    {
        id: uuid.v4(),
        title: "School anniversary",
        content: "The school celebrated its 50th anniversary this month.",
        author: "Juan Gonzalez",
        publishDate: new Date(2018, 8, 6)
    },
    {
        id: uuid.v4(),
        title: "Mexico wins on gastronomy challenge.",
        content: "Three participant won gold on the challenge.",
        author: "Emilio Becerra",
        publishDate: new Date(2019, 0, 6)
    },
    {
        id: uuid.v4(),
        title: "Welcome to the new blog.",
        content: "This is a new blog. I hope you all enjoy it.",
        author: "Juan Gonzalez",
        publishDate: new Date(2015, 1, 6)
    }
];

app.get('/blog-posts',(req, res) => {
    res.status(200).json({
        message: "Successfully sent the list of posts",
        status : 200,
        blogs : postsArray
    });
});

app.get('/blog-posts/:author', (req, res) => {
    let received_author = req.params.author;
    let matching_posts = [];

    if(!received_author)
    {
        res.status(406).json({
            message: "Missing author field",
            status: 406,
        });        
    }


    postsArray.forEach(item => {
        if(item.author == received_author) {
            matching_posts.push(item);
        }
    });

    if(matching_posts.length > 0)
    {
        res.status(200).json({
            message: `Successfully sent the posts with author: ${received_author}`,
            status : 200,
            posts : matching_posts
        });    
    }
    else
    {
        res.status(404).json({
            message: "Author not found",
            status: 404
        });
    }
});

app.post('/blog-posts', jsonParser, (req, res) => {
    let received_title = req.body.title;
    let received_content = req.body.content;
    let received_author = req.body.author;
    let received_publishDate = req.body.publishDate;

    if (!received_title | !received_content | !received_author | !received_publishDate)
    {
        res.status(406).json({
            message: "Missing field(s)",
            status: 406,
        });
    }
    else
    {
        let date_parts = received_publishDate.split(" ");
        
        let newPost = {
            id: uuid.v4(),
            title: received_title,
            content: received_content,
            author: received_author,
            publishDate: new Date(date_parts[0], date_parts[1] -1, date_parts[2])
        };

        postsArray.push(newPost);
        res.status(201).json({
            message: `Successfully added new post with title: ${newPost.title}`,
            status: 201,
            post: newPost
        });           
    }
});

app.delete('/blog-posts/:id*?', jsonParser, (req, res) =>{
    let received_id = req.params.id;
    let received_idBody = req.body.id;

    if(!received_id | !received_idBody | received_id != received_idBody)
    {
        res.status(406).json({
            message: "Missing or different ID field(s)",
            status: 406
        });
    }
    else
    {
        postsArray.forEach((item, index) => {
            if(item.id == received_id)
            {
                delete postsArray[index];
                res.status(204).json({
                    message: `Successfully deleted post with id: ${item.id}`,
                    status: 204
                });   
            }    
        });
        
        res.status(404).json({
        message: "Post not found",
        status: 404
        }).send("Finish");        
    }

});

app.put('/blog-posts/:id*?', jsonParser, (req, res) => {
    let received_id = req.params.id;

    if(!received_id)
    {
        res.status(406).json({
            message: "Missing ID field",
            status: 406,
        });          
    }
    else
    {
        let received_title = req.body.title;
        let received_content = req.body.content;
        let received_author = req.body.author;
        let received_publishDate = req.body.publishDate;
        
        if (!received_title && !received_content && !received_author && !received_publishDate)
        {
            res.status(404).json({
                message: "No entered fields on body",
                status: 404,
            });
        }
        else
        {
            postsArray.forEach(item => {
                if(item.id == received_id)
                {
                    if(received_title)
                        item.title = received_title;

                    if(received_content)
                        item.content = received_content;

                    if(received_author)
                        item.author = received_author;

                    if(received_publishDate)
                    {
                        let date_parts = received_publishDate.split(" ");
                        item.publishDate = new Date(date_parts[0], date_parts[1] -1, date_parts[2]);
                    } 

                    res.status(200).json({
                        message: `Successfully modified post with id: ${item.id}`,
                        status: 200,
                        post: item
                    });                     
                }
            });

            res.status(404).json({
            message: `Post with ID ${received_id} not found`,
            status: 404
            }).send("Finish");   
        }
        
    }

});

app.listen(8080, () =>{
    console.log("Your app is running in port 8080");
});