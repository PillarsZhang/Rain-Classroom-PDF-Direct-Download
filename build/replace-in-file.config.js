/* eslint-env node */
const path = require('path');

const projectRootPathSlash = path.join(__dirname, '..');
const projectRootPathUnderline = projectRootPathSlash.replace(/\W+/g, '_');

const regexSlash = new RegExp(projectRootPathSlash.replace(/\\/g, '\\\\'), 'g');
const regexUnderline = new RegExp(projectRootPathUnderline, 'g');

const PROJECT_ROOT_PATH_SLASH = 'PRPS';
const PROJECT_ROOT_PATH_UNDERLINE = 'PRPU';

module.exports = {
    files: './dist/rain-classroom-pdf-direct-download.user.js',
    from: [regexSlash, regexUnderline],
    to: [PROJECT_ROOT_PATH_SLASH, PROJECT_ROOT_PATH_UNDERLINE]
};
