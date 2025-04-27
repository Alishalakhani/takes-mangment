
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup ,onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAIn6meJASUWeoBLYQ63alzsxqQRKxG38I",
    authDomain: "auth-93543.firebaseapp.com",
    projectId: "auth-93543",
    storageBucket: "auth-93543.firebasestorage.app",
    messagingSenderId: "747460557876",
    appId: "1:747460557876:web:abd5b53a3892e3a11dde61",
    measurementId: "G-SBC56V5T8N"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

const auth=getAuth(app);
const provider=new GoogleAuthProvider();
document.getElementById("signup-btn")?.addEventListener('click',(e)=>{
e.preventDefault();
let email=document.getElementById("signup-email").value;
let password=document.getElementById("signup-password" ).value;
createUserWithEmailAndPassword(auth, email, password)   
    .then(() => {    
  alert("Sign Up Successful!"); 
window.location.href = "addtask.html";   
})  
.catch((error) => {     
  alert(error.message);   
}) 
});  
//login with email and password
document.getElementById("login-btn")?.addEventListener("click", (e) => {  
  e.preventDefault();
   const email = document.getElementById("login-email").value;  
    const password = document.getElementById("login-password").value;   
     signInWithEmailAndPassword(auth, email, password)    
      .then(() => {   
  alert("Login Successful!");  
   window.location.href = "addtask.html";    
   })    
    .catch((error) => {    
         alert(error.message);     
      }); 
  }); 
//continue with google//
document.getElementById("google-btn")?.addEventListener("click", (e) => { 
  e.preventDefault();
signInWithPopup(auth, provider)  
  .then(() => {     
alert("Login Successful!");   
window.location.href = "addtask.html"; 
  })     
.catch((error) => {      
alert(error.message); 
 }); 
}); 

//logout//
document.getElementById("logout-btn")?.addEventListener("click", () => { 
    signOut(auth)    
     .then(() => {      
       alert("Logged Out Successfully!"); 
     window.location.href = "addtask.html";    
   })     
   .catch((error) => {   
  alert(error.message);   
});
}); 

// Show User Email on Welcome Page 
onAuthStateChanged(auth, (user) => { 
if (user && window.location.pathname.includes("addtask.html"))
{    
document.getElementById("user-email").textContent = user.email; 
}
else if (!user && window.location.pathname.includes("addtask.html"))
 {    
   
  window.location.href = "addtask.html"; 
} 
});