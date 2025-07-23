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

document.getElementById("foodName").addEventListener("input", (e) => {
  const food = e.target.value.toLowerCase().trim();
  
  if (ShelfLife[food]) {
    const days = ShelfLife[food];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    
    document.getElementById("expiryDate").value = expiry.toISOString().split("T")[0];
    document.getElementById("aiSuggestion").innerText = `Suggested expiry: ${days} days`;
  } else {
    document.getElementById("expiryDate").value = "";
    document.getElementById("aiSuggestion").innerText = "";
  }
});
let items = JSON.parse(localStorage.getItem("items")) || [];

function addItem() {
  const name = document.getElementById("foodName").value.trim();
  const expiry = document.getElementById("expiryDate").value;

  if (!name || !expiry) return alert("Enter both food name and expiry");

  items.push({ name, expiry });
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
  document.getElementById("foodName").value = "";
}

function getDaysLeft(expiry) {
  const today = new Date();
  const exp = new Date(expiry);
  return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
}
function renderItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  items.forEach((item, index) => {
    const daysLeft = getDaysLeft(item.expiry);
    let color = daysLeft > 3 ? "green" : daysLeft > 1 ? "orange" : "red";

    list.innerHTML += `
      <div style="border-left: 5px solid ${color}; padding: 10px; margin-bottom: 10px;">
        <b>${item.name}</b> – ${item.expiry} (${daysLeft} days left)
        ${daysLeft <= 1 ? `<button onclick="showMap()">Donate</button>` : ""}
        <button onclick="deleteItem(${index})">❌</button>
      </div>`;
  });
}
function deleteItem(index) {
  items.splice(index, 1);
  localStorage.setItem("items", JSON.stringify(items));
  renderItems();
}
function showMap() {
  const city = document.getElementById("location").value.trim();
  if (city) {
    const url = `https://www.google.com/maps?q=food+donation+centers+in+${encodeURIComponent(city)}&output=embed`;
    document.getElementById("mapFrame").src = url;
    document.getElementById("mapBox").scrollIntoView({ behavior: "smooth" });
  }
}

window.onload = renderItems;
