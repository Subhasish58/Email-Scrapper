let scrapeEmails = document.getElementById('scrapeEmails');
let list=document.getElementById('emailList');


//Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
     //get emails
     let emails = request.emails;

     //display emails on popup
     if(emails == null || emails.length == 0) {
        //no emails
        let li = document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li); //appends with emailList
     } else {
        //display results
        emails.forEach((email) =>{  //This loop iterates over each email address in the emails array
            let li=document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        });
     } 
});

//Button's click event Listener
scrapeEmails.addEventListener("click", async () => {

    //get current active in the current window
    //uses the chrome api chrome.tab.query
    let [tab] = await chrome.tabs.query({active:
         true, currentWindow: true});

    //execute script to parse emails
    chrome.scripting.executeScript({
        target: {tabId: tab.id}, //specifies tab where script to be executed
        func: scrapeEmailsFromPage, //specifies function to be executed
    });
})

//function to scrape emails
function scrapeEmailsFromPage() {
    //RegEx to parse emails from html code
    let emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    // Parse emails from the HTML of the page
    let emails = document.body.innerHTML.match(emailRegEx);

    //send emails to popup.it returns an array containing all the email addresses
    chrome.runtime.sendMessage({emails});
    
}



