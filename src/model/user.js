const conn = require('../config/db')
const fs = require('fs')
module.exports = {
    login: (email) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_user WHERE email_user = '${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(500))
                } else {
                    if (result.length < 1) {
                        reject(new Error(404))
                    } else {
                        if (result[0].isactive_user != 1) {
                            reject(new Error(401))
                        } else {
                            resolve(result)
                        }
                    }
                }
            })
        })
    },
    register: (name, email, pw) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_user WHERE email_user = '${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(500))
                } else {
                    if (result.length > 0) {
                        reject(new Error(409))
                    } else {
                        conn.query("INSERT INTO tb_user (name_user, email_user, pass_user, isactive_user) VALUES (?,?,?,?)", [name, email, pw, 0], (err, result) => {
                            if (err) {
                                reject(new Error(500))
                            } else {
                                resolve(true)
                            }
                        })
                    }
                }
            })
        })
    },
    getUserData: (email) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT * FROM tb_user LEFT JOIN tb_photo ON tb_user.id_user = tb_photo.id_user WHERE tb_user.email_user = ?`, [email], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    insertPhoto: (email, photo) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT tb_user.id_user, tb_photo.img_photo FROM tb_user LEFT JOIN tb_photo ON tb_photo.id_user = tb_user.id_user WHERE tb_user.email_user = ?`, [email], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    if (result.length < 1) {
                        reject(new Error(204))
                    } else {
                        if (!result[0].img_photo) {
                            conn.query(`INSERT INTO tb_photo (id_user,img_photo) VALUES (?,?)`, [result[0].id_user, photo], (err) => {
                                if (err) {
                                    reject(new Error(err))
                                } else {
                                    resolve(true)
                                }
                            })
                        } else {
                            const url = `${process.cwd()}/public/images/profile_user/${result[0].img_photo}`
                            if (fs.existsSync(url)) {
                                fs.unlink(url, err => {
                                    if (err) {
                                        responser.ise(res, err)
                                    }
                                })
                            }
                            conn.query(`UPDATE tb_photo SET img_photo=? WHERE id_user = ?`, [photo, result[0].id_user], (err) => {
                                if (err) {
                                    reject(new Error(err))
                                } else {
                                    resolve(true)
                                }
                            })
                        }
                    }
                }
            })
        })
    },
    setName: (email, name) => {
        return new Promise((resolve, reject) => {
            conn.query(`UPDATE tb_user SET name_user = ? WHERE email_user = ?`, [name, email], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getUser: (email, me) => {
        return new Promise((resolve, reject) => {
            conn.query(`SELECT tb_user.name_user, tb_user.email_user, tb_photo.img_photo, tb_participant.* 
            FROM tb_participant 
            LEFT JOIN tb_user ON tb_participant.id_user = tb_user.id_user 
            LEFT JOIN tb_photo ON tb_user.id_user = tb_photo.id_user 
            WHERE tb_user.email_user = ?`, [email], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}