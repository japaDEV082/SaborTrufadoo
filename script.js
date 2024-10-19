
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const carItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModaBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"

    updateCartModal();
} )

//Fechar o modal quando clicar fora

cartModal.addEventListener("click", function(event) {
if(event.target === cartModal) {
    cartModal.style.display = "none"
}
})

closeModaBtn.addEventListener("click", function() {
    cartModal.style.display ="none"
})

menu.addEventListener("click", function(event) {
let parentButton = event.target.closest(".add-to-cart-btn")
if(parentButton) {
    const name= parentButton.getAttribute("data-name")
    const price= parseFloat(parentButton.getAttribute("data-price"))
    addTocart(name,price)
}
})

// função para add no carrinho
function addTocart(name, price) {
const existingItem = cart.find(item => item.name === name )

if(existingItem) {
    existingItem.quantity += 1;
    } else {
        cart.push({

            name,
            price,
            quantity: 1,
            
            
            })
    }

updateCartModal()
}


//atualiza carrinho

function updateCartModal(){

    carItemsContainer.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
       
 cartItemElement.innerHTML =`
    <div class="flex items-center justify-between">
    
    <div> 
        <p class = "font-bold">${item.name}</p>
        <p>qtd:${item.quantity}</p>
        <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
        
    </div>
    
    <Button class="remove-from-cart-btn" data-name="${item.name}"> 
    remover
    </button>
    
    </div>        
        `


        total += item.price * item.quantity;

        carItemsContainer.appendChild(cartItemElement)
    })



    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency:"BRL"
    });


cartCounter.innerHTML = cart.length;


}


//remover item do carrinho

carItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name= event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item =cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }
}


addressInput.addEventListener("input", function(event){
let inputValue = event.target.value;

if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
}


})

// finalizar pedido

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestauranteOpen();
    if(!isOpen){
    
        Toastify({
            text: "Ops, estamos fechados!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or ``
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },

        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido para o wpp

const caritems = cart.map((item) => {
    return (
    ` ${item.name} Quantidade: (${item.quantity}) preço: R$${item.price}` 
    )
}).join("")

const message = encodeURIComponent(caritems)
const phone = "5581989380108"

window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")

cart = [];
updateCartModal();



})



//verificar a hora e manipular o card horário

function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 18;

// True = aberto


}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
} else {
        spanItem.classList.remove("bg-green-600")
        spanItem.classList.add("bg-red-500")
    }
