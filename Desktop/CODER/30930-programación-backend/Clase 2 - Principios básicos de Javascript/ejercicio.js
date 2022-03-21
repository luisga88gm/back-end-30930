class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
      this.nombre = nombre
      this.apellido = apellido
      this.libros = libros
      this.mascotas = mascotas
    }
  
    getFullName() {
      return `
        Nombres: ${this.nombre}
        Apellidos: ${this.apellido}`
    }
  
    addMascota(mascota) {
      return this.mascotas.push(mascota)
    }
  
    countMascota() {
      return this.mascotas.length
    }
  
    addBook(book, autor) {
      return this.libros.push({ nombre: book, autor: autor })
    }
  
    getBookNames() {
      return this.libros.map((book) => book.nombre)
    }
  }
  
  let usuario = new Usuario(
    'Luis Gabriel',
    'García Mingall',
    [{ nombre: '1984', autor: 'George Orwell' }],
    ['loro']
  )
  
  console.log(usuario.getFullName())
  console.log(usuario.addMascota('gallina'))
  console.log(usuario.countMascota())
  console.log(usuario.addBook('La Traición', 'Jorge F. Díaz'))
  console.log(usuario.getBookNames())