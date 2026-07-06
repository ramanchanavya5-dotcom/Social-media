const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== MongoDB =====
mongoose.connect("mongodb+srv://pkomali440_db_user:tracker03@financetracker.xocysbb.mongodb.net/socialmediaDB?retryWrites=true&w=majority&appName=FinanceTracker")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// ===== Home =====
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
});

// ===================== USERS =====================

// Register
app.post("/register", async(req,res)=>{

    try{

        const user = new User(req.body);

        await user.save();

        res.json({
            success:true,
            message:"Registration Successful"
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

// Login
app.post("/login", async(req,res)=>{

    const user = await User.findOne({

        email:req.body.email,
        password:req.body.password

    });

    if(user){

        res.json({
            success:true,
            user
        });

    }else{

        res.json({
            success:false,
            message:"Invalid Credentials"
        });

    }

});
// Follow User

app.put("/follow/:username", async(req,res)=>{

try{

const user=await User.findOne({

name:req.params.username

});

if(!user){

return res.json({

success:false

});

}

user.followers++;

await user.save();

res.json({

success:true,

followers:user.followers

});

}catch(err){

res.status(500).json({

message:err.message

});

}

});

// ===================== POSTS =====================

// Get All Posts
app.get("/posts", async(req,res)=>{

    const posts = await Post.find().sort({
        createdAt:-1
    });

    res.json(posts);

});

// Create Post
app.post("/posts", async(req,res)=>{

    try{

        const post = new Post({

            username:req.body.username,

            content:req.body.content,

            image:req.body.image || "",

            likes:0

        });

        await post.save();

        res.json({

            message:"Post Created"

        });

    }catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});

// Delete Post
app.delete("/posts/:id", async(req,res)=>{

    try{

        await Post.findByIdAndDelete(req.params.id);

        await Comment.deleteMany({

            postId:req.params.id

        });

        res.json({

            message:"Post Deleted"

        });

    }catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});

// Edit Post
app.put("/posts/:id", async(req,res)=>{

    try{

        await Post.findByIdAndUpdate(

            req.params.id,

            {

                content:req.body.content

            }

        );

        res.json({

            message:"Post Updated"

        });

    }catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});

// Like
app.put("/posts/:id/like", async(req,res)=>{

    try{

        const post = await Post.findById(req.params.id);

        post.likes++;

        await post.save();

        res.json(post);

    }catch(err){

        res.status(500).json({

            message:err.message

        });

    }

});

// Search
app.get("/search/:text", async(req,res)=>{

    const keyword=req.params.text;

    const posts=await Post.find({

        username:{
            $regex:keyword,
            $options:"i"
        }

    });

    res.json(posts);

});

// ===================== COMMENTS =====================

// Add Comment

app.post("/comments", async(req,res)=>{

    const comment=new Comment(req.body);

    await comment.save();

    res.json({

        message:"Comment Added"

    });

});

// Get All Comments

app.get("/comments/:postId", async(req,res)=>{

    const comments=await Comment.find({

        postId:req.params.postId

    });

    res.json(comments);

});

// ===================== PROFILE =====================

// Dummy Profile

app.get("/profile/:username",async(req,res)=>{

    const posts=await Post.find({

        username:req.params.username

    });

    res.json(posts);

});

app.listen(5000,()=>{

    console.log("🚀 Server Running On Port 5000");

});
