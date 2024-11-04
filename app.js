/* add your code here */

document.addEventListener("DOMContentLoaded", () => {
    // Parse the JSON data
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);
  
    function handleUserListClick(event, users, stocks) {
      if (event.target.tagName === "LI") {
        const userId = event.target.id;
        const user = users.find((user) => user.id == userId);
        populateForm(user);
        renderPortfolio(user, stocks);
      }
    }

    
    // Generate the user list
    generateUserList(userData, stocksData);

    // Register event listeners
    document.querySelector("#btnSave").addEventListener("click", handleSave);
    document.querySelector("#btnDelete").addEventListener("click", handleDelete);

    function generateUserList(users, stocks) {
        const userList = document.querySelector(".user-list");
        // Clear the list before rendering
        userList.innerHTML = ""; 
        users.map(({ user, id }) => {
        const listItem = document.createElement("li");
        listItem.innerText = `${user.lastname}, ${user.firstname}`;
        listItem.setAttribute("id", id);
        userList.appendChild(listItem);
        });

        // Register click event listener for the user list
        userList.addEventListener("click", (event) => {
        handleUserListClick(event, users, stocks);
        // Clear stock details when a new user is clicked
        clearStockDetails(); 
        });
    }

    function populateForm(user) {
        const { user: userInfo, id } = user;
        document.querySelector("#userID").value = id;
        document.querySelector("#firstname").value = userInfo.firstname;
        document.querySelector("#lastname").value = userInfo.lastname;
        document.querySelector("#address").value = userInfo.address;
        document.querySelector("#city").value = userInfo.city;
        document.querySelector("#email").value = userInfo.email;
    }

    function renderPortfolio(user, stocks) {
        const portfolio = user.portfolio;
        const portfolioDetails = document.querySelector(".portfolio-list");
         // Clear previous portfolio items
        portfolioDetails.innerHTML = "";

        portfolio.map(({ symbol, owned }) => {
        const symbolEl = document.createElement("p");
        const sharesEl = document.createElement("p");
        const actionEl = document.createElement("button");

        symbolEl.innerText = symbol;
        sharesEl.innerText = owned;
        actionEl.innerText = "View";
        actionEl.setAttribute("id", symbol);

        portfolioDetails.appendChild(symbolEl);
        portfolioDetails.appendChild(sharesEl);
        portfolioDetails.appendChild(actionEl);
        });

        // Register click event listener for portfolio items
        portfolioDetails.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") { 
            viewStock(event.target.id, stocks);
        }
        });
    }

    function viewStock(symbol, stocks) {
        const stockArea = document.querySelector('.stock-form');
        if(stockArea){
            const stock = stocks.find((s) => s.symbol == symbol);
            document.querySelector("#stockName").textContent = stock.name;
            document.querySelector("#stockSector").textContent = stock.sector;
            document.querySelector("#stockIndustry").textContent = stock.subIndustry;
            document.querySelector("#stockAddress").textContent = stock.address;
            // document.querySelector("#logo").textContent = `logos/${symbol}.svg`;
            
            const logoElement = document.querySelector("#logo");
            const logoSrc = `logos/${symbol}.svg`;

            // Check if the logo exists
            fetch(logoSrc, { method: "HEAD" })
            .then((response) => {
                if (response.ok) {
                logoElement.src = logoSrc;
                } else {
                // Clear the logo src if not found
                logoElement.src = ""; 
                }
            })
            .catch(() => {
                // Clear the logo src in case of error
                logoElement.src = ""; 
            }); 
        } 
    }

    function handleSave(event) {
        // Prevent form submission
        event.preventDefault(); 
        const button = event.target;
        const id = document.querySelector("#userID").value;
        const user = userData.find((user) => user.id == id);
        if (user) {
        user.user.firstname = document.querySelector("#firstname").value;
        user.user.lastname = document.querySelector("#lastname").value;
        user.user.address = document.querySelector("#address").value;
        user.user.city = document.querySelector("#city").value;
        user.user.email = document.querySelector("#email").value;
        generateUserList(userData, stocksData);
        }
    }

    function clearStockDetails() {
        document.querySelector("#stockName").textContent = "";
        document.querySelector("#stockSector").textContent = "";
        document.querySelector("#stockIndustry").textContent = "";
        document.querySelector("#stockAddress").textContent = "";
        document.querySelector("#logo").src = "";
    }

    function handleDelete(event) {
        // Prevent form submission
        event.preventDefault(); 
        const button = event.target;
        const id = document.querySelector("#userID").value;
        const userIndex = userData.findIndex((user) => user.id == id);
        if (userIndex > -1) {
        userData.splice(userIndex, 1);
        generateUserList(userData, stocksData);
        clearForm();
        clearPortfolio();
        clearStockDetails();
        }
    }

    function clearForm() {
        document.querySelector("#userID").value = "";
        document.querySelector("#firstname").value = "";
        document.querySelector("#lastname").value = "";
        document.querySelector("#address").value = "";
        document.querySelector("#city").value = "";
        document.querySelector("#email").value = "";
    }

    function clearPortfolio() {
        document.querySelector(".portfolio-list").innerHTML = "";
    }
});  