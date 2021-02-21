const router = require('express').Router();
const wallet = require('./wallet');
const web3Middleware = require('../../my_modules/web3/web3')
const keyMiddleware = require('../../my_modules/getPK')
const web3ProviderMiddleware = require('../../my_modules/web3/web3Provider')

router.post('/newMnemonic',wallet.newMnemonic)

router.post('/newWallet',wallet.newWallet)

router.use('/getBalance',web3ProviderMiddleware)
router.post('/getBalance',wallet.getBalance)

router.use('/sendEth',web3ProviderMiddleware)
router.post('/sendEth',wallet.sendEth)


module.exports = router
