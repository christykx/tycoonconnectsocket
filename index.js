// const io = require("socket.io")(8900, {
//     cors: {
//         // origin: ["https://localhost:3000", "https://tycoonconnect.onrender.com","https://example.com"],
//         origin: ["http://localhost:3000"],

//     },
// });


const io = require("socket.io")("https://tycoonconnect.online", {
    cors: {
             origin: ["https://main.d1m5dwj4swb035.amplifyapp.com"],

    },
});


let users = [];
let peerusers = [];

const addUser = (userid, socketid) => {
    !users.some((user) => user.userid === userid) &&
        users.push({ userid, socketid })
}


const addVideoUser = (userid, peerid, socketid) => {
    if (peerusers.some((user) => user.userid === userid)) {
        peerusers = peerusers.filter(user => user.userid !== userid);
        peerusers.push({ userid, peerid, socketid })
    } else {
        peerusers.push({ userid, peerid, socketid })
    }
    console.log(userid, "userid");
    console.log(peerid, "peer id");
    console.log(socketid, "socket id");
}

    // console.log(user?.userid,"user.userid");
const removeUser = (socketid) => {  
    users = users.filter(user => user.socketid !== socketid)
}

const getUser = (userid) => {
    console.log(userid, "useridd");
    console.log(users, "Display users array");
    // console.log(user?.userid,"user.userid");

    return users?.find((user) => user?.userid === userid)
}

const getaddVideoUser = (userid, peerid) => {
    console.log(userid, "useridd");
    console.log(peerid, "useridd");
    console.log(peerusers, "Display users array");
    // console.log(user?.userid,"user.userid");
    return peerusers?.find((user) => user?.userid === userid)
}


io.on('connection', (socket) => {
    //when connects
    console.log('a user connected');
    //take userid and socketid from user.

    // io.emit("welcome","hello this is a socket server")

    // socket.emit("me", socket.id)

    // socket.on("calldisconnect", () => {
    //     socket.broadcast.emit("callEnded")
    // })

    // socket.on("callUser", (data) => {
    //     io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    // })

    // socket.on("answerCall", (data) => {
    //     io.to(data.to).emit("callAccepted", data.signal)
    // })

    socket.on("addUser", id => {
        addUser(id, socket.id)
        io.emit("getUsers", users)
    })


    socket?.on("addVideoUser", ({ userid, peerid }) => {
        addVideoUser(userid, peerid, socket.id)
        io.emit("getaddVideoUsers", peerusers)
    })


    //send and get message

    socket?.on("sendmsg", ({ senderid, receiverid, text }) => {

        const user = getUser(receiverid);
        console.log(receiverid, "receiverid");
        console.log(senderid, "senderid");
        console.log(text, "chat reached socket");
        console.log(user?.socketid, "socket id");
        io.to(user?.socketid)?.emit("getmsg", {
            senderid,
            text
        })

    })

    //send and get notifications

    socket?.on("sendNotification", ({ senderid, senderName, receiverid, type }) => {
        console.log(senderid);
        console.log(senderName);
        console.log(receiverid);
        console.log(type);

        const receiver = getUser(receiverid);
        io.to(receiver?.socketid)?.emit("getNotification", {
            senderid,
            senderName,
            receiverid,
            type
        })

    })



    socket?.on("sendNotificationCount", ({ receiverid, count }) => {
        console.log(count);
        console.log(receiverid);

        const receiver = getUser(receiverid);
        io.to(receiver?.socketid)?.emit("getNotificationCount", {
            count
        })

    })



    socket.on("disconnect", () => {
        //when disconnects
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users)

    })
});
