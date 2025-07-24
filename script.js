const ShelfLife = {
  "apple": 14,
  "banana": 7,
  "carrot": 30,
  "dairy": 7,
  "egg": 21,
  "fish": 2,
  "meat": 5,
  "bread": 5
};

document.addEventListener("DOMContentLoaded", () => {
  // Only attach event listener if the foodName input exists
  const foodInput = document.getElementById("foodName");
  const expiryInput = document.getElementById("expiryDate");
  const suggestionBox = document.getElementById("aiSuggestion");

  if (foodInput && expiryInput && suggestionBox) {
    foodInput.addEventListener("input", (e) => {
      const food = e.target.value.toLowerCase().trim();
    
      if (ShelfLife[food]) {
        const days = ShelfLife[food];
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + days);
    
        expiryInput.value = expiry.toISOString().split("T")[0];
        suggestionBox.innerText = `Suggested expiry: ${days} days`;
      } else {
        expiryInput.value = "";
        suggestionBox.innerText = "";
      }
    });
  }

  // If this page has item list, render items
  if (document.getElementById("itemList")) {
    renderItems();
  }
});

function addItem() {
  const name = document.getElementById("foodName").value.trim();
  const expiry = document.getElementById("expiryDate").value;

  if (!name || !expiry) return alert("Enter both food name and expiry");

  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.push({ name, expiry });
  localStorage.setItem("items", JSON.stringify(items));

  document.getElementById("foodName").value = "";
  document.getElementById("expiryDate").value = "";
  document.getElementById("aiSuggestion").innerText = "";

  if (document.getElementById("itemList")) {
    renderItems();
  }
}

function getDaysLeft(expiry) {
  const today = new Date();
  const exp = new Date(expiry);
  return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
}

function renderItems() {
  const list = document.getElementById("itemList");
  const items = JSON.parse(localStorage.getItem("items")) || [];
  list.innerHTML = "";

  items.forEach((item, index) => {
    const daysLeft = getDaysLeft(item.expiry);
    const color = daysLeft > 3 ? "green" : daysLeft > 1 ? "orange" : "red";

    list.innerHTML += `
      <div style="border-left: 5px solid ${color}; padding: 10px; margin-bottom: 10px;">
        <b>${item.name}</b> – ${item.expiry} (${daysLeft} days left)
        ${daysLeft <= 1 ? `<button onclick="showMap()">Donate</button>` : ""}
        <button onclick="deleteItem(${index})">Delete</button>
      </div>`;
  });

  console.log("Rendering items...");
  console.log(localStorage.getItem("items"));
}

function deleteItem(index) {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.splice(index, 1);
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
}

function showMap() {
  const locationInput = document.getElementById("location");
  const mapFrame = document.getElementById("mapFrame");
  const mapBox = document.getElementById("mapBox");

  if (locationInput && mapFrame && mapBox) {
    const city = locationInput.value.trim();
    if (city) {
      const url = `https://www.google.com/maps?q=food+donation+centers+in+${encodeURIComponent(city)}&output=embed`;
      mapFrame.src = url;
      mapBox.scrollIntoView({ behavior: "smooth" });
    }
  }
}
