// // module.exports = function(io) {
// //     io.on('connection', socket => {
// //         console.log('User Connected'); // Log when a user connects

// //         // Listen for the 'refresh' event from the frontend
// //         socket.on('refresh', data => {
// //             console.log('Refresh event received:', data); // Log the received data
// //             io.emit('refreshPage', {}); // Emit the 'refreshPage' event to all connected clients
// //         });

// //         socket.on('disconnect', () => {
// //             console.log('User Disconnected'); // Log when a user disconnects
// //         });
// //     });
// // };


// module.exports = function(io) {
//     io.on('connection', socket => {
//         console.log('User Connected');

//         socket.on('joinRoom', data => {
//             socket.join(data.room);
//             console.log(`User joined room: ${data.room}`);
//         });

//         socket.on('refresh', data => {
//             if (data.room) {
//                 io.to(data.room).emit('refreshPage', {});
//                 console.log(`RefreshPage emitted to room: ${data.room}`);
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log('User Disconnected');
//         });
//     });
// };


// module.exports = function(io) {
//     io.on('connection', socket => {
//         console.log('User Connected');

//         socket.on('joinRoom', data => {
//             socket.join(data.room);
//             console.log(`User joined room: ${data.room}`);
//         });

//         socket.on('sendMessage', messageData => {
//             const room = [messageData.senderName, messageData.receiverName].sort().join('_');
//             io.to(room).emit('newMessage', messageData);
//             console.log(`New message sent to room: ${room}`);
//         });

//         socket.on('disconnect', () => {
//             console.log('User Disconnected');
//         });
//     });
// };



module.exports = function(io, User, _) {
    const userData = new User();
    io.on('connection', socket => {
        console.log('User Connected');

        socket.on('joinRoom', data => {
            socket.join(data.room);
            console.log(`User joined room: ${data.room}`);
        });

        socket.on('sendMessage', messageData => {
            const room = [messageData.senderName, messageData.receiverName].sort().join('_');
            io.to(room).emit('newMessage', messageData); // Emit directly to the room
            console.log(`New message sent to room: ${room}`);
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected');
        });

         socket.on('refresh', data => {
            io.emit('refreshPage', {});
            console.log('RefreshPage emitted to all clients');
        });


        socket.on('online',(data)=>{
       socket.join(data.room);
       userData.EnterRoom(socket.id,data.user,data.room);
       const list = userData.GetList(data.room);   //list of user who is online in that room
       io.emit('usersOnline', _.uniq(list))    //get only unique user names
    });

    socket.on('disconnect', ()=>{
        const user = userData.RemoveUser(socket.id);
        if(user){
            const userArray = userData.GetList(user.room);
            const arr = _.uniq(userArray);
            _.remove(arr, n => n === user.name);
            io.emit('usersOnline', arr);
        }
    })
    });




};
