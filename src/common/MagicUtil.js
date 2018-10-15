const crypto = require('crypto');

const realSpells = {
  '9e71e1c1f3f5d45d42669dc0c191d58ee5c90ff69a8011fc34c66f375ba46a7e':'#F8BBD0',
  'cedb08873dca79fda7f7a7d0d1c50a85450b3ca50d5361629d5687477eb73db4':'#69526d',
  'ae61ec3038a12cc04d81d6b6f1fd8de4f478ef04fa706c9e50001b7f9a80c916':'#FFFFFF',
  '7d6eed970c816ef060d23fe0758646f406fc61c5c15b1c58a3a51846c476d747':'#B71C1C',
  '924689ee279a197725ac0e436fef557b896c20bb59c45f89b383dbf049a14547':'#4b72ff',
  '30249e4c7b32d1865637a4f01941b440253f130b492c89733d65cec08e3d9355':'#FDD835'
}

const serviceProfiles = [{
  name: 'Preview Reality Operation',
  endpoint: 'http://localhost:8888/v1',
  access: {
    "ad": {
      "map": {
        "enable": false
      },
      "oin": {
        "enable": true,
        "tooltip": "preview the ad",
        "path": {
          "template": `\${0}`,
          "fields": [
            "src"
          ]
        }
      },
      "chart": {
      "enable": false
      }
    },
    "background": {
      "map": {
        "enable": false
      },
      "oin": {
        "enable": true,
        "tooltip": "preview the reality",
        "path": {
          "template": `http://localhost:3001/b/\${0}`,
          "fields": [
            "_id"
          ]
        }
      },
      "chart": {
        "enable": false
      }
    }
  }
},{
  name: 'Real Pixel Opeartion',
  endpoint: 'http://localhost:8888/v1',
  access: {
    "analysis": {
      "map": {
        "enable": false
      },
      "oin": {
        "enable": false
      },
      "chart": {
        "enable": false
      }
    },
    "eye": {
      "map": {
        "enable": true,
        "lat": "source.geo.lat",
        "lon": "source.geo.lon"
      },
      "oin": {
        "enable": true,
        "tooltip": "enter the eye",
        "path": {
          "template": `http://localhost:8888/v1/eye/$\${0}?cts=\${1}`,
          "fields": [
            "_id",
            "_sys.created_ts"
          ]
        }
      },
      "chart": {
        "enable": true,
        "xAxis": "name",
        "yAxis": [
          {
            "field": "source.geo.lat",
            "name": "Lat",
            "serie": "line",
            "type": "value",
            "area": {}
          },
          {
            "field": "_sys.created_by",
            "name": "CB",
            "serie": "bar",
            "type": "category"
          },
          {
            "field": "_sys.created_ts",
            "name": "Time",
            "serie": "bar",
            "type": "time"
          }
        ]
      }
    }
  }
}
]

const magicProfile = {
  '#69526d': serviceProfiles[0],
  '#FFFFFF': serviceProfiles[1],
  '#F8BBD0': serviceProfiles[0],
  '#69526d': serviceProfiles[1],
  '#FFFFFF': serviceProfiles[0],
  '#B71C1C': serviceProfiles[1],
  '#4b72ff': serviceProfiles[0],
  '#FDD835': serviceProfiles[1]
}

export const realContract = (spell) => {
  const hash = crypto.createHash('sha256');
  hash.update(spell || '');
  var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const color = realSpells[hash.digest('hex')]
      const profile = magicProfile[color]
      color && profile ? resolve({color, profile}) : reject()
    }, 500)
  })
  return promise
}

