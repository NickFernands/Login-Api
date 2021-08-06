const express = require('express');
const router = express.Router();
const mysql = require('../../database').pool;
const bcrypt = require('bcrypt');
const {body, validationResult} = require('express-validator');

router.post('/', [body("name").isLength({min: 2}).withMessage("Nome Inválido, Insira um nome que tenha 2 ou mais caracteres"),
                  body("username").isLength({min: 3}).withMessage("User Inválido, Insira um nome que tenha 3 ou mais caracteres"),
                  body("email").isEmail().withMessage("E-mail Inválido, Insira um e-mal valido(com @, um domínio e com um endereço antes do @)"),
                  body("password").isLength({min: 6}).withMessage("Senha Inválida, a Senha deve ter 6 caracteres, e pelomenos 1 número"),
                  body("password").isAlphanumeric().withMessage("Senha Inválida, a Senha deve ter 6 caracteres, e pelomenos 1 número")], 
                  (req, res) => {
                    const errors = validationResult(req);
                    if(!errors.isEmpty()) {
                        return res.status(400).send({errors: errors.array()});
                    };
                    mysql.getConnection((error, conn) => {
                        if(error) {return res.status(500).send({ error: error })}
                        conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results) => {
                            if(error) {return res.status(500).send({ error: error })}
                            if(results.length > 0) {
                                res.status(401).send({menssagem: 'Usuário ja cadastrado'})
                            } else {
                                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                                    if(errBcrypt) {return res.status(500).send({ error: errBcrypt})}
                                    
                                    conn.query(
                                        'INSERT INTO users (id, name, username, email, password) VALUES (?, ?, ?, ?, ?)',
                                        [req.body.id, req.body.name, req.body.username, req.body.email, hash],
                                        (error, resultado, fields) => {
                                            conn.release();
                                    
                                            if(error) {
                                                return res.status(500).send({
                                                    error: error
                                                });
                                            };

                                            res.status(201).send({
                                                menssagem: "Usuário cadastrado com sucesso!"
                                            })
                                        }
                                    );
                                })
                            }
                        });        
                    });
});

module.exports = router;