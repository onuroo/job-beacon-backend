"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Merhaba, Express!');
});
app.get('/greet/:name', (req, res) => {
    const name = req.params.name;
    res.send(greet(name));
});
const greet = (name) => {
    return `Merhaba, ${name}!`;
};
app.listen(port, () => {
    console.log(`Uygulama http://localhost:${port} adresinde çalışıyor`);
});
