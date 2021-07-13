import publicKey from '../key/rsa_2048_pub.pem';
import { build_info } from './common';
import { v4 as uuidv4 } from 'uuid';
import hybridCrypto from 'hybrid-crypto-js/web/hybrid-crypto.js';

//小众的库，CDN上对WEB的模块引出方式和NODE有一点不一样
var crypt = new hybridCrypto({ aesKeySize: 128 });

/**
 * 生成 DRM 信息
 * @return {string}
 */
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

/**
 * 生成 DRM 中的用户信息
 * @return {string}
 */
export function generateUserProfile(){
    var way_1 = JSON.parse(localStorage.getItem("user_profile"));
    var way_2 = JSON.parse(localStorage.getItem("vuex")) && JSON.parse(localStorage.getItem("vuex")).userInfo;
    var user_profile_raw = way_1 || way_2 || {};
    var user_profile_name_raw = user_profile_raw.name || user_profile_raw.nickname || '?';
    var user_profile_name = "";
    var user_profile_name_choose = randomIntFromInterval(0, user_profile_name_raw.length - 1);
    for (let i = 0; i < user_profile_name_raw.length; i++) {
        user_profile_name += (i == user_profile_name_choose) ? user_profile_name_raw[i] : '*';
    }
    var user_profile = {
        user_id: user_profile_raw.user_id || '?',
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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}