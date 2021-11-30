import { dirname, basename } from 'path';
import glob from 'glob';
import { readFileSync } from 'fs'
import appConfig from './config.js';
import importToDB from './dal.js';
import flatJson from './flatten.js';

const CONFIG_FILE_NAME = 'config.json'
const CONFIG_LOCAL_FILE_NAME = 'config.local.json'

function getJsonFiles(src, callback) {
    glob(src + '/**/*.json', callback);
}
function deleteDbProperty(configFile) {
    delete configFile["db"];
}

function getConfigFileFromList(filesList, filename) {
    const file = filesList[filename];
    return !!file ? JSON.parse(readFileSync(file, 'utf8')) : new Object();
}

function isConfigFile(fileName) {
    return [CONFIG_FILE_NAME, CONFIG_LOCAL_FILE_NAME].includes(fileName.toLowerCase());
}
function merge(configFiles) {
    for (var file in configFiles) {
        var configFile = getConfigFileFromList(configFiles[file], CONFIG_FILE_NAME);
        var localConfigFile = getConfigFileFromList(configFiles[file], CONFIG_LOCAL_FILE_NAME);
        var mergeDBProp = Object.assign({}, configFile["db"], localConfigFile["db"]);
        deleteDbProperty(configFile);
        deleteDbProperty(localConfigFile);
        var merged = Object.assign({}, flatJson(configFile), flatJson(localConfigFile));
        importToDB(mergeDBProp, merged);
    };
}
function importConfigFilesToDB() {
    getJsonFiles(appConfig.configFilesPath, function (err, filesList) {
        var files = {};
        filesList.forEach(file => {
            var fileName = basename(file);
            if (isConfigFile(fileName)) {
                var dirName = dirname(file);
                if (!files[dirName]) {
                    files[dirName] = {};
                }
                files[dirName][fileName.toLowerCase()] = file;
            }
        });
        merge(files);
    });
}

importConfigFilesToDB();
