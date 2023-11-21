const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require('ethereum-cryptography/secp256k1')
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "046f6bd2f8a8044b8ed332571b508ea3524b9609b5b8f4449d72bcf850b6c8d4ad2d6ab563fed5ae48860211d3da6cd5a74bdfe05262b2ab5ee038568f890adfe4": 100,
  "04143feccde7d325dd7ed4c32ec7ef0100110e52aa616d4e1ae618cb1354bd05185b302396b0fe4df9b43e52668dc6824a84add37f8eda7b3a32ca226b2c3fbec7": 50, 
  "04ac5bc0a5982c1802ed41f7c6ca9db35f6934dea4a20cb8950f794b945d7c7bf4e8ead1cb42d16f5091ee058c94b809cb938f22ad11e67f96fde1619e622240f5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  console.log('address', address)
  const public = toHex(secp.getPublicKey(address));
  console.log('public', public)
  const balance = balances[public] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sig, recoveryBit, recipient, amount } = req.body;

  console.log('typeof',typeof sig)
  console.log('sig',sig)
  console.log('sig22',Uint8Array.from(sig))
  console.log('recoveryBit',recoveryBit)

  const hash = keccak256(utf8ToBytes('dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'))

  console.log('hash',hash)

  const deHashSender = toHex(secp.recoverPublicKey(hash, Uint8Array.from(sig), recoveryBit));

  console.log('deHashSender',deHashSender)

  setInitialBalance(deHashSender);
  setInitialBalance(recipient);

  if (balances[deHashSender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[deHashSender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[deHashSender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
