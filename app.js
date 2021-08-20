const express = require("express");
const monkeyClient = require("@mailchimp/mailchimp_marketing");
const bodyParser = require("body-parser");
//ota express käyttöön
const app = express();

// //for public static files
 app.use(express.static("public"));

// //ota bodyparser käyttöön
 app.use(bodyParser.urlencoded({extended:true}));


//  GET. GET is used to retrieve and request data from a specified resource in a server. 
//  GET is one of the most popular HTTP request techniques. 
//  In simple words, the GET method is used to retrieve whatever information is identified by the Request-URL. 
// //lähetä html, render files to the server
 app.get("/", (req,res)=>{
     res.sendFile(__dirname+"/index.html");
 })

 //send apikey and server to fetch/post data
monkeyClient.setConfig({
    apiKey: "1db7bf06c1c0d1780c85379d9ff7bbeb-us5",
    server: "us5",
  });
  

//   POST is an HTTP method designed to send data to the server from an HTTP client.
//   The HTTP POST method requests the web server accept the data enclosed in the body of the POST message.
//   HTTP POST method is often used when submitting login or contact forms or uploading files and images to the server.
  //get post data from html, when subscribe button is pressed
app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName, lastName, email);
  
   //change them to json data 
const subscriber = {
      firstName: firstName,
      lastName: lastName,
      email: email
    }

    // A Promise is a proxy for a value not necessarily known when the promise is created.
    //  It allows you to associate handlers with an asynchronous action's eventual success value or failure reason.
    //  This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value,
    //   the asynchronous method returns a promise to supply the value at some point in the future.
    //run async function and add subscriber to the list
   
    // JavaScript try and catch
    // The try statement allows you to define a block of code to be tested for errors while it is being executed.
    //  The catch statement allows you to define a block of code to be executed, if an error occurs in the try block.
     //check with try and catch to get errors  and if response doesnt fail send success.
    const run = async () => {
        try {
            const response = await monkeyClient.lists.addListMember("998b1486f6", {
                email_address: subscriber.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscriber.firstName,
                    LNAME: subscriber.lastName
                }
              });
              res.sendFile(__dirname+"/success.html");
              console.log(response);
        } catch (error) {
            res.sendFile(__dirname+"/failure.html");  
            console.log(error);
        }         
      };
      run();
  });
//if post request fails user can try again  with res.redirect
app.post("/failure", (req, res) =>{
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, ()=>{console.log("im running on 3000")})