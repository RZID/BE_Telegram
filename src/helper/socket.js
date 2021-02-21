const chat = require('../model/chat')
const socketio = require('socket.io')
module.exports = (server) => {
    const io = socketio(server, {
        cors: {
            origin: '*'
        }
    })
    let users = []
    io.on('connection', (socket) => {
        socket.broadcast.emit('onlined', users)
        socket.on('logged-in', (email) => {
            users.push({
                id: socket.id,
                email: email
            })
        })
        socket.on('join-room', (id) => {
            socket.join(id)
        })
        socket.on('get-user-list', (data) => {
            chat.getRoom(data.email).then((res) => {
                io.to(socket.id).emit('res-user-list', res)
            })
        })
        socket.on('get-last-chat', (room) => {
            chat.getLastChat(room).then((res) => {
                io.to(room).emit('res-get-last-chat', res)
            })
        })
        socket.on('get-chat', (room) => {
            chat.getChat(room).then((res) => {
                io.to(room).emit('res-get-chat', res)
            })
        })
        socket.on('get-data-target', (data) => {
            chat.getParticipant(data.id).then((res) => {
                const dataTarget = res.filter(el => el.email_user != data.email)
                io.to(socket.id).emit('res-data-target', dataTarget)
            })
        })
        socket.on('send-chat', (data) => {
            chat.sendChat(data).then(() => {
                io.to(data.to).emit('res-send-chat', (true))
                chat.getChat(data.to).then((res) => {
                    io.to(data.to).emit('res-get-chat', res)
                })
            })
            io.emit('updateList', (true))
        })
        socket.on('readed-msg', (id) => {
            io.to(id).emit('res-readed', (true))
        })
        socket.on('disconnect', () => {
            users = users.filter(el => el.id !== socket.id)
            socket.broadcast.emit('onlined', users)
        })
        socket.on('change-profile', () => {
            io.emit('updateList', (true))
        })
    })
}