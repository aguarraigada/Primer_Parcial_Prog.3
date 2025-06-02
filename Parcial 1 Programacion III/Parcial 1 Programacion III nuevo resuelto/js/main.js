// Llamo a la funcion init(puse todo dentro de DOMContentLoaded porque a la hora de usar el LocalStorage me tiraba problemas en la inyeccion del HTML, asi que con esto me encargo de que cargue primero todo el html y despues se muestren las cosas. Supongo que porque el script esta en el head y no al final del body?)
document.addEventListener("DOMContentLoaded", () => {
    init();
});

// PUNTO NUMERO 1: Crea un array de objetos con 13 frutas
const frutas = [
    {
        id: 1,
        nombre: "Anana",
        precio: 100,
        imagen: "../img/anana.jpg"
    },
    {
        id: 2,
        nombre: "arandano",
        precio: 80,
        imagen: "img/arandano.jpg"
    },
    {
        id: 3,
        nombre: "banana",
        precio: 90,
        imagen: "img/banana.jpg"
    },
    {
        id: 4,
        nombre: "Frambuesa",
        precio: 110,
        imagen: "img/frambuesa.png"
    },
    {
        id: 5,
        nombre: "frutilla",
        precio: 150,
        imagen: "img/frutilla.jpg"
    },
    {
        id: 6,
        nombre: "kiwi",
        precio: 200,
        imagen: "img/kiwi.jpg"
    },
    {
        id: 7,
        nombre: "mandarina",
        precio: 180,
        imagen: "img/mandarina.jpg"
    },
    {
        id: 8,
        nombre: "manzana",
        precio: 250,
        imagen: "img/manzana.jpg"
    },
    {
        id: 9,
        nombre: "naranja",
        precio: 230,
        imagen: "img/naranja.jpg"
    },
    {
        id: 10,
        nombre: "pera",
        precio: 300,
        imagen: "img/pera.jpg"
    },
    {
        id: 11,
        nombre: "pomelo-amarillo",
        precio: 260,
        imagen: "img/pomelo-amarillo.jpg"
    },
    {
        id: 12,
        nombre: "pomelo-rojo",
        precio: 190,
        imagen: "img/pomelo-rojo.jpg"
    },
    {
        id: 13,
        nombre: "sandia",
        precio: 210,
        imagen: "img/sandia.jpg"
    }
];

// PUNTO NUMERO 2: Modiﬁca la función inicializadora init() para incluir una función que imprima tu nombre y apellido en el <nav> del HTML y también en la consola.
function imprimirDatosAlumno() {
    // aca estoy creando el objeto alumno, objeto simple con clave:valor con los datos requeridos
    const alumno = {
        dni: "42.292.761",
        nombre: "Agustin",
        apellido: "Arraigada"
    };

    // muestro la info por consola usando los backticks
    console.log(`Alumno: ${alumno.nombre} ${alumno.apellido} - DNI: ${alumno.dni}`);

    // aca hago la inyeccion dinamica de HTML dentro del div con clase "nombreAlumno", use querySelector en vez de getElementsByClassName por preferencia
    const contenedorNombre = document.querySelector(".nombreAlumno");
    if (contenedorNombre) {
        contenedorNombre.textContent = `${alumno.nombre} ${alumno.apellido}`;
    }
}

// inicializo la funcion init
function init() {
    cargarCarritoDesdeLocalStorage();
    
    imprimirDatosAlumno();

    mostrarFrutas();

    activarFiltroBusqueda();

    crearBotonesOrdenamiento();

    actualizarContador();
}


// PUNTO NUMERO 3: Implementa una función que imprima en pantalla los productos (frutas) del array de objetos. Agrega esta función dentro de init() .
function mostrarFrutas(listaFrutas = frutas) {
    const contenedor = document.querySelector(".contenedor-productos");

    // limpio el contenedor antes de mostrar frutas nuevas
    contenedor.innerHTML = "";

    // hago un forEach (en todos los casos de este proyecto uso forEach porque me resulta la manera mas facil y clara en sintaxis para iterar) para ir inyectando dinamicante el html fruta por fruta y los componentes del card (contenedor, img, nombre, etc)
    listaFrutas.forEach(fruta => {
        const card = document.createElement("div");
        card.classList.add("card-producto");

        const img = document.createElement("img");
        img.src = fruta.imagen;

        const nombre = document.createElement("h3");
        nombre.textContent = fruta.nombre;

        const precio = document.createElement("p");
        precio.textContent = `$${fruta.precio}`;

        const boton = document.createElement("button");
        boton.textContent = "Agregar al carrito";

        boton.addEventListener("click", () => {
            agregarAlCarrito(fruta);
        });

        // agrego todo al div de card con appendChild, y luego agrego ese mismo card al contenedor de productos
        card.appendChild(img);
        card.appendChild(nombre);
        card.appendChild(precio);
        card.appendChild(boton);

        contenedor.appendChild(card);
    });
}

/*
PUNTO NUMERO 4: Implementar una función de ﬁltro, que se dispare al escribir en un campo input, ﬁltrando los productos que coincidan con el
campo de texto.
*/
function activarFiltroBusqueda() {
    const inputBusqueda = document.querySelector(".barra-busqueda");

    // me encargo de buscar el valor ingresado en el input (y pasarlo a minusculas para ahorrar problemas), despues filtro con .filter y me fijo si lo ingresado esta dentro de mis productos (las frutas en este caso), y de ser correcto lo muestro llamando a la funcion mostrarFRutas
    inputBusqueda.addEventListener("input", () => {
        const texto = inputBusqueda.value.toLowerCase();

        const frutasFiltradas = frutas.filter(fruta =>
            fruta.nombre.toLowerCase().includes(texto)
        );

        mostrarFrutas(frutasFiltradas);
    });
}

/*
PUNTO NUMERO 5:
1. Implementar la funcionalidad de carrito, esta debe estar asociada al boton de cada elemento del carrito. El carrito debe
mostrarse por console.log()
2. Incorporar la funcion mostrarCarrito() asociada al boton de cada elemento del carrito El HTML generado debe
seguir esta estructura:
3. Incorporar la funcion eliminarProducto() . Este debe estar asociado al boton del carrito
*/

let carrito = [] // inicializo el carrito como un array vacio
function agregarAlCarrito(fruta) {
    carrito.push(fruta); // agrego las frutas al array
    console.log("Carrito actualizado:", carrito);
    mostrarCarrito(); // actualizo en pantalla
    guardarCarritoEnLocalStorage(); // punto que se pide mas abajo pero guardo el carrito actual en LOcalStorage
}

// aca basicamente muestro el carrito. primero me encargo de informar si esta vacio, despues creo todo el html con la informacion del producto con un foreach por cada elemento dentro del carrito, tambien tiene agregada la funcionalidad para eliminar (por ID)y mostrar el total en $
function mostrarCarrito() {
    const itemsCarrito = document.getElementById("items-carrito");
    itemsCarrito.innerHTML = ""; // limpio el contenido

    if (carrito.length === 0) {
        itemsCarrito.innerHTML = "<p>No hay elementos en el carrito.</p>";
        return;
    }

    const lista = document.createElement("ul");

    carrito.forEach((producto, id) => {
        const item = document.createElement("li");
        item.classList.add("bloque-item");

        const texto = document.createElement("p");
        texto.classList.add("nombre-item");
        texto.textContent = `${producto.nombre} - $${producto.precio}`;

        const botonEliminar = document.createElement("button");
        botonEliminar.classList.add("boton-eliminar");
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            eliminarProducto(id);
        });


        item.appendChild(texto);
        item.appendChild(botonEliminar);
        lista.appendChild(item);
        
        actualizarTotal();
    });

    itemsCarrito.appendChild(lista);
}


function eliminarProducto(id) {
    carrito.splice(id, 1); // elimino por id
    console.log("Carrito actualizado:", carrito)
    mostrarCarrito(); // actualizo en pantalla
    guardarCarritoEnLocalStorage();
    actualizarTotal();
}

/*
PUNTO NUMERO 6:
• Almacena los productos del carrito en localStorage .
• Los productos en el localStorage deben estar además con los últimos cambios de carrito y los productos que se hayan
eliminado del carrito
• Si existen productos previamente en el localStorage, deben poder verse cuando se cargue la pagina
*/
// creo una funcion que guarde el carrito en localstorage con setItem (tanto lo que se agrega, como lo que se borra. es decir muestra siempre el estado actual del carrito)
function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const datos = localStorage.getItem("carrito");
    if (datos) {
        carrito = JSON.parse(datos);
        mostrarCarrito();
    }
}

// PUNTO NUMERO 7:
// aca actualizo el contador de items en el carrito haciendo referencia al length del mismo, y mas abajo actualizo el precio total (cuando haya items) usando  
// .reduce y manejandome con un acumulador y el precio del item que se agrega/borra (accediendo a dicha propiedad del objeto con .precio)
function actualizarContador() {
    document.getElementById("contador-carrito").textContent = carrito.length;
}

function actualizarTotal() {
    const total = carrito.reduce((acumulador, item) => acumulador + item.precio, 0);
    document.getElementById("precio-total").textContent = `$${total}`;
}

/*
PUNTO NUMERO 8:
• Crea dos botones en línea con el título de sección productos.
• Implementa la funcionalidad para ordenar los productos en estos dos botones. Un boton debe ordenar por nombre los
productos y el otro por precio de menor a mayor
*/

/*creo los botones, los contenedores, etc. y los inyecto dinamicamente al html como veniamos haciendo
despues me encargo de agregarle la funcionalidad necesaria a esos botones con el event listener, lo que hice aca fue usar el spread operator [...] para crear 
una copia del array y no modificar el original al hacer el ordenamiento y use sort para hacer el ordenamiento (manejandome con el retorno de un numero positivo o negativo para ver cual va adelante y cual atras), por ultimo lo inserte con insertBefore y nextSibling
*/
function crearBotonesOrdenamiento() {
  const seccion = document.querySelector(".seccion-productos");
  const titulo = seccion.querySelector("h2");

  const contenedorBotones = document.createElement("div");
  contenedorBotones.className = "botones-ordenamiento";

  const botonNombre = document.createElement("button");
  botonNombre.textContent = "Ordenar por nombre";

  const botonPrecio = document.createElement("button");
  botonPrecio.textContent = "Ordenar por precio";

  // evento
  botonNombre.addEventListener("click", function () {
    const frutasOrdenadas = [...frutas];
    frutasOrdenadas.sort(function (a, b) {
      const nombreA = a.nombre.toLowerCase();
      const nombreB = b.nombre.toLowerCase();
      if (nombreA > nombreB) return 1;
      if (nombreA < nombreB) return -1;
      return 0;
    });
    mostrarFrutas(frutasOrdenadas);
  });

  botonPrecio.addEventListener("click", function () {
    const frutasOrdenadas = [...frutas];
    frutasOrdenadas.sort(function (a, b) {
      return a.precio - b.precio;
    });
    mostrarFrutas(frutasOrdenadas);
  });

  // insertar botones al contenedor
  contenedorBotones.appendChild(botonNombre);
  contenedorBotones.appendChild(botonPrecio);

  // insertar contenedor despues del titulo
  seccion.insertBefore(contenedorBotones, titulo.nextSibling);
}
