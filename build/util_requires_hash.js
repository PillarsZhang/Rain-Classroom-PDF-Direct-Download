/* eslint-env node */

const fs = require('fs');
const path = require('path');
const axios = require('axios')
const crypto = require('crypto');
const httpsProxyAgent = require('https-proxy-agent');


const sources = ["jsdelivr", "jsdelivr_fastly", "bcecdn_pizyds", "baomitu"]
const modes = ["dev", "prod"]

const instance = axios.create({
    httpsAgent: httpsProxyAgent('http://localhost:10809'),
    timeout: 10000,
});

const allEqual = arr => arr.every( v => v === arr[0] )

const requires = JSON.parse(fs.readFileSync(path.resolve(__dirname, './tampermonkey/requires.cdnjs.json'), 'utf-8'));

async function getRequiresHash(requires, sources, modes) {
    let requires_hash = []
    for (let r of requires) {
        let hash_mode_arr = {}
        for (let mode of modes) {
            let hash_promise_arr = sources.map(source => {
                let url = r[mode][source]
                if (url != null) {
                    return instance.get(url)
                      .then(response => response.data)
                      .then(data => crypto.createHash('sha256').update(data).digest('hex'))
                } else {
                    return null
                }
            })
            let hash_arr = await Promise.all(hash_promise_arr)
            for (const [i, source] of sources.entries()) {
                let hash = hash_arr[i]
                console.log(`[${r.name}] ${mode}.${source}: `.padEnd(50) + `${hash}`)
            }
            hash_arr = hash_arr.filter(hash => hash != null)
            if (hash_arr.length > 0) {
                if (allEqual(hash_arr)) {
                    hash_mode_arr[mode] = hash_arr[0]
                } else {
                    throw `[${r.name}] ${mode}: Hash values are not equal!`
                }
            } else {
                throw `[${r.name}] ${mode}: No valid URL exists!`
            }
        }
        requires_hash.push({
            "name": r.name,
            ...modes.reduce((prev, mode) => ({...prev, [mode]: {
                ...sources.reduce((prev, source) => (r[mode][source] != null ? {...prev, [source]: r[mode][source]} : prev), {}),
                "hash": `sha256=${hash_mode_arr[mode]}`
            }}), {})
        })
    }
    return requires_hash
}

getRequiresHash(requires, sources, modes)
  .then(requires_hash => {
      let requires_hash_json = JSON.stringify(requires_hash, null, 4)
      console.log(requires_hash_json)
      console.log("校验通过")
      let requires_hash_path = path.resolve(__dirname, './tampermonkey/requires_hash.json')
      fs.writeFileSync(requires_hash_path, requires_hash_json, 'utf-8');
      console.log("写入文件：", requires_hash_path)
    })
  .catch(error => {
      console.error(error)
      console.error("校验失败")
  })
