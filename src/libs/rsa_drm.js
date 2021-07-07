import publicKey from '../key/rsa_2048_pub.pem';
import { build_info } from './common';
import { v4 as uuidv4 } from 'uuid';
import hybrid_crypto_js from 'hybrid-crypto-js';

//小众的库，CDN上对WEB的模块引出方式和NODE有一点不一样，为了调试做以下兼容
var hybrid_crypto_options = { aesKeySize: 128 };
var crypt = window.PIZYDS_RAIN.MODE == "production" ? new hybrid_crypto_js(hybrid_crypto_options) : new hybrid_crypto_js.Crypt(hybrid_crypto_options);

export function generateUserID(){
    var drm_json = {
        build_info,
        page_info: {url: window.location.href, timestamp: Date.now()},
        user_profile: generateUserProfile(),
        salt: uuidv4()
    };
    var drm_text = JSON.stringify(drm_json);
    var drm_rsa_json = crypt.encrypt(publicKey, drm_text); 
    var drm_rsa_obj = JSON.parse(drm_rsa_json);
    var drm_rsa_obj_keys = {};
    drm_rsa_obj_keys.fingerprint = Object.keys(drm_rsa_obj.keys)[0];
    drm_rsa_obj_keys.key = drm_rsa_obj.keys[drm_rsa_obj_keys.fingerprint];
    var drm_pizyds_rain_arr = [
        drm_rsa_obj.iv,
        hexFingerprint2Base64(drm_rsa_obj_keys.fingerprint),
        drm_rsa_obj_keys.key,
        drm_rsa_obj.cipher
    ];
    return drm_pizyds_rain_arr.join(":");
}

export function generateUserProfile(){
    var user_profile_raw = JSON.parse(localStorage.getItem("user_profile")) || {};
    var user_profile_name_raw = user_profile_raw.name || user_profile_raw.nickname || '?';
    var user_profile_name = "";
    for (let i = 0; i < user_profile_name_raw.length; i++) {
        user_profile_name += (i % 2 == 0) ? user_profile_name_raw[i] : '*'
    }
    var user_profile = {
        user_id: user_profile_raw.user_id || '?',
        school: user_profile_raw.school || '?',
        school_number: user_profile_raw.school_number || '?',
        name: user_profile_name
    }
    return user_profile;
}

function hexFingerprint2Base64(hex){
    var keyHexs = hex.split(':');
    var uint8 = new Uint8Array(keyHexs.length);
    keyHexs.forEach((value, index) => uint8[index] = parseInt(value, 16));
    return window.btoa(String.fromCharCode.apply(null, uint8));
}