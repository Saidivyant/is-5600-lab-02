/* Add your code here */

document.addEventListener("DOMContentLoaded", () => {
    // Parse the JSON data for stocks and users
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);
  
    // Handle clicks on user list items to display user portfolio and details
    function handleUserListClick(event, users, stocks) {
        if (event.target.tagName === "LI") {
            const userId = event.target.id;
            const user = users.find((user) => user.id == userId);
            populateForm(user); // Populate form with selected user's information
            renderPortfolio(user, stocks); // Render the selected user's portfolio
        }
    }

    // Generate the user list based on provided user data
    generateUserList(userData, stocksData);

    // Register event listeners for Save and Delete buttons
    document.querySelector("#btnSave").addEventListener("click", handleSave);
    document.querySelector("#btnDelete").addEventListener("click", handleDelete);

    // Function to generate and display the user list
    function generateUserList(users, stocks) {
        const userList = document.querySelector(".user-list");
        userList.innerHTML = ""; // Clear the list before rendering new items
        users.map(({ user, id }) => {
            const listItem = document.createElement("li");
            listItem.innerText = `${user.lastname}, ${user.firstname}`; // Display user name
            listItem.setAttribute("id", id);
            userList.appendChild(listItem);
        });

        // Register click event listener for user list items
        userList.addEventListener("click", (event) => {
            handleUserListClick(event, users, stocks);
            clearStockDetails(); // Clear stock details when a new user is clicked
        });
    }

    // Populate the form with the user's details
    function populateForm(user) {
        const { user: userInfo, id } = user;
        document.querySelector("#userID").value = id;
        document.querySelector("#firstname").value = userInfo.firstname;
        document.querySelector("#lastname").value = userInfo.lastname;
        document.querySelector("#address").value = userInfo.address;
        document.querySelector("#city").value = userInfo.city;
        document.querySelector("#email").value = userInfo.email;
    }

    // Render the user's portfolio, displaying each stock they own
    function renderPortfolio(user, stocks) {
        const portfolio = user.portfolio;
        const portfolioDetails = document.querySelector(".portfolio-list");
        portfolioDetails.innerHTML = ""; // Clear previous portfolio items

        portfolio.map(({ symbol, owned }) => {
            const symbolEl = document.createElement("p");
            const sharesEl = document.createElement("p");
            const actionEl = document.createElement("button");

            symbolEl.innerText = symbol; // Display stock symbol
            sharesEl.innerText = owned; // Display number of shares owned
            actionEl.innerText = "View"; // Button to view stock details
            actionEl.setAttribute("id", symbol);

            portfolioDetails.appendChild(symbolEl);
            portfolioDetails.appendChild(sharesEl);
            portfolioDetails.appendChild(actionEl);
        });

        // Register click event listener for portfolio items
        portfolioDetails.addEventListener("click", (event) => {
            if (event.target.tagName === "BUTTON") {
                viewStock(event.target.id, stocks); // Show stock details on button click
            }
        });
    }

    // View detailed information for a specific stock
    function viewStock(symbol, stocks) {
        const stockArea = document.querySelector('.stock-form');
        if(stockArea){
            const stock = stocks.find((s) => s.symbol == symbol);
            document.querySelector("#stockName").textContent = stock.name;
            document.querySelector("#stockSector").textContent = stock.sector;
            document.querySelector("#stockIndustry").textContent = stock.subIndustry;
            document.querySelector("#stockAddress").textContent = stock.address;

            const logoElement = document.querySelector("#logo");
            const logoSrc = `logos/${symbol}.svg`;

            // Check if the logo exists before displaying it
            fetch(logoSrc, { method: "HEAD" })
            .then((response) => {
                if (response.ok) {
                    logoElement.src = logoSrc; // Set logo if found
                } else {
                    logoElement.src = ""; // Clear logo if not found
                }
            })
            .catch(() => {
                logoElement.src = ""; // Clear logo in case of error
            }); 
        } 
    }

    // Save the modified user details
    function handleSave(event) {
        event.preventDefault(); // Prevent form submission
        const id = document.querySelector("#userID").value;
        const user = userData.find((user) => user.id == id);
        if (user) {
            user.user.firstname = document.querySelector("#firstname").value;
            user.user.lastname = document.querySelector("#lastname").value;
            user.user.address = document.querySelector("#address").value;
            user.user.city = document.querySelector("#city").value;
            user.user.email = document.querySelector("#email").value;
            generateUserList(userData, stocksData); // Update user list after saving
        }
    }

    // Clear the stock details display section
    function clearStockDetails() {
        document.querySelector("#stockName").textContent = "";
        document.querySelector("#stockSector").textContent = "";
        document.querySelector("#stockIndustry").textContent = "";
        document.querySelector("#stockAddress").textContent = "";
        document.querySelector("#logo").src = ""; // Remove stock logo
    }

    // Handle deleting a user from the list
    function handleDelete(event) {
        event.preventDefault(); // Prevent form submission
        const id = document.querySelector("#userID").value;
        const userIndex = userData.findIndex((user) => user.id == id);
        if (userIndex > -1) {
            userData.splice(userIndex, 1); // Remove user from user data
            generateUserList(userData, stocksData); // Refresh the user list
            clearForm(); // Clear form fields
            clearPortfolio(); // Clear portfolio display
            clearStockDetails(); // Clear stock details
        }
    }

    // Clear all form fields
    function clearForm() {
        document.querySelector("#userID").value = "";
        document.querySelector("#firstname").value = "";
        document.querySelector("#lastname").value = "";
        document.querySelector("#address").value = "";
        document.querySelector("#city").value = "";
        document.querySelector("#email").value = "";
    }

    // Clear the portfolio list display
    function clearPortfolio() {
        document.querySelector(".portfolio-list").innerHTML = "";
    }
});
