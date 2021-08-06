const express = require('express');
const router = express.Router();
const mysql = require('../../database').pool;
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');


router.post('/', [body("username").isLength({min: 3}).withMessage("Nome Inválido, Insira um nome que tenha 2 ou mais caracteres"),
                  body("password").isLength({min: 6}).withMessage("Senha Inválida, a Senha deve ter 6 caracteres, e pelomenos 1 número"),
                  body("password").isAlphanumeric().withMessage("Senha Inválida, a Senha deve ter 6 caracteres, e pelomenos 1 número")], 
                  (req, res)  => {
                    const errors = validationResult(req);
                    if(!errors.isEmpty()) {
                        return res.status(400).send({errors: errors.array()});
                    };
                    mysql.getConnection((error, conn) => {
                        if(error) {return res.status(500).send({error: error})}
                        conn.query(
                            'SELECT name, email FROM users WHERE username = ?',
                            [req.body.username, req.body.password],
                            (error, results, fields) => {
                                conn.release();

                                if(error) {
                                    return res.status(500).send({
                                        error: error
                                    });
                                }
                                
                                if(results.length < 1) {
                                    return res.status(401).send({
                                        error: "Usuário passado não foi encontrato"
                                    })
                                }
                                
                                res.status(202).send({
                                    messagem: "Login Executado",
                                    dados: results[0]
                                    
                                });
                            } 
                        );
                    });
                });

module.exports = router;