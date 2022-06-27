const min=1
const max=1001

class Randoms{
    numeros=[];

    constructor(cant){
        for(let i=0; i<cant; i+=1){
            let num=this.randomNum(min, max);
            console.log('numero aleatorio', num)
            let idx=this.numeros.findIndex(n=>n.num==num);
            console.log('numeros_idx', this.numeros)
            console.log('idx', idx)
            if (idx===-1){
                this.numeros.push({
                    num: num,
                    cant: 1})
            }else{
                this.numeros[idx].cant++
            }
        }
        console.log('Numeros: ', this.numeros)    
    };

    randomNum (min,max){
        return Math.floor(Math.random() * (max - min) + min);
    };

    ordenaNums(){
        this.numeros.sort((a,b)=>{
            if (a.num>b.num){
                return 1
            }else{
                return -1
            }
        })
        console.log('numeros ordenados', this.numeros)
    }
};

process.on('message', (msg)=>{
    if(msg.msg=='start'){
        const numeros=new Randoms(msg.cant);
        numeros.ordenaNums();
        process.send(numeros)
    }
});

module.exports=Randoms