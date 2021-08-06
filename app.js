//Configurações
const express = require ('express');
const app = express();
const morgan = require('morgan');

/**Configuração das rotas**/
const rotaLogin = require ('./api/routes/rotaLogin');
const rotaRegister = require ('./api/routes/rotaRegister');

//Informações de Log das rotas no terminal
app.use(morgan('dev'));

//Configurações de Body
app.use(express.urlencoded({extended: false}));//Aceita a entrada de dados simples
app.use(express.json());//Permite a entrada apenas do formado JSON

//Configurações de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATH');
        return res.status(200).send({});
    }

    next();
})
    
//Rotas na URL/Postman
app.use('/login', rotaLogin);
app.use('/register', rotaRegister);

//Rotas Utilizadas casos as rotas acimas não estejam acessíveis
app.use((req, res, next) => {
    const error = new Error('Não encontrado');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro:{
            mensagem: error.message
        }
    });
});

module.exports = app;