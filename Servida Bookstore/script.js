let cart = JSON.parse(localStorage.getItem('cart')) || [];

const bookInfo = {
  "the-last-wish": {
    title: "The Last Wish",
    price: 550,
    image: "img/books/the-last-wish.jpg",
    synopsis: "A collection of short stories introducing Geralt of Rivia and the world of The Witcher. Start here!"
  },
  "sword-of-destiny": {
    title: "Sword of Destiny",
    price: 580,
    image: "img/books/sword-of-destiny.jpg",
    synopsis: "The second short story collection, showing the origins of Geralt's bond with Ciri and his moral dilemmas."
  },
  "blood-of-elves": {
    title: "Blood of Elves",
    price: 600,
    image: "img/books/blood-of-elves.jpg",
    synopsis: "Geralt becomes Ciri’s protector as war looms and dark forces seek her powerful bloodline."
  },
  "time-of-contempt": {
    title: "Time of Contempt",
    price: 620,
    image: "img/books/time-of-contempt.jpg",
    synopsis: "The world descends into chaos as alliances collapse and Ciri is forced to flee for her life."
  },
  "baptism-of-fire": {
    title: "Baptism of Fire",
    price: 630,
    image: "img/books/baptism-of-fire.jpg",
    synopsis: "Geralt sets off to rescue Ciri, assembling unlikely allies in a war-torn world."
  },
  "tower-of-the-swallow": {
    title: "The Tower of the Swallow",
    price: 650,
    image: "img/books/tower-of-the-swallow.jpg",
    synopsis: "Ciri must face assassins, bounty hunters, and fate as she journeys toward her destiny."
  },
  "lady-of-the-lake": {
    title: "The Lady of the Lake",
    price: 700,
    image: "img/books/lady-of-the-lake.jpg",
    synopsis: "The stunning conclusion of The Witcher saga. Worlds collide, fates are sealed, and legends are born."
  },
  "season-of-storms": {
    title: "Season of Storms",
    price: 580,
    image: "img/books/season-of-storms.jpg",
    synopsis: "A standalone tale set before the main series. Geralt faces corruption and ancient monsters."
  }
};

function updateBookDetails() {
  const selectedKey = document.getElementById("book").value;
  const details = bookInfo[selectedKey];

  const image = document.getElementById("bookImage");
  const synopsis = document.getElementById("bookSynopsis");

  if (details) {
    image.src = details.image;
    image.style.display = "block";
    image.alt = details.title;
    synopsis.innerText = details.synopsis;

  } else {
    image.style.display = "none";
    synopsis.textContent = "";
  }
}

function addToCart() {
  const selectedKey = document.getElementById('book').value;
  const book = bookInfo[selectedKey];

  if (!book) {
    alert("Please select a book first.");
    return;
  }

  cart.push({ title: book.title, price: book.price });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${book.title} added to cart!`);
}

function displayCart() {
  const cartList = document.getElementById('cartList');
  const totalOutput = document.getElementById('totalOutput');
  if (!cartList || !totalOutput) return;

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.title} - ₱${item.price}`;
    cartList.appendChild(li);
    total += item.price;
  });

  totalOutput.textContent = `Total Price: ₱${total}`;
}

function finalizeOrder() {
  alert(`You ordered ${cart.length} book(s). Total: ₱${cart.reduce((t, b) => t + b.price, 0)}`);
  localStorage.removeItem('cart');
  location.reload();
}

window.onload = displayCart;
