function addToCart() {
    const select = document.getElementById("bookSelect");
    const selectedValue = select.value.split("|");
    const name = selectedValue[0];
    const price = parseInt(selectedValue[1]);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart.`);
}

function buyItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartDiv = document.getElementById("cartItems");
    const totalDiv = document.getElementById("totalPrice");
    cartDiv.innerHTML = "<h3>Books Ordered:</h3>";

    let total = 0;
    cart.forEach(item => {
        cartDiv.innerHTML += `<p>${item.name} - ₱${item.price}</p>`;
        total += item.price;
    });

    totalDiv.innerHTML = `<h3>Total Price: ₱${total}</h3>`;

    localStorage.removeItem("cart");
}
