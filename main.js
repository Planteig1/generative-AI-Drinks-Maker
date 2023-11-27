// Contained Within Gather ApiKey Page
let apiKey;
const submitAPIKeyButton = document.querySelector("#input-api-button");
const inputAPIKeyField = document.querySelector("#input-api-key");

// Contained Within Gather Input For Drinks Page
const submitButton = document.querySelector("#generate-button");
const inputField = document.querySelector("#input-drinks");

// Loading Animation
const loaderAnimation = document.querySelector(".loader");

// Pages
const apiKeyPage = document.querySelector(".get-api-key");
const drinksPage = document.querySelector(".get-drink");

// Recipe guide
const recipeField = document.querySelector(".recipe");
let initialToggle = true

// Ingredients list
const ingredientsContainer = document.querySelector(".ingredients-container")
const ingredients = document.querySelectorAll(".ingredient")


// Get ApiKey
submitAPIKeyButton.addEventListener("click", async () => {
    loadingAnimation(submitAPIKeyButton)
    apiKey = inputAPIKeyField.value;
    if (apiKey && await isValidApiKey(apiKey)) {
        changeSite();
        loadingAnimation(submitAPIKeyButton)
    } else {
        window.alert("Please insert a valid Api-key");
        loadingAnimation(submitAPIKeyButton)
    }
});
// Validate ApiKey
async function isValidApiKey(apiKey) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'user',
                    content: 'Is this a valid API key?'
                }]
            })
        });
        // Check if the response status is not okay
        if (!response.ok) {
            return false;
        }
        // Parse the response
        const repsonseJSON = await response.json();

        // Check if the response contains an error
        if (repsonseJSON.error) {
            return false;
        }
        // If everything is okay, return true
        return true;
    } catch (error) {
        console.error('Error validating API key:', error);
        return false;
    }
}

// Toggle between sites
function changeSite () {
    apiKeyPage.classList.toggle("hidden")
    drinksPage.classList.toggle("hidden")
    ingredientsContainer.classList.toggle("hidden")

}

// Check if user selected some predefined ingredients

ingredients.forEach((ingredient) => {
    ingredient.addEventListener("click",() => {
        ingredient.classList.toggle("selected")
    })
})
// Add to the fetch
let arrayOfIngredients = [];
function ingredientsData () {
    //Clear the array
    arrayOfIngredients = []
    //Find the selected ingredients
    ingredients.forEach((ingredient) => {
        if (ingredient.classList.contains("selected")) {
            let currentIngredient = ingredient.querySelector("h2").innerText;
            arrayOfIngredients.push(currentIngredient)
        }
    })
}
// Remove the selected class from the ingredients
function removeSelectedClass () {
    ingredients.forEach((ingredient) => {
        ingredient.classList.remove("selected")
    })
}

// Generate Drink
submitButton.addEventListener("click",() => {
    ingredientsData()


    if (initialToggle === false) {
        showRecipeField()
    }

    // Animation and clear if there is already an item.
    recipeField.innerHTML = "";
    inputField.innerHTML = "";
    loadingAnimation(submitButton);

    let listOfIngredients = inputField.value + arrayOfIngredients.join(", ")


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
                content: `Please respond with a drink made out of ${listOfIngredients}. Also give it a funny and matching name. Please provide a detailed list of ingredients and a guide`
            }]
        })
    })
        .then(response => response.json())
        .then((data) => {
            loadingAnimation(submitButton)

            let pElement = document.createElement("p")
            pElement.innerText = data.choices[0].message.content
            recipeField.append(pElement)

            //
            initialToggle = false
            showRecipeField()

            removeSelectedClass()

        }).catch((error) => {
        console.log("There was an error trying to receive your drink. Please try again later.", error)
    })
})

function loadingAnimation (button) {
    loaderAnimation.classList.toggle("hidden")
    button.classList.toggle("hidden")
}

function showRecipeField () {
    recipeField.classList.toggle("hidden")
}

