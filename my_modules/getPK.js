//쓰기
var lightwallet = require("./eth-lightwallet");
var fs = require('fs')
var util = require('util');
var readFile = util.promisify(fs.readFile)


const web3 = async (req,res,next)=>{
    try{
        var wallet  = await readFile("wallet.json")
        var keystore =await lightwallet.keystore.deserialize(wallet); 
      
        var address = keystore.getAddresses()

        await keystore.keyFromPassword("123", (err, data)=> {
            var key= keystore.exportPrivateKey(address.toString(), data)
            req.pk = key
            next()
       })

    }catch(err){
        console.log(err)
    }
}

module.exports=web3
