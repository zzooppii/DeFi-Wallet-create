var lightwallet = require("../../my_modules/eth-lightwallet");
var fs = require('fs');
var util = require('util');
var readFile = util.promisify(fs.readFile)


exports.newMnemonic = async (req, res) => {
    var mnemonic;
    try {
        mnemonic = lightwallet.keystore.generateRandomSeed();
        res.json({mnemonic})
    } catch (err) {
        console.log(err)
    }
}

exports.newWallet = async(req,res)=>{
    var password = req.body.password
    var mnemonic = req.body.mnemonic;

    try {
        console.log("1");
        lightwallet.keystore.createVault(
            {
              password: password,
              seedPhrase: mnemonic,
              hdPathString: "m/0'/0'/0'"
            },
            function (err, ks) {
              console.log(ks.salt);
              ks.keyFromPassword(password, function (err, pwDerivedKey) {
                ks.generateNewAddress(pwDerivedKey, 1);
                var address = (ks.getAddresses()).toString();
                var keystore = ks.serialize();

                fs.writeFile('wallet.json',keystore,function(err,data){
                  if(err){
                    res.json({code:999,message:"실패"});
                  } else {
                    res.json({code:1,message:"성공"});
                  }
                })
                // res.json({ keystore: keystore, address: address });
              });
            }
          );
      } catch (exception) {
        console.log("NewWallet ==>>>> " + exception);
      }
}

exports.getBalance = async (req, res) => {
    var web3 = req.eth
    var eth= 0;
    var address = req.address
    // var address = "0x37b900c129d6dDaC8d8144Cdfc574bf87788363C";
    console.log(web3);
    await web3.getBalance(address.toString(), async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log('-------------------------------------');
          eth = data.toString();
          console.log("address :" + address);
          console.log("eth :" + eth);
          realeth = eth / 1000000000000000000;
        }
        res.json({code:1,eth:realeth})
    });
}

exports.sendEth = async (req, res) => {
  var web3 = req.web3;
  var fromAddress = req.address;
  var toAddress = req.body.toAddress
  var gasPrice = req.gas;
  var value = req.body.value;

  console.log("fromAddress : " + fromAddress);
  console.log("toAddress : " + toAddress);
  console.log("value : " + value);
  console.log("gasPrice : " + gasPrice);
  // gasPrice: 4000000000,

   await req.eth.sendTransaction({
      from: fromAddress.toString(),
      to: toAddress.toString(),
      value: value,
      data:"0x",
      gasPrice: gasPrice*1.5,
      gas: 50000
  }, function (err, txhash) {
      if(err){
        console.log(err)
      }
      res.json({ code: 1, txhash: txhash })
  });
}
