const path = require('path');
const tokenFilePath = path.join(__dirname + "/token.txt");

const xApiKey = "ASHpZPjYhjQ3C4sgd/IunWt4MxszoK3rm4DbYkjiZsogFN52ZX1MWdQNMLe9oSelpwcq4gRjAJrlFcnkCy/1Qvcmdznmbt0jWix5MMvkRd5XguTX4/uRaMAPR5j1bB3IpsYXuMjl"
const apiEndpoint = "https://api.vim.ai:5005"
module.exports = {
    xApiKey,
    apiEndpoint,
    tokenFilePath
};