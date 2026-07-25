import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://freshcart-3ce3a-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")

const lisTs = document.querySelector('.lists')

const num = document.querySelector('#num')

let chipsArr = [
    {
        name: "bread"
    },
    {
        name: "Chocolate"
    },
    {
        name: "Ice Cream"
    },
    {
        name: "Coffee"
    },
    {
        name: "Amul-Gold"
    },
]

let chips = document.querySelector(".chips")
let chip = document.querySelector(".chip")
let ui = () => {


    chipsArr.forEach((item, index) => {
        chips.innerHTML += `
   <div class="chip" data-name="${item.name}">
     <span>${item.name}</span>
    </div>
    `


        document.querySelectorAll(".chip").forEach(chip => {
            chip.addEventListener("click", () => {
                inputFieldEl.value = chip.dataset.name;
                inputFieldEl.focus();
            });
        });



    })
}
ui()

document.addEventListener("pointerdown", (e) => {

    const el = e.target.closest("button,.chip,.delete-btn,.circle,.item");
    if (!el) return;

    el.classList.add("pressed");

    setTimeout(() => {
        el.classList.remove("pressed");
    }, 120);

});

function appendItemToShoppingListEl(item , id) {

    lisTs.innerHTML += `
        <div class="item ${item.completed ? "done" : ""}" data-id="${id}">

            <div class="left">
                <div class="circle ${item.completed ? "checked" : ""}">
                    <i class="ri-check-line"></i>
                </div>

                <div class="details">
                    <h3>${item.name}</h3>
                </div>
            </div>

            <div class="right">
                <span>${item.quantity}X</span>
                <i class="ri-delete-bin-line delete-btn" data-id="${id}"></i>
            </div>

        </div>
    `;
}


addButtonEl.addEventListener("click", function () {

    let inputValue = inputFieldEl.value.trim()
    let numValue = num.value




    if (inputValue === "" || numValue === "") return

    push(shoppingListInDB, {
        name: inputValue,
        quantity: numValue,
         completed: false
    })


    inputFieldEl.value = "";
    num.value = "";
})



onValue(shoppingListInDB, (snapshot) => {

    lisTs.innerHTML = "";

    // If the database is empty
    if (!snapshot.exists()) {
        return;
    }

    const itemsArray = Object.entries(snapshot.val());

    itemsArray.forEach(([currentItemID, currentItemValue]) => {
        appendItemToShoppingListEl(currentItemValue, currentItemID);
    });

});
lisTs.addEventListener("click", (e) => {


    if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;

        const itemRef = ref(database, `shoppingList/${id}`);

        remove(itemRef)
    }

});

lisTs.addEventListener("click", (e) => {

    // Ignore delete icon
    if (e.target.classList.contains("delete-btn")) return;

    const item = e.target.closest(".item");
    if (!item) return;

    const id = item.dataset.id;

    const current = item.classList.contains("done");

    update(ref(database, `shoppingList/${id}`), {
        completed: !current
    });

});

