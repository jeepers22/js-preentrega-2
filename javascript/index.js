// ARRAYS DE OBJETOS (Globales)

let usuarios = []
let productos = []

// VAR DOM ELEMENTS

let domLoginTitle
let domRegistroTitle
let domLoginForm
let domLoginUser
let domLoginPass
let domLoginBtn
let domBusqueda
let domTextoABuscar
let domBtnBusqueda
let domRegistroForm
let domRegistroUser
let domRegistroPass
let domRegistroBtn
let domSearch
let domSearchForm
let domSearchProduct
let domProductos

/* ================ CLASE USUARIOS ================ */

class Usuario {

    // ATRIBUTOS
    constructor(user, password, admin) {
        this.user = user
        this.password = password
        this.admin = admin // true=admin false=cliente
    }

    // MÉTODOS
    esAdmin = () => usuarios.find((usuario) => usuario.user === this.user).admin

    registrarUsuario = () => {
        usuarios.push(this)
    }
}

/* ================ CLASE PRODUCTO ================ */
class Producto {

    // ATRIBUTOS
    constructor(tipoProd, marca, precio, stock, imagen) {
        this.tipoProd = tipoProd
        this.marca = marca
        this.precio = precio
        this.stock = stock
        this.imagen = imagen
    }

    // MÉTODOS

    comprar = (cant) => {
        if (this.validarStock(cant)) {
            this.disminuirStock(cant)
            alert("Compra efectuada con éxito\nMuchas gracias!")
            console.log(`Stock actualizado - Quedan ${this.stock} unidades del producto ${this.tipoProd} ${this.marca}`)
        }
        else {
            alert(`Stock insuficiente - Hay ${this.stock} unidades de ${this.tipoProd} ${this.marca}`)
        }
    }

    validarStock = (cant) => this.stock >= cant

    disminuirStock = (cant) => {
        this.stock = this.stock - cant
    }

    registrarProducto = () => {
        productos.push(this)
    }
}

/* ================ ELEMENTOS DEL DOM ================ */

function domElementsInit() {
    domLoginTitle = document.getElementById("login-titulo")
    domRegistroTitle = document.getElementById("registro-titulo")
    domLoginForm = document.getElementById("login-form")
    domLoginUser = document.getElementById("login-user")
    domLoginPass = document.getElementById("login-pass")
    domTextoABuscar = document.getElementById("texto-a-buscar")
    domBtnBusqueda = document.getElementById("btn-busqueda")
    domRegistroForm = document.getElementById("registro-form")
    domRegistroUser = document.getElementById("registro-user")
    domRegistroPass = document.getElementById("registro-pass")
    domRegistroLoginBtn = document.getElementById("registro-btn")
    domSearch = document.getElementById("search-container")
    domSearchForm = document.getElementById("search-form")
    domSearchProduct = document.getElementById("search-product")
    domProductos = document.getElementById("productos-container")
}

/* ================ EVENTOS DEL DOM ================ */

function obtenerLoginPorDOM() {
    domLoginForm?.addEventListener("submit", gestionarLogin) // Al cambiar de HTML hay que verificar si el evento existe, sino da error
}

function obtenerSearchProductPorDOM() {
    domSearchForm?.addEventListener("submit",searchProduct) // Al cambiar de HTML hay que verificar si el evento existe, sino da error
}

function obtenerRegistroPorDOM() {
    domRegistroForm?.addEventListener("submit", gestionarAlta) // Al cambiar de HTML hay que verificar si el evento existe, sino da error
}

/* ================ DECLARACIÓN DE FUNCIONES ================ */

function gestionarLogin(event) {
    event.preventDefault()
    let objectUser = new Usuario(domLoginUser.value, domLoginPass.value, false)
    domLoginForm.reset();
    domLoginTitle.innerText = ""
    if (validarLogin(objectUser.user, objectUser.password)) {
        domLoginTitle.innerText += `Bienvenido ${objectUser.user}!`
        domSearch.hidden = false
        !objectUser.esAdmin() ? mostrarProductos(productos, "client") : mostrarProductos(productos,"admin")
    }
    else {
        alert("Login fallido - Usuario o contraseña incorrectos")
        domSearch.hidden = true
    }
}

validarLogin = (userLogin, passLogin) => usuarios.some((usuario) => (usuario.user === userLogin && usuario.password === passLogin))

function searchProduct(event) {
    event.preventDefault()
    let searchProd = domSearchProduct.value
    let listProducts = productos.filter((prod) => prod.tipoProd.toLowerCase().includes(searchProd.toLowerCase()))
    searchProd == "" ? alert("Debe ingresar un producto a buscar") : mostrarProductos(listProducts,"")
    domSearchForm.reset()
}

function gestionarAlta(event) {
    event.preventDefault()
    domRegistroTitle.innerHTML = ""
    let objectUser = new Usuario(domRegistroUser.value, domRegistroPass.value, false)
    domRegistroForm.reset();
    if (!usuarioExistente(objectUser.user)) {
        objectUser.registrarUsuario()
        domRegistroTitle.innerHTML += `El usuario ${objectUser.user} se ha registrado exitosamente!`
        console.log(usuarios)
    }
    else {
        domRegistroTitle.innerHTML += `Alta fallida - El usuario que intenta registrar ya existe`
    }
}

usuarioExistente = (userAlta) => usuarios.some((usuario) => usuario.user === userAlta)

productoExistente = (tipoProdAlta, marcaAlta) => productos.some((producto) => producto.tipoProd === tipoProdAlta && producto.marca === marcaAlta)

function mostrarProductos(listProducts, targetActions) {
    domProductos.innerHTML = ""  // Evita carga repetida de catálogo ante más de un despliegue de de compra
    listProducts.forEach((producto) => domProductos.innerHTML += `
    <div class="producto-card">
        <img src="${producto.imagen}" alt="textoPrueba" class="producto-img">
        <div class= "producto__info">
            <h3>Producto: ${producto.tipoProd} - ${producto.marca}</h3>
            <p>Precio: ${producto.precio} - Cantidad: ${producto.stock}</p>
            ${actionButtons(targetActions)}
        </div>
    </div>
    `)
}

function actionButtons (target) {

    // OBJETO ACCIONES
    const actions = {
        "admin": `<button id="modificar-prod" class="modificar-prod">Modificar</button>
                  <button id="eliminar-prod" class="eliminar-prod">Eliminar</button>`,
        "client": `<button id="agregar-carrito" class="agregar-carrito">Agregar al carrito</button>`,
        "": ""
    }
    return actions[target]
}

/* ================ DECLARACIÓN FUNCIÓN PRINCIPAL ================ */

function main() {

    // CARGA DE CATÁLOGO
    productos.push(new Producto("Paleta", "BlackCrown", 60000, 10, "./img/paleta-black.png"))
    productos.push(new Producto("Paleta", "ML10", 50000, 5, "./img/paleta-ml10.png"))
    productos.push(new Producto("Paleta", "Siux", 65000, 15, "./img/paleta-siux.png"))
    productos.push(new Producto("Paleta", "WingPro", 35000, 4, "./img/paleta-wing.png"))
    productos.push(new Producto("Bolso", "Adidas", 25000, 10, "./img/bolso-adidas.jpg"))
    productos.push(new Producto("Mochila", "Nike", 18000, 6, "./img/mochila-nike.jpg"))
    productos.push(new Producto("Muñequeras", "UnderArmour", 1000, 15, "./img/muniequera-under.jpg"))
    productos.push(new Producto("Tubo Pelotas", "Adidas", 2000, 8, "./img/pelotas-adidas.jpg"))
    productos.push(new Producto("Tubo Pelotas", "Prince", 1500, 4, "./img/pelotas-prince.jpg"))


    // GENERACIÓN DE USUARIOS
    usuarios.push(new Usuario("admin", "1234", true))
    usuarios.push(new Usuario("maxi", "maxizero", false))
    usuarios.push(new Usuario("a", "a", false))

    domElementsInit()
    obtenerLoginPorDOM()
    obtenerSearchProductPorDOM()
    obtenerRegistroPorDOM()
}

/* ================ LLAMADO FUNCIÓN PRINCIPAL ================ */

main()


