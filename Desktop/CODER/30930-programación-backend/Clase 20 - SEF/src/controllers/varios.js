const { v4: uuid4 } = require('uuid');

const generaId=()=>{
    const idAsignado=uuid4();
    return idAsignado
};

const randomIndex = (min,max) =>{
    return Math.floor(Math.random() * (max - min) + min);
};

module.exports={generaId, randomIndex}