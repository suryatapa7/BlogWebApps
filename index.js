import express from 'express';
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

//define paths to view the files
const __dirname = dirname(fileURLToPath(import.meta.url));
const aboutPath = join(__dirname, "views/index.ejs");//C:\Users\surya\OneDrive\Desktop\web-dev udemy\Blog Web Application
const indexPath = join(__dirname, "views/about.ejs");
const homePath = join(__dirname, "views/diaryList.ejs");
const blogDetailsPath = join(__dirname, "views/storyList.ejs");


const app = express();
const port = process.env.port || 5000

// The 'view engine' is the template engine that we will use to render dynamic templates. In this case, we are using EJS (Embedded JavaScript) as our template engine. EJS allows us to write JavaScript code directly in the templates, which gets executed when the template is rendered. The templates are stored in the 'views' folder. The rendered HTML is then sent as a response to the client.
app.set('view engine', 'ejs');
// Configure Express middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// Initialize blog list
let blogList = [];

// Render index page
app.get("/", (req, res) => {
  res.render(aboutPath);
});

// Render home page with blog list
app.get("/home", (req, res) => {
  res.render(indexPath, {
    blogList: blogList,
  });
});


//to view all posts
app.get("/view",(req,res)=> {
  res.render(homePath, {
    blogList: blogList,
  });
})


// Add new blog
app.post("/about", (req, res) => {
  const blogTitle = req.body.blogTitle;
  const blogDescription = req.body.blogDes;
  blogList.push({
    id: generateID(),
    title: blogTitle,
    description: blogDescription,
  });
  res.render(indexPath, {
    blogList: blogList,
  });
});

// Delete a blog
app.post("/delete/:id", (req, res) => {
  const blogId = req.params.id;
  blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
  res.send(
    '<script>alert("Blog deleted successfully"); window.location="/home";</script>'
  );
  res.redirect("/home");
});


// Render blog details page
app.get("/blogDetails/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  res.render(blogDetailsPath, {
    blogDetails: blogDetails,
  });
});



// Render edit blog page
app.get("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
  res.render("editBlog", { // new template for editing a blog
    blogDetails: blogDetails,
  });
});

// Update blog
app.post("/update/:id", (req, res) => {
  const blogId = req.params.id;
  const updatedBlog = blogList.find((blog) => blog.id === parseInt(blogId));
  updatedBlog.title = req.body.title;
  updatedBlog.description = req.body.description;
  res.redirect("/home");
});


// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Function to generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000);
}