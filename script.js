let posts = [];

// Load Posts
async function fetchPosts() {

    try {

        const response = await fetch("/posts");

        posts = await response.json();

        displayPosts(posts);

    } catch (error) {

        console.log(error);

    }

}

// Display Posts
async function displayPosts(postList) {

    const postsContainer = document.getElementById("posts");

    postsContainer.innerHTML = "";

    const reversedPosts = [...postList].reverse();

    for (const post of reversedPosts) {

        const response = await fetch(`/comments/${post._id}`);

        const comments = await response.json();

        let commentHTML = "";

        comments.forEach(c => {

            commentHTML += `

                <p><b>${c.username}</b> : ${c.comment}</p>

            `;

        });

        postsContainer.innerHTML += `

        <div class="post-card">

            <h3>${post.username}</h3>

            <p>${post.content}</p>

            <button onclick="likePost('${post._id}')">

                👍 Like (<span id="like-${post._id}">${post.likes}</span>)

            </button>

            <br><br>

            <div>

                ${commentHTML}

            </div>

            <input
                class="comment-box"
                id="comment-${post._id}"
                placeholder="Write a comment">

            <button onclick="addComment('${post._id}')">

                Comment

            </button>

        </div>

        `;

    }

}
// Create Post
async function createPost() {

    const username =
    document.getElementById("username").value;

    const content =
    document.getElementById("content").value;

    if(username==="" || content===""){

        alert("Fill all fields");

        return;

    }

    const response = await fetch("/posts",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username,
            content

        })

    });

    const data = await response.json();

    alert(data.message);

    document.getElementById("username").value="";

    document.getElementById("content").value="";

    fetchPosts();

}

// Like Button
async function likePost(id){

    const response = await fetch(`/posts/${id}/like`,{

        method:"PUT"

    });

    const updatedPost = await response.json();

    document.getElementById(
        `like-${id}`
    ).innerText = updatedPost.likes;

}

// Add Comment
async function addComment(id){

    const comment =
    document.getElementById(
        `comment-${id}`
    ).value;

    if(comment===""){

        alert("Enter comment");

        return;

    }

    await fetch("/comments",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            postId:id,

            username:"Anonymous",

            comment

        })

    });

    alert("Comment Added");

    document.getElementById(
        `comment-${id}`
    ).value="";

fetchPosts();

}

// Load
fetchPosts();

function logoutUser(){

    alert("Logged Out Successfully");

    window.location.href="login.html";

}
function toggleDarkMode(){

    document.body.classList.toggle("dark");

}