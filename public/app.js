// declare HTML elements
// inputfield
const inputText = document.getElementById("sendmessage");

// chatbox
const chatbox = document.getElementById("messages")

// typing indicator

const typing = document.getElementById("typing")

const sendButton = document.getElementById("sendButton")

window.addEventListener("keydown", enterPress, false);

function enterPress(evt) {
    if (evt.keyCode == 13) {
        sendMessage()
        inputText.value = "";
    }
}


// functie bij het klikken op send
function sendMessage() {

        let message = inputText.value
    // bij het klikken op de verzendbutton moet er gecheckt worden of inputveld een waarde heeft
        if(!message) {
            console.log("No message typed!")
        } else {
            // maak een blokje met een icoon van een gebruiker en een bericht met kleur dat specifiek is voor de gebruiker 
            const messageBlock = `
            <div class="usermessageblock my-3">
                    <i class="fas fa-user fs-3 mx-3"></i>
                    <span class="bg-primary fs-3 rounded-pill p-2">${inputText.value}</span>
                </div>
            `
             // zorgt dit in dit blokje  jouw invoertekst bevat en voeg dit blokje via INNERHTML in de berichtencontainer
            chatbox.innerHTML += messageBlock;
            // roep een functie op die op basis van jouw bericht een output geeft van de chatbot. answer = botAnswer(bericht)

             // ga het bericht omzetten naar ENKEL kleine letters

             message = message.toLowerCase()

            botAnswer(message);
        }
}
    


async function botAnswer(message) {
    try {
        // fetch alle data out answers http://localhost:3000/answers
        const response = await fetch("http://localhost:3000/answers");
        const data = await response.json();

        console.log(data)
        // we hebben nu alle mogelijke keywords met bijhorende antwoorden

        let answer
         // dan gaan we een loop doen op onze array om te checken of ons keyword voorkomt
        for (let i = 0; i < data.length; i++) {
             // ALS includes van bericht currentObject.keyword bevat = TRUE dan RETURN currentObject.value
            if(message.includes(data[i].keyword)) {
                answer = data[i].answer
            }
        }

           // we returnen enkel de answer van het object waar het keyword overeenkomt met een deel bericht
           // bij geen overeenkomst snapt de chatbot niet waar je het over hebt
        if(!answer) {
            setTimeout(function(){
                console.log(answer + "test")
                isTyping() 
                typing.innerHTML = ""
                const messageBlock = `
                <div class="usermessageblock my-3">
                        <i class="fas fa-robot fs-3 mx-3"></i>
                        <span class="bg-warning fs-3 rounded-pill p-2">Ik snap niet wat je bedoelt...</span>
                    </div>
                `
                chatbox.innerHTML += messageBlock; }, 1000);
                scroller();
        } else if (answer == "timeFunc") {
            isTyping()
            typing.innerHTML = ""
            currentTime = new Date();
            let hours = currentTime.getHours();
            let minutes = (currentTime.getMinutes()<10?'0':'') + currentTime.getMinutes()
            setTimeout(function(){ 
                const messageBlock = `
            <div class="usermessageblock my-3">
                    <i class="fas fa-robot fs-3 mx-3"></i>
                    <span class="bg-warning fs-3 rounded-pill p-2">Het is momenteel ${hours}u${minutes}.</span>
                </div>
            `
            chatbox.innerHTML += messageBlock;
            scroller();
             }, 1000);
        } 
        else {
            isTyping()
            setTimeout(function(){ 
                const messageBlock = `
            <div class="usermessageblock my-3">
                    <i class="fas fa-robot fs-3 mx-3"></i>
                    <span class="bg-warning fs-3 rounded-pill p-2">${answer}</span>
                </div>
            `
            chatbox.innerHTML += messageBlock;
            scroller();
             }, 1000);
        }
    } catch(error) {
        console.log(error)
    }    
}


function isTyping() {
    setTimeout(function(){
         typing.innerHTML = `<b>is typing .</b>`
         setTimeout(function(){
            typing.innerHTML += `<b>.</b>` 
            setTimeout(function(){
                typing.innerHTML += `<b>.</b>` 
                setTimeout(function(){ 
                    typing.innerHTML = ""
            }, 100);
               }, 300);
           }, 300);
        }, 300);
        

}

function scroller() {
    const boxScroll = document.getElementById("messagebox")
            boxScroll.scrollTo(0,boxScroll.scrollHeight);
}
