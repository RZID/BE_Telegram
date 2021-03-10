const conn = require("../config/db");
const Moment = require("moment");
module.exports = {
  getRoom(from) {
    return new Promise((resolve, reject) => {
      conn.query(
        `
            SELECT *, tb_room.unique_room, tb_user.id_user, tb_photo.id_photo, tb_photo.img_photo 
            FROM tb_participant 
            LEFT JOIN tb_user ON tb_participant.id_user = tb_user.id_user 
            LEFT JOIN tb_room ON tb_participant.unique_room = tb_room.unique_room 
            LEFT JOIN tb_photo ON  tb_photo.id_user  = tb_participant.id_user
            WHERE tb_user.email_user = ?`,
        [from],
        async (err, result) => {
          if (err) {
            reject(new Error(err));
          } else {
            for (let i = 0; i < result.length; i++) {
              result[i].participant = await module.exports
                .getParticipant(result[i].unique_room)
                .then((res) => res);
              result[i].lastChat = await module.exports
                .getLastChat(result[i].unique_room)
                .then((res) => res);
            }
            resolve(result);
          }
        }
      );
    });
  },
  getParticipant(room) {
    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT tb_photo.img_photo, tb_room.id_room, tb_room.unique_room, tb_room.type_room,tb_user.bio_user,tb_user.lat_user, tb_user.long_user, tb_user.name_user, tb_user.email_user FROM tb_room LEFT JOIN tb_participant ON tb_room.unique_room = tb_participant.unique_room LEFT JOIN tb_user ON tb_participant.id_user = tb_user.id_user LEFT JOIN tb_photo ON tb_photo.id_user = tb_participant.id_user WHERE tb_room.unique_room = ?`,
        [room],
        (err, result) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  getLastChat(room) {
    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT * FROM tb_chat WHERE unique_room = ? ORDER BY id_chat DESC LIMIT 1`,
        [room],
        (err, result) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  getChat(room) {
    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT tb_chat.text_chat, tb_chat.time_chat, tb_user.email_user FROM tb_chat LEFT JOIN tb_user ON tb_chat.id_user = tb_user.id_user WHERE unique_room = ?`,
        [room],
        (err, result) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  sendChat(data) {
    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT id_user from tb_user WHERE email_user = ?`,
        [data.from],
        (err, result) => {
          if (err) {
            reject(new Error(err));
          } else {
            if (result.length < 1) {
              reject(new Error("User not found"));
            } else {
              console.log(data);
              conn.query(
                `INSERT INTO tb_chat (id_user, unique_room, text_chat, time_chat, deleted_chat) VALUES (?,?,?,?,?)`,
                [result[0].id_user, data.to, data.text, Moment().unix(), 0],
                (err, result) => {
                  if (err) {
                    reject(new Error(err));
                  } else {
                    resolve(result);
                  }
                }
              );
            }
          }
        }
      );
    });
  },
};
