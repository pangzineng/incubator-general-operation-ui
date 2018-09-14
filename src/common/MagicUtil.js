const crypto = require('crypto');

const realSpells = {
    '9e71e1c1f3f5d45d42669dc0c191d58ee5c90ff69a8011fc34c66f375ba46a7e':'#F8BBD0',
    'cedb08873dca79fda7f7a7d0d1c50a85450b3ca50d5361629d5687477eb73db4':'#69526d',
    'ae61ec3038a12cc04d81d6b6f1fd8de4f478ef04fa706c9e50001b7f9a80c916':'#FFFFFF',
    '7d6eed970c816ef060d23fe0758646f406fc61c5c15b1c58a3a51846c476d747':'#B71C1C',
    '924689ee279a197725ac0e436fef557b896c20bb59c45f89b383dbf049a14547':'#4b72ff',
    '30249e4c7b32d1865637a4f01941b440253f130b492c89733d65cec08e3d9355':'#FDD835'
}



export const realContract = (spell) => {
    const hash = crypto.createHash('sha256');
    hash.update(spell || '');
    var promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const color = realSpells[hash.digest('hex')]
            color ? resolve(color) : reject()
        }, 500)
    })
    return promise
}