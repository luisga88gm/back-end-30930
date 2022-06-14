const express =require('express');
const router = express.Router();
const {fork}=require('child_process');
const path=require('path');

const randomScriptFile = path.resolve(__dirname, '../utils/randoms.js');
let cant

router.get('/', (req,res)=>{
    cant = req.query.cant;
    if(!cant){
        cant=100000000
    }
    const computo = fork(randomScriptFile);
    computo.send({msg: 'start', cant: cant})
    computo.on('message', (numeros)=>{
        res.json(numeros)
    })
})

module.exports = router;