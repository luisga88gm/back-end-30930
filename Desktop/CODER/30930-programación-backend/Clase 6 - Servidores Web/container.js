const fs = require('fs')

module.exports = class Container {
  constructor(name) {
    this.name = name
  }

  async save(object) {
    try {
      const data = await fs.promises.readFile(`./${this.name}`, 'utf-8')
      const result = JSON.parse(data)
      const newData = [...result]
      const payload = {
        title: object.title,
        price: object.price,
        thumbnail: object.thumbnail,
        id: result.length + 1
      }
      newData.push(payload)
      await fs.promises.writeFile(`./${this.name}`, JSON.stringify(newData))
      return 'guardado\n'
    } catch (err) {
      console.log('[falla al guardar]', err)
      await fs.promises.writeFile(`./${this.name}`, '[]')
      return 'archivo creado, vuelve a intentar\n'
    }
  }
  async getById(id) {
    const data = fs.readFileSync(`${this.name}`)
    const dataJson = JSON.parse(data)
    return dataJson.find((item) => item.id === id)
  }
  async getAll() {
    try {
      const data = fs.readFileSync(`./${this.name}`, 'utf-8')
      return JSON.parse(data)
    } catch (err) {
      return err
    }
  }
  deleteById(id) {
    const data = fs.readFileSync(`${this.name}`)
    const dataJson = JSON.parse(data)
    const newData = dataJson.filter((item) => item.id !== id)
    return fs.writeFileSync(`${this.name}`, JSON.stringify(newData))
  }

  async deleteAll() {
    try {
      await fs.promises.unlink(`./${this.name}`)
      return 'borrado\n'
    } catch (error) {
      return `[Falla al borrar] ${error}`
    }
  }
}