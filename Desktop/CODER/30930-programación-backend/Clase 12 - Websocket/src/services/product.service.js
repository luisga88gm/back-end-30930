const fs = require("fs");
let data = fs.readFileSync("./src/data.json", "utf-8");
let products = JSON.parse(data);
const ids = products.map((product) => product.id);

class Producto {
	productos = products;
	id = ids.length;

	nuevoProducto(producto) {
		//
		try {
			const result = JSON.parse(data);
			const newData = [...result];
			const payload = {
				title: producto.title,
				price: producto.price,
				thumbnail: producto.thumbnail,
				id: ++this.id
			};
			console.log(payload);
			newData.push(payload);
			fs.writeFileSync(`./src/data.json`, JSON.stringify(newData));
			return '{success: "Producto agregado."}';
		} catch (err) {
			console.log("[falla al guardar]", err);
			console.log("archivo creado, vuelve a intentar\n");
		}
	}

	mostrarProducto(id) {
		let prod = this.productos.find((producto) => {
			return producto.id == id;
		});
		if (prod == undefined) {
			return '{error: "Producto no encontrado."}';
		}

		return prod;
	}

	listarProducto() {
		try {
			return this.productos;
		} catch (err) {
			return "[]";
		}
	}

	actualizarProducto(cambios, id) {
		let indiceProd = this.productos.findIndex((prod) => {
			return prod.id == id;
		});
		let prodActualizado = { ...cambios, id: id };
		return (this.productos[indiceProd] = prodActualizado);
	}

	eliminarProducto(id) {
		let indiceProd = this.productos.findIndex((prod) => {
			if (prod.id == id) {
				return prod;
			}
		});
		if (indiceProd == -1) {
			return '{error: "Producto no encontrado."}';
		}
		return this.productos.splice(indiceProd, 1)[0];
	}
}

module.exports = new Producto();