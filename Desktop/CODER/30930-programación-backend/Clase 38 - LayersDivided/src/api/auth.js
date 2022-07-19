const {modeloUser}=require('../models/users');

const buscaUsuario=async(usuario)=>{
    const user = await modeloUser.findOne({email:usuario});
    return user
}

const altaUsuario=async(datosUser)=>{
    const nuevoUser= await modeloUser.create(datosUser);
    return nuevoUser
}

const buscaUsuarioPorId= (userId)=>{
    const user = modeloUser.findById(userId);
    return user;
}


module.exports={buscaUsuario, altaUsuario, buscaUsuarioPorId}


