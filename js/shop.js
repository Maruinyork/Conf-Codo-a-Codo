window.onload = function () {
  const selectElement = document.forms[0].categoria //document.forms es el array que contiene el formulario de la pagina
  //accedo al primer formulario de la pagina
  //se crea automatic, el array elements por cada formulario

  //Creare los eventos para cuando se les de click al boton
  const container = document.getElementById('containerTicket')
  const sendButton = document.getElementById('send-button')
  const completar = document.getElementById('completar')
  const finish = document.getElementById('finish')

  //Sucederán dos eventos, cuando se envie el formulario: la validacion y la compra
  sendButton.addEventListener('click', validate)

  product_list = [] //Declaro un array vacio por que aqui ira lo que el cliente agregue//
  let ids = 0 //Para que a cada objeto se le agregue un id unico
  let elementos = document.forms[0].elements //Para acceder a los elementos, primero se obtiene el primer elemento del primer formulario, los elementos estan con name

  //Validacion de eleccion del cliente

  function validate(e) {
    //Esta es la funcion para validar y recibira el evento e
    e.preventDefault() //Evita que se refresque la pagina por default

    let patron = /^\s+/ //Para detectar espacios vacios al momento de cargar la cantidad;
    let opciones = ['Estudiante', 'Trainee', 'Junior']

    let categoria = elementos[0].value //Seleccionar la categoria
    let cantidad = elementos[1].value //El segundo campo no puede ser nulo, no puede tener longitud de 0, la tercera condicion indica que no pueden ser solo espacios vacios

    if (categoria.selectedIndex == 0) {
      return false //Si todavia no elige la categoria devolvera falso, no se produce la compra
    } else if (!opciones.includes(categoria)) {
      console.log('Opción inválida')
      return false //Si las opciones no incluyen lo elegido, devuelve falso y no envia
    } else if (
      categoria == null ||
      categoria.length == 0 ||
      patron.test(categoria) ||
      /\d+/.test(categoria)
    ) {
      return false //Si sabor es nulo, si no hay nada escrito o si el patron descubre que hay espacios vacios o si existe algun digito o numero tmb retornara falso
    } else if (
      cantidad == null ||
      isNaN(cantidad) ||
      cantidad <= 0 ||
      cantidad > 99
    ) {
      return false //Si la cantidad es igual a 0 o si Nan en cantidad o si la cantidad esta en numeros negativos o es menos a 0, o cantidad es mayor a 10, devolvera falso
    } else {
      addProduct() //Si las condiciones anteriores no se cumplen se agregara el producto
    }
    //Cambiar el estilo CSS de la lista de productos
    if (product_list.length > 0) {
      finish.style.display = 'block'
    }

    ///////////////////// Funciones //////////////////////////////

    function addProduct() {
      let id = ids
      let categoria = elementos[0].value

      let nombre = elementos[2].value
      let apellido = elementos[3].value
      let email = elementos[4].value

      let producto = new Producto(
        id,
        categoria,
        elementos[0].value,
        elementos[1].value,
        nombre,
        apellido,
        email,
      )
      console.log(producto.id)
      ids += 1 //Operador ++

      const element = document.createElement('div') //Crear un div vacío
      element.className = 'card' //Se añadirá la clase card al elemento creado para darle formato
      element.innerHTML =
        //Creo una plantilla de HTML y se ira agregando cada atributo
        `<p class="mx-3" style="background: #c5e2f6">
            <strong>Categoria: ${categoria}</strong>
            <br>
            Cantidad: ${producto.cantidad}<br>   
            Precio: $ ${producto.precio}<br>   
            <b>Total a Pagar: $ ${producto.getTotal()}</b>

            <p class="mx-3">La reserva se mantendrá durante 24hs y se confirmará luego de efectuado el pago.</p>
        </p>
        <input type="button" class="btn btn-outline-light bg-success w-100" name="delete" value="Eliminar">
        
        `
      //Añadir este elemento en la pantalla
      container.appendChild(element)

      //Guardo la seleccion del cliente en LS  //////////////////////////////////////////
      const productoString = JSON.stringify(producto)
      localStorage.setItem('producto', productoString)

      //Convierto el string en objeto //////////////////////////////////////////////////
      const productoJSON = localStorage.getItem('producto')
      console.log(JSON.parse(productoJSON))

      //Añadir un nuevo producto a la lista interna del programa
      product_list.push(producto) //con push agrego el producto

      //Para borrar el formulario
      document.forms[0].reset()

      //Mostrar la lista de producto
      console.log(product_list)

      //Esta función es para evitar un error y clicks infinitos
      container.removeEventListener('click', deleteProduct)

      container.addEventListener('click', function (e) {
        console.log(e.target + ': ' + e.target.name + ' ' + producto.id)
        if (e.target.name === 'delete') {
          deleteProduct(e.target, producto.id) //se ejecutara esta funcion al clickearse delete
        } else {
          return
        }
      })
      return false
    }

    const reload = () => {
      location.reload()
    }

    function time() {
      setTimeout(() => {
        Swal.fire({
          titleText: 'Muchas gracias',
          text:
            'Se ha enviado un email a su correo con el detalle de la reserva.',
          icon: 'info',
          width: '90%',
        })
      }, 2000)
    }

    //////Calcular el monto total de la compra
    function completarCompra() {
      let total = 0
      for (i = 0; i < product_list.length; i++) {
        //Recorro el array de producto
        console.log(product_list[i])
        total += product_list[i].getTotal()
      }
      Swal.fire(
        'Ticket reservado con exito!',
        'Monto total a pagar: $' + total,
        'success',
      )
      time()
    }
    finish.addEventListener('click', completarCompra)

    //////Función para borrar un producto recibiendo su ID (numérico)
    function deleteProduct(element, id) {
      if (element.name === 'delete') {
        element.parentElement.remove()
        if (product_list.length > 0) {
          product_list.splice(id, 1) //con splice elimino del id, 1 elemento
          ids -= 1
        }
        console.log('Productos: ' + product_list.length)
      } else {
        return
      }
    }

    /////////Uso un metodo con una funcion constructora, para crear una especie de objeto nuevo
    function Producto(id, tipo, categoria, cantidad, nombre, apellido, email) {
      this.id = id
      this.tipo = tipo
      this.categoria = categoria
      this.cantidad = cantidad
      this.nombre = nombre
      this.apellido = apellido
      this.email = email

      console.log('ID: ' + id) //cuando se cree un objeto mostrara el id
      const precio = 200.0

      switch (categoria) {
        case 'Estudiante':
          this.precio = precio - precio * 0.8
          break
        case 'Trainee':
          this.precio = precio - precio * 0.5
          break
        case 'Junior':
          this.precio = precio - precio * 0.15
          break
      }

      this.subtotal = this.cantidad * this.precio

      this.getTotal = function () {
        let total = this.subtotal
        return total
      }
    }
  }
}
