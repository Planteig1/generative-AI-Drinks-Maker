let apiKey = prompt("api-key");
const submitButton = document.querySelector("#generate-button")
const inputField = document.querySelector("#input-drinks")
const recipeField = document.querySelector(".recipe")
const loaderAnimation = document.querySelector(".loader")

submitButton.addEventListener("click",() => {
    // Animation and clear if there is already an item.
    recipeField.innerHTML = "";
    inputField.innerHTML = "";
    loading()

    let listOfIngredients = inputField.value

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: `Please respond with a drink made out of ${listOfIngredients}. Also give it a funny and matching name. Please provide a detailed list of ingredients and a guide `
            }]
        })
    })
        .then(response => response.json())
        .then((data) => {
            loading()
            let pElement = document.createElement("p")
            pElement.innerText = data.choices[0].message.content
            recipeField.append(pElement)
            console.log(data.choices[0].message.content)
        })
})

function loading () {
    loaderAnimation.classList.toggle("hidden")
    submitButton.classList.toggle("hidden")
}

