//쓰기
var Web3 = require("web3");
var lightwallet = require("../../my_modules/eth-lightwallet");
var HookedWeb3Provider = require("hooked-web3-provider");

var fs = require('fs')
var util = require('util');
var readFile = util.promisify(fs.readFile)


const web3 = async (req,res,next)=>{
    try{
        var wallet  = await readFile("wallet.json")
        var keystore =await lightwallet.keystore.deserialize(wallet);

        var address = keystore.getAddresses()

        var web3 =await new Web3(
            new HookedWeb3Provider({
              host:"https://ropsten.infura.io/v3/960b19495a1f48a3ac2a2b3b5b2d4c23",
              transaction_signer: keystore
            })
          );

          //가스비 정보 조회
          await web3.eth.getGasPrice(function(err,gas){
            if(err){
              console.log(err)
                res.json({code:999,err:"가스비 정보 조회 실패"})
            }
            console.log("####GASPRICE ::: ",gas)
            req.gas= gas
        })

          req.web3 = await web3;
          req.address = await address
          next()

    }catch(err){
        console.log(err)
    }
}

module.exports=web3
