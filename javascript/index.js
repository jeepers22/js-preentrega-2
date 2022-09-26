// ARRAYS DE OBJETOS (Globales)

let usuarios = []
let productos = []
let carrito = []

// VAR DOM ELEMENTS

let domNavContainer
let domRegistroTitle
let domLogin
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
let domCloseSession
let domCarrito
let domTotalCompra
let totalCompra = 0
let domBtnFinCompra

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
    constructor(id, tipoProd, marca, precio, stock, imagen) {
        this.id = id
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

    altaCatalogo = () => {
        productos.push(this)
    }
}

/* ================ ELEMENTOS DEL DOM ================ */

function domElementsInit() {
    domNavContainer = document.getElementById("nav-container")
    domRegistroTitle = document.getElementById("registro-titulo")
    domLogin = document.getElementById("login-container")
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
    domCarrito = document.getElementById("carrito-container")
    domBtnFinCompra = document.getElementById("btn-fin-compra")
    domTotalCompra = document.getElementById("carrito-total")
    domCloseSession = document.getElementById("close-session")
}

/* ================ EVENTOS DEL DOM ================ */


function eventoLogin() {
    domLoginForm?.addEventListener("submit", gestionarLogin) // Al cambiar de HTML hay que verificar si el evento existe, sino da error
}


function eventoSearch() {
    domSearchForm?.addEventListener("submit", searchProduct)
}

function eventoTotalCompra() {
    domBtnFinCompra?.addEventListener("click", calcularTotalCompra)
}

function eventoRegistroUsuario() {
    domRegistroForm?.addEventListener("submit", gestionarAlta)
}

function eventoCloseSession() {
    domCloseSession?.addEventListener("click", cerrarSesion)
}

/* ================ DECLARACIÓN DE FUNCIONES ================ */

function gestionarLogin(event) {
    event.preventDefault()
    let objectUser = new Usuario(domLoginUser.value, domLoginPass.value, false)
    domLoginForm.reset();
    if (validarLogin(objectUser.user, objectUser.password)) {
        domLogin.hidden = true
        domNavContainer.hidden = false
        domCloseSession.innerText += `${objectUser.user} (Salir)`
        domSearch.hidden = false
        storageACarrito()
        !objectUser.esAdmin() ? mostrarProductos(productos, "client") : mostrarProductos(productos,"admin")
    }
    else {
        alert("Login fallido - Usuario o contraseña incorrectos")
        domSearch.hidden = true
        domNavContainer.hidden = true
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
    listProducts.forEach((producto) => {
        let domCard = document.createElement("div")
        domCard.className = "producto-card"
        domCard.id = "producto-card-${producto.id}"
        domCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.tipoProd}" class="producto-img">
            <div class="producto__info">
                <h3>Producto: ${producto.tipoProd} - ${producto.marca}</h3>
                <p>Precio: ${producto.precio} - Disponibles: ${producto.stock}</p>
            </div>
            <div class="producto__compra">
                ${actionButtons(targetActions, producto.id)}
            </div>
            `
        domProductos.append(domCard)

        let domBtnAltaCarrito = document.getElementById(`agregar-carrito-${producto.id}`)
        let domCantAComprar = document.getElementById(`cant-carrito-${producto.id}`)
        domBtnAltaCarrito?.addEventListener("click", () => {
            enviarACarrito(producto.id, domCantAComprar.value)
            domCantAComprar.value = ""
        })
    })
}

function actionButtons (target, idProd) {
    const actions = {
        "admin": `<button id="modificar-prod-${idProd}" class="btn modificar-prod">Modificar</button>
                  <button id="eliminar-prod-${idProd}" class="btn eliminar-prod">Eliminar</button>`,
        "client": `<input type="number" min="0" max="50" class="cant-producto" id="cant-carrito-${idProd}">
                   <button type="submit" id="agregar-carrito-${idProd}" class="btn agregar-carrito">Agregar al carrito</button>`,
        "": ""  //! En algun momento tengo que sacar esto
    }
    return actions[target]
}

function enviarACarrito(id, cant) {
    const cantCompra = parseInt(cant)
    !validarRepetido(id) ? altaCarrito(id, cantCompra) : agregarRepetidoEnCarrito(id, cantCompra)
    carritoAStorage()
    mostrarCarrito()
}

validarRepetido = (id) => carrito.some((objectCarrito) => objectCarrito.id === id)

function altaCarrito(id, cant) {
    let objectCarrito = {
        id: id,
        cant: cant
    }
    carrito.push(objectCarrito)
}

function agregarRepetidoEnCarrito(id, cant) {
    const idsCarrito = carrito.map((objectCarrito) => objectCarrito.id)
    const posicionRepetido = idsCarrito.indexOf(id)
    carrito[posicionRepetido].cant += cant
}

function carritoAStorage() {
    const carritoJSON = JSON.stringify(carrito)
    localStorage.setItem("carrito", carritoJSON)
}

function storageACarrito() {
    const carritoJson = localStorage.getItem("carrito")
    if (carritoJson) {
        carrito = JSON.parse(carritoJson)
        mostrarCarrito()
    }
}

/* El carrito guarda objetos distintos que el catálogo, únicamente el id y la cantidad a comprar por el usuario
   No guardo el producto completo porque ocuparía más espacio en memoria en vano, con sólo el id, puedo rearmar el producto */

function mostrarCarrito() {   //Obtengo los atributos de los productos del catálogo que se encuentran en el carrito
    domCarrito.innerHTML = ""
    totalCompra = 0
    carrito.forEach((objectCarrito) => {
        // itemCatalogo es un array del producto buscado
        let itemCatalogo = productos.filter((prod) => prod.id === objectCarrito.id)
        let objectCatalogo = itemCatalogo[0]
        let domItemCarrito = document.createElement("div")
        domItemCarrito.className = "producto-card"
        domItemCarrito.id = `item-carrito-${objectCarrito.id}`
        domItemCarrito.innerHTML = `
        <img src="${objectCatalogo.imagen}" alt="${objectCatalogo.tipoProd}" class="producto-img">
        <div class="producto__info">
        <h3>Producto: ${objectCatalogo.tipoProd} - ${objectCatalogo.marca}</h3>
        <p>Precio unitario: ${objectCatalogo.precio} - Cantidad a comprar: ${objectCarrito.cant}</p>
        <h4>Subtotal: ${objectCatalogo.precio * objectCarrito.cant}</h4>
        </div>
        `
        domCarrito.append(domItemCarrito)
        totalCompra += objectCatalogo.precio * objectCarrito.cant
    })
}

function calcularTotalCompra() {
    domTotalCompra.innerText += `$${totalCompra}`
    carrito = []
    mostrarCarrito()
    localStorage.clear()
}

function cerrarSesion() {
    document.location.reload()
}

/* ================ DECLARACIÓN FUNCIÓN PRINCIPAL ================ */

function main() {

    // CARGA DE CATÁLOGO
    productos.push(new Producto(1, "Paleta", "BlackCrown", 60000, 10, "./img/paleta-black.png"))
    productos.push(new Producto(2, "Paleta", "ML10", 50000, 5, "./img/paleta-ml10.png"))
    productos.push(new Producto(3, "Paleta", "Siux", 65000, 15, "./img/paleta-siux.png"))
    productos.push(new Producto(4, "Paleta", "WingPro", 35000, 4, "./img/paleta-wing.png"))
    productos.push(new Producto(5, "Bolso", "Adidas", 25000, 10, "./img/bolso-adidas.jpg"))
    productos.push(new Producto(6, "Mochila", "Nike", 18000, 6, "./img/mochila-nike.jpg"))
    productos.push(new Producto(7, "Muñequeras", "UnderArmour", 1000, 15, "./img/muniequera-under.jpg"))
    productos.push(new Producto(8, "Tubo Pelotas", "Adidas", 2000, 8, "./img/pelotas-adidas.jpg"))
    productos.push(new Producto(9, "Tubo Pelotas", "Prince", 1500, 4, "./img/pelotas-prince.jpg"))


    // GENERACIÓN DE USUARIOS
    usuarios.push(new Usuario("admin", "1234", true))
    usuarios.push(new Usuario("maxi", "maxizero", false))
    usuarios.push(new Usuario("a", "a", false))

    domElementsInit()
    eventoLogin()
    eventoSearch()
    eventoTotalCompra()
    eventoRegistroUsuario()
    eventoCloseSession()
}

/* ================ LLAMADO FUNCIÓN PRINCIPAL ================ */

main()