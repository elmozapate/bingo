function Sockets(socket) {
    socket.handshake.address != '::ffff:127.0.0.1' ? console.log("User connection", socket.id) : console.log
    const checkingUsers = () => {
        console.log(fullMillonarioUsers, 'millonarioParticipants', millonarioParticipants);
        let aliveUsers = []
        let aliveUsersB = []
        if (aliverUser.length > 0) {
            aliverUser.map((key, i) => {
                fullMillonarioUsers.map((compare, x) => {
                    if (key.ip == compare.ip) {
                        aliveUsers.push(compare)
                    }
                })
                millonarioParticipants.map((compare, x) => {
                    if (key.ip == compare.ip) {
                        aliveUsersB.push(compare)
                    }
                })
            })

            console.log(aliveUsers, 'millonarioParticipantsRes', aliveUsersB);
            fullMillonarioUsers = aliveUsers
            millonarioParticipants = aliveUsersB
            socket.broadcast.emit(
                'millonario', {
                'actionTodo': 'playerDataRes',
                'dataIn': millonarioParticipants,
            })
        }

        console.log(aliverUser, 'aliverUser');
        aliverUser = []

    }

    const actUsers = () => {
        if (checkArray.length > 0) {
            let findedArray = [checkArray[checkArray.length - 1].ip]
            for (let index = checkArray.length - 1; index > -1; --index) {
                const element = checkArray[index].ip;
                let finded = false
                for (let index2 = 0; index2 < findedArray.length; index2++) {
                    const element2 = findedArray[index2];
                    if (element === element2) {
                        finded = true
                    }
                }
                if (!finded) {
                    findedArray.push(element)
                }

            }
            let namesArray = []
            for (let index = 0; index < nickarray.length; index++) {
                const element = nickarray[index];
                findedArray.map((key, i) => {
                    if (key === element.ip) {
                        namesArray.push(element)
                    }
                    return
                })
            }

            socket.broadcast.emit(
                'chat', {
                'actionTodo': 'users',
                'dataIn': findedArray.length
            })


            socket.broadcast.emit(
                'chat', {
                'actionTodo': 'newMessage',
                'dataIn': chatArray
            })

            socket.broadcast.emit(
                'chat', {
                'actionTodo': 'nicksAct',
                'dataIn': namesArray
            })


            chatUsers = findedArray.length
            checkArray = []
        }


    }
    if (newServer) {
        setInterval(actUsers, 10000);
        setInterval(() => {
            checkingUsers()
        }, 60000);
        newServer = false
    }

    const checkUsersProg = () => {
        console.log('s');
    }
    if (!start) {
        checkUsersProg()
        start = true

    }
    const checkUsers = (id) => {
        if (id) {
            fullMillonarioUsers.map((key, i) => {
                if (key.socketId === id) {
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'isOut',
                        'dataIn': key.name
                    })

                }
            })
            let millonarioParticipantsCopy = []
            millonarioParticipants.map((key, x) => {
                if (key.socketId === id) {
                    console.log('pafuera', key.name)
                } else {
                    millonarioParticipantsCopy.push(key)
                }
            })
            millonarioParticipants = millonarioParticipantsCopy
            socket.broadcast.emit(
                'millonario', {
                'actionTodo': 'playerDataRes',
                'dataIn': millonarioParticipantsCopy,
            })
        } else {
            socket.broadcast.emit(
                'chat', {
                'actionTodo': 'checking',
                'dataIn': true
            })

            setTimeout(actUsers, 10000)
        }

    }

    socket.on('chat', (chat) => {
        const adress = chat.dataIn.adress

        let nameCompobe = ''
        if (nickarray.length !== 0) {
            nickarray.map((key) => {

                if (key.adress === adress) {
                    nameCompobe = key.user
                    return true
                }
            })
        }

        const actionTodo = chat.dataIn.actionTodo
        const date = chat.dataIn.date
        const user = chat.dataIn.user
        const chatMsg = chat.dataIn.chat
        const privateMsg = chat.dataIn.privateMsg
        const privAdress = chat.dataIn.privAdress
        const ip = chat.dataIn.ip
        const video = chat.dataIn.video || false
        switch (actionTodo) {
            case 'checkingUsers':
                checkArray.push({ ip: ip })
                break;
            case 'retomed':
                let findes = false
                nickarray[chat.dataIn.position].adress = adress
                break;

            case 'movie':
                console.log(video, 'stream', chatMsg);
                if (privateMsg && (chatMsg === 'videoItem' || chatMsg === 'audioItem')) {
                    console.log('stream', chatMsg);
                    socket.broadcast.emit(
                        'chat', {
                        'actionTodo': 'privteMsg',
                        'movie': true,
                        'dataIn': {
                            actionTodo: 'privteMsg',
                            mensaje: {
                                adress: adress,
                                chat: chatMsg,
                                date: date,
                                user: user,
                                privAdress: privAdress,
                                ip: ip,
                                video: video,
                                dataIn: {
                                    ip: ip,
                                    actionTodo: 'privteMsg',
                                    privateMsg: true,
                                    adress: adress,
                                    chat: chatMsg,
                                    date: date,
                                    user: user,
                                    privAdress: privAdress,
                                    video: video
                                }
                            },
                            privateMsg: true,
                        }
                    })
                } else {
                    chatArray.push({
                        ip: ip,
                        date: date,
                        user: user,
                        chat: chatMsg,
                        adress: adress,
                        privateMsg: false,
                        video: video
                    });
                    socket.broadcast.emit(
                        'chat', {
                        'actionTodo': 'newMessage',
                        'dataIn': chatArray,
                        'movie': true
                    })
                    inMessage++
                }
                break;

            case 'ipSend':
                let finds = false
                let retomed = -1
                let actualChat = -1

                if (nickarray.length > 0) {

                    nickarray.map((key, i) => {

                        if (key.ip === ip) {
                            finds = true
                            actualChat = key.inTime
                            retomed = i
                            return
                        }

                    })
                }
                if (finds) {
                    socket.emit(
                        'chat', {
                        'actionTodo': 'exist',
                        'dataIn': {
                            user: nickarray[retomed],
                            array: chatArray,
                            position: retomed,
                            inTime: actualChat

                        }
                    })
                }

                break;

            case 'reset':

                inMessage = 0
                nickarray = []
                chatUsers = 0
                inGame = false
                chatArray = []
                inVideo = false
                theTime = 0
                theUrl = ''
                chatArray = []

                socket.broadcastemit(
                    'chat', {
                    'actionTodo': 'reset',
                    'dataIn': chatArray
                })
            case 'new':
                let nickarrayAux = nickarray
                let find = false
                nickarray.map((key, i) => {
                    if (key === user) {
                        find = true
                        return
                    }
                })
                if (!find) {

                    socket.emit(
                        'chat', {
                        'actionTodo': 'inMessage',
                        'dataIn': inMessage
                    })
                    nickarray.push({ user: user, adress: adress, ip: ip, inTime: chatArray.length, adress: adress })
                    const auxUsers = chatUsers + 1
                    chatArray.push({
                        date: date,
                        user: 'Sistema',
                        chat: `${user} se ha conectado`,
                    });

                    socket.broadcast.emit(
                        'chat', {
                        'actionTodo': 'newChat',
                        'dataIn': chatArray
                    })
                    chatUsers = auxUsers
                    inMessage++

                }
                setTimeout(checkUsers, 5000)

                break;
            case 'add':
                if (privateMsg) {
                    socket.broadcast.emit(
                        'chat', {
                        'actionTodo': 'privteMsg',
                        'dataIn': {
                            actionTodo: 'privteMsg',
                            mensaje: {
                                adress: adress,
                                chat: chatMsg,
                                date: date,
                                user: user,
                                privAdress: privAdress,
                                ip: ip,
                                dataIn: {
                                    ip: ip,
                                    actionTodo: 'privteMsg',
                                    privateMsg: true,
                                    adress: adress,
                                    chat: chatMsg,
                                    date: date,
                                    user: user,
                                    privAdress: privAdress,
                                }
                            },
                            privateMsg: true,

                        }
                    })
                } else {

                    chatArray.push({
                        ip: ip,
                        date: date,
                        user: user,
                        chat: chatMsg,
                        adress: adress,
                        privateMsg: false,

                    });
                    socket.broadcast.emit(
                        'chat', {
                        'actionTodo': 'newMessage',
                        'dataIn': chatArray
                    })
                    inMessage++

                }

                break;
            case 'stream':
                if (privateMsg) {
                    socket.broadcast.emit(
                        'chat', {
                        'actionTodo': 'privteMsgstreaming',
                        'dataIn': {
                            actionTodo: 'privteMsgstreaming',
                            mensaje: {
                                adress: adress,
                                chat: chatMsg,
                                date: date,
                                user: user,
                                privAdress: privAdress,
                                ip: ip,
                                video: video,

                                dataIn: {
                                    ip: ip,
                                    actionTodo: 'privteMsgstreaming',
                                    privateMsg: true,
                                    adress: adress,
                                    chat: chatMsg,
                                    date: date,
                                    user: user,
                                    privAdress: privAdress,
                                    video: video

                                }
                            },
                            privateMsg: true,

                        }
                    })
                } else {

                    socket.broadcast.emit(
                        'chat', {
                        'actionTodo': 'streaming',
                        'dataIn': video
                    })
                }

                break;

            default:
                break;

        }
    });
    socket.on('BINGO', (msg) => {
        let actionTodo = msg.actionTodo
        let dataIn = msg.dataIn
        let pos = msg.dataIn.pos || ''
        let ip = msg.dataIn.ip || ''
        let page = msg.dataIn.page || ''
        let user = msg.dataIn.user || ''
        let hora = msg.dataIn.hora || ''
        let pageFrom = msg.pageFrom || ''

        console.log(actionTodo, 'entroalguien', dataIn, ip, hora);

        switch (actionTodo) {
            case 'ipSend':
                let finds = false
                if (ipArraw.length > 0) {
                    ipArraw.map((key, i) => {
                        if (key.ip === ip) {
                            finds = true
                            return
                        }
                    })
                }
                if (finds) {
                    if (user !== '') {
                        let finded = false
                        ipUsers.map((key, i) => {
                            if (key.user === user) {
                                finded = true
                                return
                            }
                        })
                        if (!finded) {
                            ipUsers.push({
                                ip: ip,
                                hora: hora,
                                user: user,
                            })
                            socket.broadcast.emit(
                                'Secure', {
                                'actionTodo': 'userNew',
                                'dataIn': ipUsers
                            })
                        }
                    }
                    ipArraw.push({
                        ip: ip,
                        hora: hora,
                        page: pageFrom,
                        mensaje: 'in Again'
                    })
                    socket.broadcast.emit(
                        'Secure', {
                        'actionTodo': 'userinzabby',
                        'dataIn': ipArraw
                    })
                } else {
                    if (user !== '') {
                        ipUsers.push({
                            ip: ip,
                            hora: hora,
                            user: user,
                        })
                        socket.broadcast.emit(
                            'Secure', {
                            'actionTodo': 'userNew',
                            'dataIn': ipUsers
                        })
                    }
                    ipArraw.push({
                        ip: ip,
                        hora: hora,
                        page: pageFrom,
                        mensaje: 'first Time'
                    })
                    socket.broadcast.emit(
                        'Secure', {
                        'actionTodo': 'userinzabby',
                        'dataIn': ipArraw
                    })


                }
                break;
            case 'resetIp':
                ipArraw = []
                socket.broadcast.emit(
                    'Secure', {
                    'actionTodo': 'userinzabby',
                    'dataIn': ipArraw
                })
                break;
            case 'ipReq':
                socket.emit(
                    'Secure', {
                    'actionTodo': 'userinzabby',
                    'dataIn': ipArraw
                })
                socket.emit(
                    'Secure', {
                    'actionTodo': 'userNew',
                    'dataIn': ipUsers
                })
                break;
            case 'ipSendName':
                console.log(msg, 'nuevoName');
                ipUsers[pos].user = user
                socket.emit(
                    'Secure', {
                    'actionTodo': 'userNew',
                    'dataIn': ipUsers
                })
                break;
            case 'elmotemandaavolar':
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'elmotemandaavolar',
                    'dataIn': msg.dataIn
                }
                )
                break;
            case 'patadaIndividual':
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'patadaIndividual',
                    'dataIn': msg.dataIn
                }
                )
                break;
            case 'bingoSong':
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'bingoSongEmit',
                    'dataIn': dataIn,
                    'pageFrom': pageFrom
                }
                )
                break;

            case 'win':

                socket.emit(
                    'BINGO', {
                    'actionTodo': 'winnner',
                    'dataIn': dataIn,
                    'pageFrom': pageFrom

                }
                )
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'winnner',
                    'dataIn': dataIn,
                    'pageFrom': pageFrom

                }
                )
                break;
            case 'taketime':
                console.log(msg);
                const text = msg.dataIn
                socket.broadcast.emit(
                    'goMovie', {
                    'actionTodo': 'goMovie',
                    'dataIn': msg.dataIn,
                    'pageFrom': pageFrom

                })
                inVideo = true
                inVideoStream = text
                break;
            case 'starting':
                socket.emit(
                    'BINGO', {
                    'actionTodo': 'startedGame',
                    'dataIn': true,
                    'pageFrom': pageFrom

                }
                )
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'startedGame',
                    'dataIn': true,
                    'pageFrom': pageFrom

                }
                )

                break;
            case 'geted':
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'getback',
                    'dataIn': dataIn,
                    'pageFrom': pageFrom

                }
                )

                break;
            case 'player':
                let bingoClient = {
                    id: pageFrom,
                    dataIn: dataIn
                }
                playersArray.push(bingoClient)
                console.log(dataIn, 'jugador');
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'playersMaster',
                    'dataIn': playersArray,
                    'pageFrom': pageFrom
                }
                )
                socket.emit(
                    'BINGO', {
                    'actionTodo': 'players',
                    'dataIn': bingoClient,
                    'pageFrom': pageFrom

                }
                )
                break;

            case 'playerMaster ':
                let bingoMaster = {
                    id: pageFrom,
                    dataIn: dataIn
                }
                playersArray.push(bingoMaster)
                socket.emit(
                    'BINGO', {
                    'actionTodo': 'playersMaster',
                    'dataIn': playersArray,
                    'pageFrom': pageFrom
                }
                )
                socket.emit(
                    'BINGO', {
                    'actionTodo': 'players',
                    'dataIn': bingoMaster,
                    'pageFrom': pageFrom
                }
                )
                break;
            case 'creating':
                inVideo = false

                inGame = true
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'createdGame',
                    'dataIn': true,
                    'pageFrom': pageFrom

                }
                )

                break;
            case 'newAdmin':
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'newRoom',
                    'dataIn': true,
                    'pageFrom': pageFrom

                }
                )

                break;


            case 'restart':
                inGame = false
                inVideo = false
                theTime = 0
                theUrl = ''
                playersArray = []
                socket.emit(
                    'BINGO', {
                    'actionTodo': 'restarted',
                    'dataIn': true,
                    'pageFrom': pageFrom

                }
                )
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'restarted',
                    'dataIn': true,
                    'pageFrom': pageFrom

                }
                )

                break;

            case 'newBingo':
                if (dataIn) {
                    socket.emit(
                        'BINGO', {
                        'actionTodo': 'players',
                        'dataIn': playersArray,
                        'pageFrom': pageFrom

                    }
                    )
                } else {
                    socket.broadcast.emit(
                        'BINGO', {
                        'actionTodo': 'newStart',
                        'dataIn': true,
                        'pageFrom': pageFrom

                    }
                    )
                    socket.emit(
                        'BINGO', {
                        'actionTodo': 'newStart',
                        'dataIn': true,
                        'pageFrom': pageFrom

                    }
                    )
                }
                break;
            case 'actualization':
                socket.emit(
                    'BINGO', {
                    'actionTodo': 'go',
                    'dataIn': playersArray,
                    'pageFrom': pageFrom

                }
                )

                break;
            case 'start':
                emiting = true
                socket.emit(
                    'BINGO', {
                    'actionTodo': 'numbers',
                    'dataIn': dataIn,
                    'pageFrom': pageFrom

                }
                )
                socket.broadcast.emit(
                    'BINGO', {
                    'actionTodo': 'numbers',
                    'dataIn': dataIn,
                    'pageFrom': pageFrom

                }
                )
                break;
            case 'newpc':
                console.log(inVideo, 'entrooalguien');
                if (inVideo) {
                    socket.emit(
                        'BINGO', {
                        'actionTodo': 'goMovie',
                        'dataIn': inVideoStream,
                        'pageFrom': pageFrom

                    })
                }

                socket.emit(
                    'BINGO', {
                    'actionTodo': 'newpcres',
                    'dataIn': inGame,
                    'pageFrom': pageFrom

                }
                )
                break;
        }
    })
    const sendJail = (ip) => {
        socket.broadcast.emit(
            'calamar', {
            'actionTodo': 'estasEnJail',
            'dataIn': {
                ip: ip,
            }
        })
    }
    socket.on('calamar', (msg) => {
        const minutes = () => {
            timeGame = timeGame - 1


            if (cont === 10) {
                cont = 0
            }

            else {
                if (timeGame < -1) {
                    socket.broadcast.emit(
                        'calamar', {
                        'actionTodo': 'die',
                        'dataIn': true
                    })
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'die',
                        'dataIn': true
                    })
                    cont = 0

                } else {
                    socket.broadcast.emit(
                        'calamar', {
                        'actionTodo': 'TimeReloj',
                        'dataIn': timeGame
                    })
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'TimeReloj',
                        'dataIn': timeGame
                    })
                    if (timeGame === 60) {
                        socket.broadcast.emit(
                            'calamar', {
                            'actionTodo': 'lastMinute',
                            'dataIn': timeGame
                        })
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'lastMinute',
                            'dataIn': timeGame
                        })
                    }
                    if (timeGame === 0) {
                        socket.broadcast.emit(
                            'calamar', {
                            'actionTodo': 'lostGame',
                            'dataIn': timeGame
                        })
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'lostGame',
                            'dataIn': timeGame
                        })
                    }
                    setTimeout(minutes, 1000)
                }
            }
        }
        let hora = msg.dataIn.hora || ''
        let actionTodo = msg.actionTodo
        let dataIn = msg.dataIn
        let puente = msg.dataIn.puente || ''
        let ip = msg.dataIn.ip || ''
        let page = msg.dataIn.page || ''
        let user = msg.dataIn.user || ''
        let time = msg.dataIn.time || 300
        let pageFrom = msg.pageFrom || ''
        let levelIn = msg.dataIn.levelIn
        switch (actionTodo) {
            case 'createPuente':
                timeGame = time
                finalDone = false
                levelInActual = 0
                puenteTurn = 0
                win = false
                puenteActual = puente
                puenteActive = true

                socket.emit(
                    'calamar', {
                    'actionTodo': 'fallingin',
                    'dataIn': puenteTurn
                })
                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'fallingin',
                    'dataIn': puenteTurn
                })
                socket.emit(
                    'calamar', {
                    'actionTodo': 'createdOne',
                    'dataIn': {
                        array: puenteActual,
                        levelIn: 1,
                        participants: ipUsersCalamar
                    }
                })
                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'createdOne',
                    'dataIn': {
                        array: puenteActual,
                        levelIn: 1,
                        participants: ipUsersCalamar
                    }
                })
                socket.emit(
                    'calamar', {
                    'actionTodo': 'vastu',
                    'dataIn': ipUsersCalamar[puenteTurn].ip
                })
                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'vastu',
                    'dataIn': ipUsersCalamar[puenteTurn].ip
                })
                cont = 0
                timeGame = time
                minutes()
                break;
            case 'falling':
                puenteTurn = puenteTurn + 1
                if (puenteTurn >= ipUsersCalamar.length) {
                    puenteTurn = 0
                    nowInjail = []
                }
                socket.emit(
                    'calamar', {
                    'actionTodo': 'fallingin',
                    'dataIn': puenteTurn
                })
                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'fallingin',
                    'dataIn': puenteTurn
                })
                socket.emit(
                    'calamar', {
                    'actionTodo': 'vastu',
                    'dataIn': ipUsersCalamar[puenteTurn].ip
                })
                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'vastu',
                    'dataIn': ipUsersCalamar[puenteTurn].ip
                })
                setTimeout(() => { sendJail(ip) }, 6500)
                console.log('callo', 'sigue:', ipUsersCalamar[puenteTurn].ip);
                break;
            case 'passing':
                levelInActual = levelIn
                puenteActual = puente
                puenteActive = true
                socket.emit(
                    'calamar', {
                    'actionTodo': 'newPass',
                    'dataIn': {
                        array: puenteActual,
                        levelIn: levelIn
                    }
                })
                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'newPass',
                    'dataIn': {
                        array: puenteActual,
                        levelIn: levelIn
                    }
                })
                break;
            case 'playerSend':
                let findit = false
                ipUsersCalamar.map((key, i) => {
                    if (key.ip === ip) {
                        findit = true
                    }
                })
                if (findit) {
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'playerList',
                        'dataIn': ipUsersCalamar
                    })
                } else {
                    ipUsersCalamar.push(dataIn)
                }
                socket.emit(
                    'calamar', {
                    'actionTodo': 'playerList',
                    'dataIn': ipUsersCalamar
                })

                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'playerList',
                    'dataIn': ipUsersCalamar
                })
                break;
            /*   case 'estoyEnJail':
                  jailArray.push(ip)
                  break; */

            case 'ipSend':
                if (user !== '') {

                    let finds = false
                    if (ipArraw.length > 0) {
                        ipArraw.map((key, i) => {
                            if (key.ip === ip) {
                                finds = true
                                return
                            }
                        })
                    }
                    if (finds) {
                        let finded = false
                        ipUsers.map((key, i) => {
                            if (key.user === user) {
                                finded = true
                                return
                            }
                        })
                        if (!finded) {
                            ipUsers.push({
                                ip: ip,
                                hora: hora,
                                user: user,
                            })
                            socket.broadcast.emit(
                                'Secure', {
                                'actionTodo': 'userNew',
                                'dataIn': ipUsers
                            })
                        }

                        ipArraw.push({
                            ip: ip,
                            hora: hora,
                            page: pageFrom,
                            mensaje: 'in Again'
                        })
                        socket.broadcast.emit(
                            'Secure', {
                            'actionTodo': 'userinzabby',
                            'dataIn': ipArraw
                        })
                    } else {
                        if (user !== '') {
                            ipUsers.push({
                                ip: ip,
                                hora: hora,
                                user: user,
                            })
                            socket.broadcast.emit(
                                'Secure', {
                                'actionTodo': 'userNew',
                                'dataIn': ipUsers
                            })
                        }
                        ipArraw.push({
                            ip: ip,
                            hora: hora,
                            page: pageFrom,
                            mensaje: 'first Time'
                        })
                        socket.broadcast.emit(
                            'Secure', {
                            'actionTodo': 'userinzabby',
                            'dataIn': ipArraw
                        })
                    }
                }
                socket.emit(
                    'calamar', {
                    'actionTodo': 'playerList',
                    'dataIn': ipUsersCalamar
                })
                if (win) {
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'TimeReloj',
                        'dataIn': timeGame
                    })
                }
                if (puenteActive) {
                    console.log('s')
                    if (!win) {
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'TimeReloj',
                            'dataIn': timeGame
                        })
                        /*   socket.emit(
                              'calamar', {
                              'actionTodo': 'estasEnJail',
                              'dataIn': {
                                  array: ipUsersCalamar,
                                  jailArray:nowInjail,
                                  puenteTurn
                              }
                          }) */
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'playerListReady',
                            'dataIn': ipUsersCalamar
                        })
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'vastu',
                            'dataIn': ipUsersCalamar[puenteTurn].ip
                        })
                        socket.broadcast.emit(
                            'calamar', {
                            'actionTodo': 'vastu',
                            'dataIn': ipUsersCalamar[puenteTurn].ip
                        })
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'fallingin',
                            'dataIn': puenteTurn
                        })
                        socket.broadcast.emit(
                            'calamar', {
                            'actionTodo': 'fallingin',
                            'dataIn': puenteTurn
                        })
                    }
                    if (win) {
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'TimeReloj',
                            'dataIn': timeGame
                        })
                        socket.emit(
                            'calamar', {
                            'actionTodo': 'playerListReady',
                            'dataIn': ipUsersCalamar
                        })
                        socket.emit(
                            'calamar', {
                            'dataIn': posFor,
                            'actionTodo': 'theWinner',
                        })
                    }
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'TimeReloj',
                        'dataIn': timeGame
                    })
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'createdOne',
                        'dataIn': {
                            array: puenteActual,
                            levelIn: levelInActual,
                            participants: ipUsersCalamar,
                            winIp

                        }
                    })

                }

                break;
            case 'crearUserRandom':
                if (ipUsersCalamar.length > 0) {
                    randomNew = ipUsersCalamar.sort(function (a, b) { return (Math.random() - 0.5) });
                    ipUsersCalamar = randomNew
                    socket.broadcast.emit(
                        'calamar', {
                        'actionTodo': 'playerListReady',
                        'dataIn': ipUsersCalamar
                    })
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'playerListReady',
                        'dataIn': ipUsersCalamar
                    })
                }

                break;

            case 'endPuente':
                let findWinner = false
                ipUsersCalamar.map((key, i) => {
                    if (key.ip === ip) {
                        findWinner = true
                        posFor = i
                    }
                })

                cont = 10
                if (findWinner) {
                    socket.broadcast.emit(
                        'calamar', {
                        'actionTodo': 'llegoPlayer',
                    })
                    socket.emit(
                        'calamar', {
                        'actionTodo': 'llegoPlayer',
                    })
                    socket.broadcast.emit(
                        'calamar', {
                        'dataIn': posFor,

                        'actionTodo': 'theWinner',
                    })
                    socket.emit(
                        'calamar', {
                        'dataIn': posFor,
                        'actionTodo': 'theWinner',
                    })
                    winIp = ""
                    finalDone = true
                    win = true
                }
                break
            case 'passingFinal':
                finalDone = true
                win = false
                winIp = ip
                socket.broadcast.emit(
                    'calamar', {
                    'dataIn': ip,
                    'actionTodo': 'passingFinalReady',
                })
                socket.emit(
                    'calamar', {
                    'dataIn': ip,
                    'actionTodo': 'passingFinalReady',
                })
                break;


            case 'metaPlace':
                if (finalDone && win) {
                    /*  socket.broadcast.emit(
                         'calamar', {
                         'actionTodo': 'passingFinalReadyRes',
                     })
                     socket.emit(
                         'calamar', {
                         'actionTodo': 'passingFinalReadyRes',
                     }) */
                    socket.broadcast.emit(
                        'calamar', {
                        'dataIn': posFor,

                        'actionTodo': 'theWinner',
                    })
                    socket.emit(
                        'calamar', {
                        'dataIn': posFor,
                        'actionTodo': 'theWinner',
                    })
                }
                if (!win && finalDone) {
                    socket.broadcast.emit(
                        'calamar', {
                        'dataIn': winIp,
                        'actionTodo': 'passingFinalReady',
                    })
                    socket.broadcast.emit(
                        'calamar', {
                        'dataIn': winIp,
                        'actionTodo': 'passingFinalReady',
                    })
                }
                break;
            case 'resetPuente':
                winIp = ''
                ipUsersCalamar = []
                finalDone = false
                win = false
                posFor = -1
                cont = 10
                nowInjail = []
                puenteActual = []
                levelInActual = 0
                userInActual = ''
                puenteActive = false
                socket.emit(
                    'calamar', {
                    'actionTodo': 'noPuente',
                    'dataIn': {
                        array: puenteActual,
                        levelIn: levelInActual
                    }
                })
                socket.broadcast.emit(
                    'calamar', {
                    'actionTodo': 'noPuente',
                    'dataIn': {
                        array: puenteActual,
                        levelIn: levelInActual
                    }
                })
                break;
        }
    })
    socket.on("disconnect", (e) => {
        console.log("User Disconnect", e, ' socket ', socket.id)
        checkUsers(socket.id)
    })
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('video', (data) => {
        socket.broadcast.emit('url', data)
        console.log('veideo ');
    });
    socket.on('test message', () => {
        console.log('message: ');
    });
    socket.on('onVideo', (Data) => {
        let state = Data.state || false
        if (state) {
            inVideo = true
            console.log('message: true');
        } else {
            inVideo = false
            socket.broadcast.emit(
                'BINGO', {
                'actionTodo': 'createdGame',
                'dataIn': Data,
                'pageFrom': Data.pageFrom
            })
            console.log('message:false ');
        }
    });
    socket.on('onVideoTime', (data) => {
        if (data.streamer) {
            theTime = data.time
            theUrl = data.url
            socket.broadcast.emit('inVideoTime', { time: theTime, url: theUrl })
            console.log('inVideoTime: ', { time: data.time, url: data.url });
        }

    });
    const minutesHelp = () => {
        helpTime = helpTime - 1
        if (contTime === 10) {
            contTime = 0
        }
        else {
            if (helpTime < -1) {
                socket.broadcast.emit(
                    'millonario', {
                    'actionTodo': 'helpTime',
                })
                socket.emit(
                    'millonario', {
                    'actionTodo': 'helpTime',
                })
                helpTime = 30
                contTime = 0
            } else {
                socket.broadcast.emit(
                    'millonario', {
                    'actionTodo': 'helpTimeNumber',
                    'dataIn': helpTime
                })
                socket.emit(
                    'millonario', {
                    'actionTodo': 'helpTimeNumber',
                    'dataIn': helpTime
                })
/*                 setTimeout(minutesHelp, 1000)
 */            }
        }
    }
    const cleanArrays = () => {
        let millonariosPublicG = []
        millonariosPublicGames.array.map((key, i) => {
            if (key.state) {
                millonariosPublicG.push(key)
            }
        })
        let millonariosGa = []
        millonariosGames.array.map((key, i) => {
            if (key.state) {
                millonariosGa.push(key)
            }
        })
        millonariosPublicGames.array = millonariosPublicG.length > 0 ? millonariosPublicG : [
            {
                roomName: '',
                administrator: {
                    name: '',
                    ip: ''
                },
                state: false,
                helpArray: [],
                clasification: false,
                preliminarResults: [],
                preliminarArray: [],
                inGame: false,
                helpUsed: 0,
                ipPlaying: {
                    ip: {
                        ip: '',
                        name: ''
                    },
                    name: '',
                },
                level: 0,
                array: [],
                helpNumber: 0,
                category: 'random',
                playerData: [{
                    ip: '',
                    name: '',
                    type: ''
                }],
                helps: {
                    help1: true,
                    help2: true,
                    help3: true,
                    help4: true,
                }
            }
        ]
        millonariosPublicGames.games = millonariosPublicG.length
        millonariosGames.array = millonariosGa.length > 0 ? millonariosGa : [
            {
                state: false,
                level: 0,
                array: [],
                helpNumber: 0,
                category: 'random',
                playerData: {
                    ip: '',
                    name: ''
                },
                helps: {
                    help1: true,
                    help2: false,
                    help3: false,
                    help4: true,
                }
            }
        ]
        millonariosGames.games = millonariosGa.length
        socket.broadcast.emit(
            'millonario', {
            'actionTodo': 'rooms',
            'dataIn': {
                rooms: millonariosPublicGames.array,
            }
        })
        socket.emit(
            'millonario', {
            'actionTodo': 'rooms',
            'dataIn': {
                rooms: millonariosPublicGames.array,
            }
        })
    }


    socket.on('millonario', (msg) => {
        let min = 0
        let max = 4
        let actionTodo = msg.actionTodo
        let dataIn = msg.dataIn
        let roomName = msg.roomName || 'sinSala'
        let gameType = msg.gameType || ''
        switch (actionTodo) {
            case 'iAmAlive':
                let isIn = false
                aliverUser.map((key, i) => {
                    if (key === dataIn || dataIn.ip == null || dataIn.ip == 'null' || !dataIn.ip || parseInt(key.ip) == parseInt(dataIn.ip)) {
                        isIn = true
                    }
                })
                if (!isIn && dataIn.ip !== null && dataIn.ip !== 'null' && dataIn.ip) {
                    aliverUser.push(dataIn)
                }
                break;
            case 'logInMillonario':
                let loginCorrect = false
                console.log(dataIn, 'logInMillonario');
                millonarioUsersDb.map((key, i) => {
                    if (key.name === dataIn.name && key.password == dataIn.password) {
                        loginCorrect = true
                    }
                })
                if (loginCorrect) {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'nameGood',
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }
                    })
                    millonarioUsersDb.map((key, i) => {
                        if (key.name === dataIn.name) {
                            let finding = false
                            let findingAgain = false
                            millonarioParticipants.map((naming, i) => {
                                if (naming.name === dataIn.name) {
                                    finding = true
                                }
                            })
                            fullMillonarioUsers.map((named, i) => {
                                if (named.name === dataIn.name) {
                                    findingAgain = true
                                }
                            })
                            if (!finding) {
                                millonarioParticipants.push({
                                    name: key.name,
                                    ip: parseInt(key.ip),
                                    type: 'register',
                                    socketId: socket.id
                                })

                            }
                            if (!findingAgain) {
                                fullMillonarioUsers.push({
                                    name: key.name,
                                    ip: parseInt(key.ip),
                                    type: 'register',
                                    socketId: socket.id
                                })
                            }
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'correctLogIn',
                                'dataIn': key,
                            })
                        }
                    })
                    setTimeout(() => {
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'playerDataRes',
                            'dataIn': millonarioParticipants,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'playerDataRes',
                            'dataIn': millonarioParticipants,
                        })
                    }, 3500);

                } else {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'nameOcuped',
                    })
                }
                break;
            case 'playerDataSendRegister':
                let nameEmpty2 = true
                millonarioUsersDb.map((key, i) => {
                    if (key.name === dataIn.playerData.name) {
                        nameEmpty2 = false
                    }
                })
                if (fullMillonarioUsers.length > 0) {
                    fullMillonarioUsers.map((anotherKey, x) => {
                        if (anotherKey.name === dataIn.playerData.name) {
                            nameEmpty2 = false
                        }
                    })
                }
                if (nameEmpty2) {
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }
                    })
                    millonarioParticipants.push(dataIn.playerData)
                    fullMillonarioUsers.push({
                        name: dataIn.playerData.name,
                        ip: dataIn.playerData.ip,
                        type: 'register',
                        socketId: socket.id
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'playerDataRes',
                        'dataIn': millonarioParticipants,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'playerDataRes',
                        'dataIn': millonarioParticipants,
                    })
                    reqUsers(dataIn.playerData.name, dataIn.playerData.password, parseInt(dataIn.playerData.ip))
                } else {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'millonarioNameUsed',
                    })
                }
                break;

            case 'checkNameUser':
                let nameEmptyuser = true
                millonarioUsersDb.map((key, i) => {
                    if (key.name === dataIn) {
                        nameEmptyuser = false
                    }
                })
                if (fullMillonarioUsers.length > 0) {
                    fullMillonarioUsers.map((anotherKey, x) => {
                        if (anotherKey.name === dataIn) {
                            nameEmptyuser = false
                        }
                    })
                }
                if (!nameEmptyuser) {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'nameOcuped',
                    })
                } else {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'nameGood',
                    })
                }
                break;

            case 'playerDataSend':
                let nameEmpty = true
                millonarioUsersDb.map((key, i) => {
                    if (key.name === dataIn.playerData.name) {
                        nameEmpty = false
                    }
                })
                if (fullMillonarioUsers.length > 0) {
                    fullMillonarioUsers.map((anotherKey, x) => {
                        if (anotherKey.name === dataIn.playerData.name) {
                            nameEmpty = false
                        }
                    })
                }
                if (nameEmpty) {
                    aliverUser.push(dataIn.playerData)
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }

                    })
                    millonarioParticipants.push({
                        ...dataIn.playerData,
                        name: dataIn.playerData.name,
                        ip: parseInt(dataIn.playerData.ip),
                        type: 'guest',
                        socketId: socket.id
                    })
                    fullMillonarioUsers.push({
                        name: dataIn.playerData.name,
                        ip: parseInt(dataIn.playerData.ip),
                        type: 'guest',
                        socketId: socket.id
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'playerDataRes',
                        'dataIn': millonarioParticipants,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'playerDataRes',
                        'dataIn': millonarioParticipants,
                    })
                } else {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'millonarioNameUsed',
                    })
                }

                break;

            case 'enterRoom':
                let thePos = 0
                let roomAux = []
                let findRoom = false
                let findName = false
                let inClasifThisRoom = false
                let nameOfRoom = ''
                millonariosPublicGames.array.map((key, i) => {
                    if (key.roomName === roomName) {
                        inClasifThisRoom = key.clasification
                        key.playerData.map((value, x) => {
                            if (value.name === msg.dataIn.playerData.name) {
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'nameUserOcuped',
                                })
                                findName = true
                            }
                        })
                        findRoom = true
                        thePos = i
                        roomAux = millonariosPublicGames.array[i].playerData
                    }
                })
                if (findName) {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'nameOcuped',
                    })
                }
                if (!findRoom) {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'roomLoose',
                    })
                }
                if (findRoom && !findName) {
                    millonariosPublicGames.array[thePos].playerData[millonariosPublicGames.array[thePos].playerData.length] = {
                        ip: msg.dataIn.playerData.ip,
                        name: msg.dataIn.playerData.name,
                        type: 'player'
                    }
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'usersInRoom',
                        'dataIn': {
                            array: millonariosPublicGames.array[thePos].playerData,
                            roomName: roomName
                        }
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'usersInRoom',
                        'dataIn': {
                            array: millonariosPublicGames.array[thePos].playerData,
                            roomName: roomName
                        }
                    })
                    if (inClasifThisRoom) {
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'arrayClassificatorio',
                            'dataIn': millonariosPublicGames.array[thePos].preliminarArray,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'inClasificationMultiPlayer',
                            'dataIn': {
                                roomName: roomName,
                            },
                        })
                    }
                }

                break;

            case 'ipSend':
                let playingNow = false
                socket.broadcast.emit(
                    'millonario', {
                    'actionTodo': 'rooms',
                    'dataIn': {
                        rooms: millonariosPublicGames.array,
                    }

                })
                socket.emit(
                    'millonario', {
                    'actionTodo': 'rooms',
                    'dataIn': {
                        rooms: millonariosPublicGames.array,
                    }
                })
                millonarioUsersDb.map((key, i) => {
                    console.log(dataIn, 'dataIn', key);
                    if (key.ip === dataIn.ip) {
                        millonarioParticipants.push({
                            name: key.name,
                            ip: parseInt(key.ip),
                            type: 'register',
                            socketId: socket.id
                        })
                        fullMillonarioUsers.push({
                            name: key.name,
                            ip: parseInt(key.ip),
                            type: 'register',
                            socketId: socket.id
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'correctLogIn',
                            'dataIn': {
                                name: key.name,
                                ip: parseInt(key.ip)
                            },
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'playerDataRes',
                            'dataIn': millonarioParticipants,
                        })
                    }


                })
                if (millonariosPublicGames.games > 0) {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }
                    })
                }
                if (gameType === 'singlePlayer') {

                    socket.emit(
                        'millonario', {
                        'actionTodo': 'playerDataRes',
                        'dataIn': millonarioParticipants,
                    })
                    millonariosGames.array.map((key, i) => {

                        if (key.state) {

                            if (key.playerData.ip == dataIn.ip || key.playerData.participante.ip == dataIn.ip) {
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'retomSingle',
                                    'dataIn': millonariosGames.array[i],
                                })

                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'millonarioActualTurn',
                                    'dataIn': millonariosGames.array[i].level,
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'playerChoose',
                                    'dataIn': { ip: key.playerData.ip, array: millonariosGames.array },

                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsed',
                                    'dataIn': millonariosGames.array[i].helps,
                                })
                                playingNow = true
                                let aNewQuestion = key.array[(key.level)]
                                setTimeout(() => {
                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'preguntaSiguiente',
                                        'dataIn': aNewQuestion,
                                    })
                                }, 12000)
                            }
                        } else {
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'notStartSingle',
                            })
                        }
                    })


                }
                if (gameType === 'multiPlayer') {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'playerDataRes',
                        'dataIn': millonarioParticipants,
                    })
                    if (millonariosPublicGames.games > 0) {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.state) {
                                millonariosPublicGames.array[i].playerData.map((laIp, n) => {
                                    if (laIp.ip === dataIn.ip || parseInt(laIp.ip) === parseInt(dataIn.ip)) {
                                        if (key.ipPlaying.ip == dataIn.ip || key.ipPlaying.ip.ip == dataIn.ip) {
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'youArePlaying',
                                                'dataIn': {
                                                    roomName: key.roomName
                                                }
                                            })

                                        }
                                        if (key.administrator.ip == dataIn.ip) {
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'youAreOwner',
                                                'dataIn': {
                                                    playerData: key.administrator,
                                                    roomName: key.roomName
                                                }
                                            })
                                        }

                                        roomLive = true
                                        socket.emit(
                                            'millonario', {
                                            'actionTodo': 'roomLive',
                                            'dataIn': laIp.type
                                        })
                                        socket.emit(
                                            'millonario', {
                                            'actionTodo': 'usersInRoom',
                                            'dataIn': {
                                                array: key.playerData,
                                                roomName: key.roomName
                                            }
                                        })

                                    }
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'usersInRoom',
                                    'dataIn': {
                                        array: key.playerData,
                                        roomName: key.roomName
                                    }
                                })


                                key.preliminarArray.map((key2, x) => {
                                    if (key2.ip === dataIn.ip || parseInt(key2.ip) === parseInt(dataIn.ip)) {
                                        if (key.inGame) {

                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'millonarioActualTurnMultiPlayer',
                                                'dataIn': {
                                                    roomName: key.roomName,
                                                    level: key.level
                                                },
                                            })
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'playerChooseMultiPlayer',
                                                'dataIn': { ip: key.ipPlaying, array: key.preliminarResults, roomName: roomName },
                                            })
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'preguntaSiguienteMultiPlayer',
                                                'dataIn': {
                                                    roomName: roomName,
                                                    pregunta: key.array[(key.level - 1) + key.helpNumber],
                                                },
                                            })
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'helpsUsedMultiPlayer',
                                                'dataIn': {
                                                    roomName: roomName,
                                                    helpsUsed: key.helps,
                                                },
                                            })
                                        }
                                        if (key.clasification) {
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'inpuntuacionMultiPlayer',
                                                'dataIn': {
                                                    roomName: key.roomName,
                                                    array: key.preliminarResults
                                                },
                                            })
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'arrayClassificatorio',
                                                'dataIn': {
                                                    roomName: roomName,
                                                    newclasif: key.preliminarArray,
                                                }
                                            })
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'inClasificationMultiPlayer',
                                                'dataIn': {
                                                    roomName: key.roomName,
                                                },
                                            })
                                        }
                                    }

                                })

                            }
                        })
                    }
                }
                fullMillonarioUsers.map((key, i) => {
                    if (key.ip === dataIn.ip || gameType === 'millonario' || gameType === 'off' || gameType === 'singlePlayer' || gameType === 'nultiPlayer') {
                        if (gameType === 'millonario' || gameType === 'off') {
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'playerDataRes',
                                'dataIn': millonarioParticipants,
                            })
                        }
                        if (gameType === 'millonario') {

                            if (nowInMillonario) {
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'millonarioActualTurn',
                                    'dataIn': millonarioActualTurn,
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'millonarioActualTurn',
                                    'dataIn': millonarioActualTurn,
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'playerChoose',
                                    'dataIn': { ip: ipInPlay, array: millonarioParticipantsPunt },

                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'preguntaSiguiente',
                                    'dataIn': newQuestion,
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsed',
                                    'dataIn': helpsUsed,
                                })
                            }
                            if (nowClasific) {
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'inpuntuacion',
                                    'dataIn': millonarioParticipantsPunt,

                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'arrayClassificatorio',
                                    'dataIn': newclasif,
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'inClasification',
                                })
                            }
                        } else {
                            if (gameType === 'singlePlayer') {
                                millonariosGames.array.map((key, i) => {
                                    if (key.state) {
                                        if (key.playerData.ip === dataIn.ip) {

                                            setTimeout(() => {
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'retomSingle',
                                                    'dataIn': millonariosGames.array[i],
                                                })
                                            }, 5000)
                                        }
                                    } else {
                                        socket.emit(
                                            'millonario', {
                                            'actionTodo': 'notStartSingle',
                                        })
                                    }
                                })


                            }
                            if (gameType === 'multiPlayer') {
                                if (millonariosPublicGames.games > 0) {
                                    millonariosPublicGames.array.map((key, i) => {
                                        if (key.state) {
                                            if (key.playerData.ip === dataIn.ip || parseInt(key.playerData.ip) === parseInt(dataIn.ip)) {
                                                if (key.ipPlaying.ip == dataIn.ip) {
                                                    socket.emit(
                                                        'millonario', {
                                                        'actionTodo': 'youArePlaying',
                                                        'dataIn': {
                                                            roomName: key.roomName
                                                        }
                                                    })
                                                }
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'usersInRoom',
                                                    'dataIn': {
                                                        array: key.playerData,
                                                        roomName: key.roomName
                                                    }
                                                })
                                            }
                                            if (key.inGame) {
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'millonarioActualTurnMultiPlayer',
                                                    'dataIn': {
                                                        roomName: key.roomName,
                                                        level: key.level
                                                    },
                                                })
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'playerChooseMultiPlayer',
                                                    'dataIn': { ip: key.ipPlaying, array: key.preliminarResults, roomName: roomName },

                                                })

                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'preguntaSiguienteMultiPlayer',
                                                    'dataIn': {
                                                        roomName: roomName,
                                                        pregunta: key.array[(key.level - 1) + key.helpNumber],
                                                    },
                                                })
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'helpsUsedMultiPlayer',
                                                    'dataIn': {
                                                        roomName: roomName,
                                                        helpsUsed: key.helps,
                                                    },
                                                })
                                            }
                                            if (key.clasification) {
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'arrayClassificatorioMultiplayer',
                                                    'dataIn': {
                                                        roomName: roomName,
                                                        newclasif: key.preliminarArray,
                                                    }
                                                })
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'inClasificationMultiPlayer',
                                                    'dataIn': {
                                                        roomName: key.roomName,
                                                    },
                                                })
                                                socket.emit(
                                                    'millonario', {
                                                    'actionTodo': 'inpuntuacionMultiPlayer',
                                                    'dataIn': {
                                                        roomName: key.roomName,
                                                        array: key.preliminarResults
                                                    },

                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        }

                    } else {
                    }
                })


                break;
            case 'checkName':
                let nameUsed = false
                millonariosPublicGames.array.map((key, i) => {
                    if (key.roomName === msg.dataIn) {
                        nameUsed = true
                    }
                    if (nameUsed) {
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'nameOcuped',
                        })
                    } else {
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'nameGood',
                        })
                    }
                })

                break;
            case 'createRoom':
                if (millonariosPublicGames.games === 0) {
                    millonariosPublicGames.games = millonariosPublicGames.games + 1
                    millonariosPublicGames.array[0] = {
                        roomName: msg.dataIn.roomWillName,
                        administrator: msg.dataIn.playerData,
                        state: true,
                        clasification: false,
                        preliminarResults: [],
                        preliminarArray: [],
                        inGame: false,
                        ipPlaying: {
                            ip: {
                                ip: '',
                                name: ''
                            },
                            name: '',
                        },
                        level: 0,
                        array: [],
                        helpNumber: 0,
                        category: 'random',
                        playerData: [{
                            ip: msg.dataIn.ip,
                            name: msg.dataIn.playerData.name,
                            type: 'admin'
                        }],
                        helps: {
                            help1: true,
                            help2: true,
                            help3: true,
                            help4: true,
                        }
                    }
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'roomCreated',
                        'dataIn': {
                            roomName: roomName,
                        }
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }

                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'usersInRoom',
                        'dataIn': {
                            array: [{
                                ip: msg.dataIn.playerData.ip,
                                name: msg.dataIn.playerData.name,
                                type: 'admin'
                            }],
                            roomName: roomName
                        }
                    })
                } else {
                    millonariosPublicGames.games = millonariosPublicGames.games + 1
                    millonariosPublicGames.array.push({
                        roomName: msg.dataIn.roomWillName,
                        administrator: msg.dataIn.playerData,
                        state: true,
                        clasification: false,
                        preliminarResults: [],
                        preliminarArray: [],
                        inGame: false,
                        ipPlaying: {
                            ip: {
                                ip: '',
                                name: ''
                            },
                            name: '',
                        },
                        level: 0,
                        array: [],
                        helpNumber: 0,
                        category: 'random',
                        playerData: [{
                            ip: msg.dataIn.ip,
                            name: msg.dataIn.playerData.name,
                            type: 'admin'
                        }],
                        helps: {
                            help1: true,
                            help2: true,
                            help3: true,
                            help4: true,
                        }
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'roomCreated',
                        'dataIn': {
                            roomName: roomName,
                        }
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'rooms',
                        'dataIn': {
                            rooms: millonariosPublicGames.array,
                        }
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'usersInRoom',
                        'dataIn': {
                            array: [{
                                ip: msg.dataIn.playerData.ip,
                                name: msg.dataIn.playerData.name,
                                type: 'admin'
                            }],
                            roomName: roomName
                        }
                    })
                }

                break;
            case 'createClassification':
                if (gameType === 'multiPlayer') {
                    let aNewClasif = []
                    let aNewMultiArray = PreguntsMillonario.sort(function (a, b) { return (Math.random() - 0.5) });
                    for (let index = 0; index < 5; index++) {
                        const element = aNewMultiArray[index];
                        let resp = [element.respuesta1, element.respuesta2, element.respuesta3, element.respuesta4]
                        aNewClasif.push({
                            pregunta: element.pregunta,
                            correcta: parseInt(element.correcta),
                            respuestas: resp,
                        })
                    }
                    let aCopy = millonariosPublicGames
                    millonariosPublicGames.array.map((key, i) => {
                        if (key.roomName === roomName) {
                            millonariosPublicGames.array[i].clasification = true
                            millonariosPublicGames.array[i].preliminarArray = aNewClasif
                            aCopy.array[i].clasification = true
                            aCopy.array[i].preliminarArray = aNewClasif
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'rooms',
                                'dataIn': {
                                    rooms: millonariosPublicGames.array,
                                }

                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'arrayClassificatorioMultiplayer',
                                'dataIn': {
                                    roomName: roomName,
                                    newclasif: aNewClasif,
                                }
                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'arrayClassificatorioMultiplayer',
                                'dataIn': {
                                    roomName: roomName,
                                    newclasif: aNewClasif,
                                },
                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'inClasificationMultiPlayer',
                                'dataIn': {
                                    roomName: roomName,
                                },
                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'inClasificationMultiPlayer',
                                'dataIn': {
                                    roomName: roomName,
                                },
                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'inpuntuacionMultiPlayer',
                                'dataIn': {
                                    roomName: roomName,
                                    array: key.preliminarResults
                                },

                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'inpuntuacionMultiPlayer',
                                'dataIn': {
                                    roomName: roomName,
                                    array: key.preliminarResults
                                },
                            })
                        }
                    })
                } else {
                    newArray = PreguntsMillonario.sort(function (a, b) { return (Math.random() - 0.5) });
                    newclasif = []
                    for (let index = 0; index < 5; index++) {
                        const element = newArray[index];
                        let resp = [element.respuesta1, element.respuesta2, element.respuesta3, element.respuesta4]
                        newclasif.push({
                            pregunta: element.pregunta,
                            correcta: parseInt(element.correcta),
                            respuestas: resp,
                        })
                    }
                    nowClasific = true
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'arrayClassificatorio',
                        'dataIn': newclasif,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'arrayClassificatorio',
                        'dataIn': newclasif,
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'inClasification',
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'inClasification',
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'inpuntuacion',
                        'dataIn': millonarioParticipantsPunt,

                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'inpuntuacion',
                        'dataIn': millonarioParticipantsPunt,
                    })
                }

                break;
            case 'puntuacion':
                if (gameType === 'millonario') {
                    millonarioParticipantsPunt.push(dataIn)
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'inpuntuacion',
                        'dataIn': millonarioParticipantsPunt,

                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'inpuntuacion',
                        'dataIn': millonarioParticipantsPunt,
                    })
                } else {
                    millonariosPublicGames.array.map((key, i) => {
                        if (key.roomName === roomName) {
                            millonariosPublicGames.array[i].preliminarResults.push(dataIn)
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'inpuntuacionMultiPlayer',
                                'dataIn': {
                                    roomName: roomName,
                                    array: millonariosPublicGames.array[i].preliminarResults
                                },

                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'inpuntuacionMultiPlayer',
                                'dataIn': {
                                    roomName: roomName,
                                    array: millonariosPublicGames.array[i].preliminarResults
                                },
                            })
                        }
                    })
                }
                break;

            case 'createMillonario':
                min = 0
                max = 4
                let anotherNewArray = []
                for (let index = 1; index < 7; index++) {
                    if (index === 1) {
                        const element = array.level1.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level1.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level1.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level1.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level1.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level1.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        anotherNewArray.push(element, element2, element3, element4, element5, element6)
                    }
                    if (index === 2) {
                        const element = array.level2.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level2.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level2.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level2.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level2.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level2.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        anotherNewArray.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 3) {
                        const element = array.level3.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level3.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level3.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level3.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level3.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level3.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        anotherNewArray.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 4) {
                        const element = array.level4.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level4.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level4.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level4.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level4.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level4.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        anotherNewArray.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 5) {
                        const element = array.level5.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level5.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level5.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level5.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level5.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level5.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        anotherNewArray.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 6) {
                        const element = array.level6.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level6.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level6.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level6.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level6.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level6.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        anotherNewArray.push(element, element2, element3, element4, element5, element6)

                    }


                }
                if (gameType === 'millonario') {
                    for (let index = 1; index < 7; index++) {
                        if (index === 1) {
                            const element = array.level1.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level1.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level1.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level1.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level1.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level1.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArray.push(element, element2, element3, element4, element5, element6)
                        }
                        if (index === 2) {
                            const element = array.level2.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level2.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level2.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level2.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level2.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level2.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArray.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 3) {
                            const element = array.level3.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level3.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level3.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level3.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level3.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level3.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArray.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 4) {
                            const element = array.level4.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level4.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level4.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level4.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level4.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level4.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArray.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 5) {
                            const element = array.level5.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level5.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level5.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level5.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level5.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level5.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArray.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 6) {
                            const element = array.level6.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level6.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level6.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level6.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level6.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level6.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArray.push(element, element2, element3, element4, element5, element6)

                        }


                    }
                    newArray = []
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'playerChoose',
                        'dataIn': { ip: msg.dataIn.participante, array: millonarioParticipantsPunt },
                    })
                    ArrayDePreguntas = newArray
                    setTimeout(() => {
                        millonarioActualTurn = 1
                        nowInMillonario = true
                        ipInPlay = msg.dataIn.participante
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'millonarioActualTurn',
                            'dataIn': millonarioActualTurn,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'millonarioActualTurn',
                            'dataIn': millonarioActualTurn,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'playerChoose',
                            'dataIn': { ip: msg.dataIn.participante, array: millonarioParticipantsPunt },

                        })

                        helpArray = []



                        newQuestion = newArray[millonarioActualTurn - 1 + contHelp]
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'preguntaSiguiente',
                            'dataIn': newQuestion,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'preguntaSiguiente',
                            'dataIn': newQuestion,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'newArray',
                            'dataIn': newQuestion,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'newArray',
                            'dataIn': newQuestion,
                        })
                    }, 12500)
                }
                if (gameType === 'singlePlayer') {
                    let theNewQuestion = {}
                    let newArraySingle = []
                    for (let index = 1; index < 7; index++) {
                        if (index === 1) {
                            const element = array.level1.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level1.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level1.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level1.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level1.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level1.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArraySingle.push(element, element2, element3, element4, element5, element6)
                        }
                        if (index === 2) {
                            const element = array.level2.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level2.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level2.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level2.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level2.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level2.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArraySingle.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 3) {
                            const element = array.level3.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level3.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level3.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level3.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level3.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level3.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArraySingle.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 4) {
                            const element = array.level4.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level4.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level4.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level4.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level4.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level4.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArraySingle.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 5) {
                            const element = array.level5.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level5.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level5.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level5.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level5.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level5.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArraySingle.push(element, element2, element3, element4, element5, element6)

                        }
                        if (index === 6) {
                            const element = array.level6.categoria1[Math.floor(Math.random() * (max - min)) + min];
                            const element2 = array.level6.categoria2[Math.floor(Math.random() * (max - min)) + min];
                            const element3 = array.level6.categoria3[Math.floor(Math.random() * (max - min)) + min];
                            const element4 = array.level6.categoria4[Math.floor(Math.random() * (max - min)) + min];
                            const element5 = array.level6.categoria5[Math.floor(Math.random() * (max - min)) + min];
                            const element6 = array.level6.categoria6[Math.floor(Math.random() * (max - min)) + min];
                            newArraySingle.push(element, element2, element3, element4, element5, element6)

                        }


                    }
                    millonariosGames.array.map((key, i) => {
                        if (!key.state) {
                            theNewQuestion = newArraySingle
                            millonariosGames.array[i] = {
                                state: true,
                                level: 0,
                                array: newArraySingle,
                                helpNumber: 0,
                                category: 'random',
                                playerData: dataIn,
                                helps: {
                                    help1: true,
                                    help2: false,
                                    help3: false,
                                    help4: true,
                                }
                            }
                        } else {
                            millonariosGames.array.push({
                                state: true,
                                level: 0,
                                array: newArraySingle,
                                helpNumber: 0,
                                category: 'random',
                                playerData: dataIn,
                                helps: {
                                    help1: true,
                                    help2: false,
                                    help3: false,
                                    help4: true,
                                }
                            })
                        }
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'playerChoose',
                        'dataIn': { ip: dataIn.ip, array: [] },
                    })
                    setTimeout(() => {
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'juegoSolitario',
                            'dataIn': theNewQuestion,
                        })
                    }, 12000)
                }
                if (gameType === 'multiPlayer') {

                    millonariosPublicGames.array.map((key, i) => {

                        if (key.roomName === roomName) {
                            millonariosPublicGames.array[i].state = true
                            millonariosPublicGames.array[i].inGame = true
                            millonariosPublicGames.array[i].level = 1
                            millonariosPublicGames.array[i].ipPlaying = msg.dataIn.participante
                            millonariosPublicGames.array[i].array = anotherNewArray
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'rooms',
                                'dataIn': {
                                    rooms: millonariosPublicGames.array,
                                }

                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'playerChooseMultiPlayer',
                                'dataIn': { ip: msg.dataIn.participante, array: key.preliminarResults, roomName: roomName },
                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'playerChooseMultiPlayer',
                                'dataIn': { ip: msg.dataIn.participante, array: key.preliminarResults, roomName: roomName },
                            })
                            setTimeout(() => {
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'millonarioActualTurnMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName,
                                        level: key.level,
                                    },

                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'millonarioActualTurnMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName,
                                        level: key.level,
                                    },
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsedMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName,
                                        helpsUsed: key.helps,
                                    },
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsedMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName,
                                        helpsUsed: key.helps,
                                    },
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'preguntaSiguienteMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName,
                                        pregunta: key.array[(key.level - 1) + key.helpNumber],
                                    },
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'preguntaSiguienteMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName,
                                        pregunta: key.array[(key.level - 1) + key.helpNumber],
                                    },
                                })
                            }, 12500)
                        }
                    })
                }
                break;
            case 'nuevaPregunta':
                millonariosPublicGames.array.map((key, i) => {
                    if (key.roomName === roomName) { }
                })
                helpArray = []
                newQuestion = msg.dataIn.pregunta
                socket.broadcast.emit(
                    'millonario', {
                    'actionTodo': 'preguntaSiguiente',
                    'dataIn': msg.dataIn.pregunta,
                })
                socket.emit(
                    'millonario', {
                    'actionTodo': 'preguntaSiguiente',
                    'dataIn': msg.dataIn.pregunta,
                })
                break;
            case 'sendRespuesta':

                if (gameType === 'millonario') {
                    if (msg.dataIn.respuesta == newQuestion.correcta) {
                        millonarioActualTurn = millonarioActualTurn + 1
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'millonarioActualTurn',
                            'dataIn': millonarioActualTurn,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'millonarioActualTurn',
                            'dataIn': millonarioActualTurn,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'sendRespuestaResOk',
                            'dataIn': newQuestion.correcta,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'sendRespuestaResOk',
                            'dataIn': newQuestion.correcta,
                        })
                        newQuestion = newArray[millonarioActualTurn - 1 + contHelp]
                        setTimeout(() => {
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'preguntaSiguiente',
                                'dataIn': newQuestion,
                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'preguntaSiguiente',
                                'dataIn': newQuestion,
                            })
                        }, 5000)

                    } else {
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'sendRespuestaResNo',
                            'dataIn': newQuestion.correcta,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'sendRespuestaResNo',
                            'dataIn': newQuestion.correcta,
                        })
                        contHelp = 0
                        nowInMillonario = false
                        nowClasific = false
                        helpArray = []
                        newArray = []
                        millonarioParticipantsPunt = []
                        helpsUsed = {
                            help1: true,
                            help2: true,
                            help3: true,
                            help4: true,
                        }
                        millonarioActualTurn = 0
                        ipInPlay = ''
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'millonarioActualTurn',
                            'dataIn': millonarioActualTurn,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'millonarioActualTurn',
                            'dataIn': millonarioActualTurn,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'inpuntuacion',
                            'dataIn': millonarioParticipantsPunt,

                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'inpuntuacion',
                            'dataIn': millonarioParticipantsPunt,

                        })
                    }
                } else {
                    if (gameType === 'singlePlayer') {
                        if (msg.dataIn.respuesta == newQuestion.correcta) {
                            millonarioActualTurn = millonarioActualTurn + 1
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'millonarioActualTurn',
                                'dataIn': millonarioActualTurn,
                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'millonarioActualTurn',
                                'dataIn': millonarioActualTurn,
                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'sendRespuestaResOk',
                                'dataIn': newQuestion.correcta,
                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'sendRespuestaResOk',
                                'dataIn': newQuestion.correcta,
                            })
                            newQuestion = newArray[millonarioActualTurn - 1 + contHelp]
                            setTimeout(() => {
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'preguntaSiguiente',
                                    'dataIn': newQuestion,
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'preguntaSiguiente',
                                    'dataIn': newQuestion,
                                })
                            }, 5000)

                        } else {

                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'sendRespuestaResNo',
                                'dataIn': newQuestion.correcta,
                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'sendRespuestaResNo',
                                'dataIn': newQuestion.correcta,
                            })
                            contHelp = 0
                            nowInMillonario = false
                            nowClasific = false
                            helpArray = []
                            newArray = []
                            millonarioParticipantsPunt = []
                            helpsUsed = {
                                help1: true,
                                help2: true,
                                help3: true,
                                help4: true,
                            }
                            millonarioActualTurn = 0
                            ipInPlay = ''
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'millonarioActualTurn',
                                'dataIn': millonarioActualTurn,
                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'millonarioActualTurn',
                                'dataIn': millonarioActualTurn,
                            })
                            socket.emit(
                                'millonario', {
                                'actionTodo': 'inpuntuacion',
                                'dataIn': millonarioParticipantsPunt,

                            })
                            socket.broadcast.emit(
                                'millonario', {
                                'actionTodo': 'inpuntuacion',
                                'dataIn': millonarioParticipantsPunt,

                            })
                        }
                    }
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {

                            if (key.roomName === roomName) {
                                if (msg.dataIn.respuesta == key.array[key.level === 0 ? key.level : key.level - 1 + key.helpNumber].correcta) {
                                    millonariosPublicGames.array[i].level = millonariosPublicGames.array[i].level + 1
                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'millonarioActualTurnMultiPlayer',
                                        'dataIn': {
                                            level: millonariosPublicGames.array[i].level,
                                            roomName: roomName
                                        }
                                    })
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'millonarioActualTurnMultiPlayer',
                                        'dataIn': {
                                            level: millonariosPublicGames.array[i].level,
                                            roomName: roomName
                                        }
                                    })
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'sendRespuestaResOkMultiplayer',
                                        'dataIn': {
                                            correcta: key.array[(key.level - 2) + key.helpNumber].correcta,
                                            roomName: roomName
                                        }
                                    })
                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'sendRespuestaResOkMultiplayer',
                                        'dataIn': {
                                            correcta: key.array[(key.level - 2) + key.helpNumber].correcta,
                                            roomName: roomName
                                        }
                                    })

                                    setTimeout(() => {
                                        socket.broadcast.emit(
                                            'millonario', {
                                            'actionTodo': 'preguntaSiguienteMultiPlayer',
                                            'dataIn': {
                                                roomName: roomName,
                                                pregunta: key.array[(key.level - 1) + key.helpNumber],
                                            },
                                        })
                                        socket.emit(
                                            'millonario', {
                                            'actionTodo': 'preguntaSiguienteMultiPlayer',
                                            'dataIn': {
                                                roomName: roomName,
                                                pregunta: key.array[(key.level - 1) + key.helpNumber],
                                            },
                                        })
                                    }, 5000)

                                } else {
                                    millonariosPublicGames.array.map((key, i) => {
                                        if (key.roomName === roomName) {
                                            socket.broadcast.emit(
                                                'millonario', {
                                                'actionTodo': 'sendRespuestaResNoMultiPlayer',
                                                'dataIn': {
                                                    correcta: key.array[(key.level - 1) + key.helpNumber].correcta,
                                                    roomName: roomName
                                                }
                                            })
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'sendRespuestaResNoMultiPlayer',
                                                'dataIn': {
                                                    correcta: key.array[(key.level - 1) + key.helpNumber].correcta,
                                                    roomName: roomName
                                                }
                                            })
                                            millonariosPublicGames.array[i].helpNumber
                                            millonariosPublicGames.array[i].clasification = false
                                            millonariosPublicGames.array[i].helps = []
                                            millonariosPublicGames.array[i].array = []
                                            millonariosPublicGames.array[i].arrayClassificatorio = []
                                            millonariosPublicGames.array[i].level = 0
                                            millonariosPublicGames.array[i].ipPlaying = ''
                                            millonariosPublicGames.array[i].state = false
                                            socket.broadcast.emit(
                                                'millonario', {
                                                'actionTodo': 'rooms',
                                                'dataIn': {
                                                    rooms: millonariosPublicGames.array,
                                                }
                                            })
                                            socket.emit(
                                                'millonario', {
                                                'actionTodo': 'rooms',
                                                'dataIn': {
                                                    rooms: millonariosPublicGames.array,
                                                }
                                            })
                                            cleanArrays()
                                        }

                                    })


                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'offRoom',
                                        'dataIn': roomName,
                                    })
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'offRoom',
                                        'dataIn': roomName,
                                    })
                                }
                            }
                        })

                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'rooms',
                            'dataIn': {
                                rooms: millonariosPublicGames.array,
                            }

                        })
                    }

                }

                break;
            case 'logout':
                checkUsers(socket.id)
                break;
            case 'inChoosing':
                if (gameType === 'multiPlayer') {
                    millonariosPublicGames.array.map((key, i) => {
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'inChoosedMultiPlayer',
                            'dataIn': {
                                choosed: msg.dataIn,
                                roomName: roomName
                            }
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'inChoosedMultiPlayer',
                            'dataIn': {
                                choosed: msg.dataIn,
                                roomName: roomName
                            }
                        })
                    })
                } else {
                    lastChoose = msg.dataIn
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'inChoosed',
                        'dataIn': msg.dataIn,
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'inChoosed',
                        'dataIn': msg.dataIn,
                    })
                }

                break;
            case 'goodAnwser':
                millonariosGames.array.map((key, i) => {
                    if (key.state) {

                        if (key.playerData.ip == dataIn.ip || key.playerData.participante.ip == dataIn.ip) {
                            millonariosGames.array[i].level = millonariosGames.array[i].level + 1
                        }
                    }
                })
                break;
            case 'gameOver':
                millonariosGames.array.map((key, i) => {
                    if (key.state) {
                        console.log(key, 'over');
                        if (parseInt(key.playerData.ip) == parseInt(dataIn.ip) || parseInt(key.playerData.participante.ip) == parseInt(dataIn.ip)) {

                            millonariosGames.array[i].state = false
                        }
                    }
                })
                cleanArrays()
                break;

            case 'help1':
                if (gameType === 'millonario') {
                    helpsUsed.help1 = false

                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'stopReloj',
                    })

                    socket.emit(
                        'millonario', {
                        'actionTodo': 'helpsUsed',
                        'dataIn': helpsUsed,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'helpsUsed',
                        'dataIn': helpsUsed,
                    })
                    setTimeout(() => {

                        let haveTobeen = newQuestion.correcta
                        let preguntasNew = []
                        min = 0
                        max = 3
                        let theRandom = () => {
                            let resNow = Math.floor(Math.random() * (max - min)) + min
                            if (resNow === parseInt(haveTobeen)) {
                                if (resNow + 1 === 4) {
                                    resNow = resNow - 1
                                } else {
                                    resNow = resNow + 1
                                }
                            }

                            return resNow
                        }
                        let getRandom = theRandom()

                        if (getRandom === 0 || parseInt(haveTobeen) === 0) {
                            console.log
                        } else {
                            newQuestion.respuesta1 = ''

                        }
                        if (getRandom === 1 || parseInt(haveTobeen) === 1) {
                            console.log
                        } else {
                            newQuestion.respuesta2 = ''
                        }
                        if (getRandom === 2 || parseInt(haveTobeen) === 2) {
                            console.log
                        } else {
                            newQuestion.respuesta3 = ''
                        }
                        if (getRandom === 3 || parseInt(haveTobeen) === 3) {
                            console.log
                        } else {
                            newQuestion.respuesta4 = ''
                        }


                        socket.emit(
                            'millonario', {
                            'actionTodo': 'preguntaSiguiente',
                            'dataIn': newQuestion,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'preguntaSiguiente',
                            'dataIn': newQuestion,
                        })

                        contHelp = 0
                    }, 3500)
                } else {
                    if (gameType === 'singlePlayer') {
                        console.log('help1', dataIn);
                        millonariosGames.array.map((key, i) => {

                            if (key.state) {
                                if (parseInt(key.playerData.ip) == parseInt(dataIn.ip) || key.playerData.participante.ip == parseInt(dataIn.ip)) {
                                    millonariosGames.array[i].helps.help1 = false
                                }
                            }
                        })
                    }
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName && key.state) {
                                let helpAux = millonariosPublicGames.array[i].helps
                                helpAux.help1 = false
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'stopRelojMultiPlayer',
                                    'dataIn': roomName
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsedMultiPlayer',
                                    'dataIn': {
                                        helps: helpAux,
                                        roomName: roomName
                                    },
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsedMultiPlayer',
                                    'dataIn': {
                                        helps: helpAux,
                                        roomName: roomName
                                    },
                                })
                                millonariosPublicGames.array[i].helps = helpAux
                                setTimeout(() => {
                                    let haveTobeen = key.array[key.level - 1].correcta

                                    min = 0
                                    max = 3
                                    let theRandom = () => {
                                        let resNow = Math.floor(Math.random() * (max - min)) + min
                                        if (resNow === parseInt(haveTobeen)) {
                                            if (resNow + 1 === 4) {
                                                resNow = resNow - 1
                                            } else {
                                                resNow = resNow + 1
                                            }
                                        }
                                        return resNow
                                    }
                                    let getRandom = theRandom()

                                    if (getRandom === 0 || parseInt(haveTobeen) === 0) {
                                        console.log
                                    } else {
                                        millonariosPublicGames.array[i].array[key.level - 1].respuesta1 = ''
                                    }
                                    if (getRandom === 1 || parseInt(haveTobeen) === 1) {
                                        console.log
                                    } else {
                                        millonariosPublicGames.array[i].array[key.level - 1].respuesta2 = ''
                                    }
                                    if (getRandom === 2 || parseInt(haveTobeen) === 2) {
                                        console.log
                                    } else {
                                        millonariosPublicGames.array[i].array[key.level - 1].respuesta3 = ''
                                    }
                                    if (getRandom === 3 || parseInt(haveTobeen) === 3) {
                                        console.log
                                    } else {
                                        millonariosPublicGames.array[i].array[key.level - 1].respuesta4 = ''
                                    }

                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'preguntaSiguienteMultiPlayer',
                                        'dataIn': {
                                            roomName: roomName,
                                            pregunta: millonariosPublicGames.array[i].array[key.level - 1],
                                        },
                                    })
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'preguntaSiguienteMultiPlayer',
                                        'dataIn': {
                                            roomName: roomName,
                                            pregunta: millonariosPublicGames.array[i].array[key.level - 1],
                                        },
                                    })
                                }, 3500)
                            }
                        })
                    }


                }


                break;
            case 'help2':

                if (gameType === 'millonario') {
                    key.help2 = false
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'helpsUsed',
                        'dataIn': helpsUsed,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'helpsUsed',
                        'dataIn': helpsUsed,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'stopReloj',
                    })

                    setTimeout(() => {
                        helpsUsed.help2 = false
                        socket.broadcast.emit(
                            'millonario', {
                            'dataIn': dataIn,
                            'actionTodo': 'helpRequiredOne',
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                        contHelp = 0
                    }, 3500)

                } else {
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName) {
                                millonariosPublicGames.array[i].helps.help2 = false
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsedMultiPlayer',
                                    'dataIn': {
                                        helps: millonariosPublicGames.array[i].helps,
                                        roomName: roomName
                                    }
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'stopRelojMultiPlayer',
                                    'dataIn': roomName
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'stopRelojMultiPlayer',
                                    'dataIn': roomName
                                })

                                setTimeout(() => {
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'dataIn': {
                                            'roomName': roomName,
                                            'user': dataIn
                                        },
                                        'actionTodo': 'helpRequiredOneMultiplayer',
                                    })
                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'helpsUsedMultiPlayer',
                                        'dataIn': {
                                            helps: millonariosPublicGames.array[i].helps,
                                            roomName: roomName
                                        }
                                    })
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'helpsUsedMultiPlayer',
                                        'dataIn': {
                                            helps: millonariosPublicGames.array[i].helps,
                                            roomName: roomName
                                        }
                                    })
                                    contHelp = 0
                                }, 3500)
                            }
                        })

                    }
                }

                break;
            case 'help3':
                if (gameType === 'millonario') {
                    helpsUsed.help3 = false
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'helpsUsed',
                        'dataIn': helpsUsed,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'helpsUsed',
                        'dataIn': helpsUsed,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'stopReloj',
                    })
                    setTimeout(() => {
                        helpArray = []
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'helpRequired',
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                        contHelp = 0
                    }, 3500)

                } else {
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName) {
                                millonariosPublicGames.array[i].helps.help3 = false
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsedMultiPlayer',
                                    'dataIn': {
                                        helps: millonariosPublicGames.array[i].helps,
                                        roomName: roomName
                                    },
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'helpsUsedMultiPlayer',
                                    'dataIn': {
                                        helps: millonariosPublicGames.array[i].helps,
                                        roomName: roomName
                                    },
                                })
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'stopRelojMultiPlayer',
                                    'dataIn': roomName
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'stopRelojMultiPlayer',
                                    'dataIn': roomName
                                })
                                setTimeout(() => {
                                    helpArray = []
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'helpRequiredMultiplayer',
                                        'dataIn': roomName
                                    })
                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'helpsUsedMultiPlayer',
                                        'dataIn': {
                                            helps: millonariosPublicGames.array[i].helps,
                                            roomName: roomName
                                        }
                                    })
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'helpsUsedMultiPlayer',
                                        'dataIn': {
                                            helps: millonariosPublicGames.array[i].helps,
                                            roomName: roomName
                                        }
                                    })

                                }, 3500)
                            }
                        })
                    }
                }
                break;

            case 'help4':
                if (gameType === 'millonario') {
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'stopReloj',
                    })
                    setTimeout(() => {
                        contHelp = 1

                        helpsUsed.help4 = false
                        newQuestion = newArray[millonarioActualTurn - 1 + contHelp]
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'preguntaSiguiente',
                            'dataIn': newQuestion,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'preguntaSiguiente',
                            'dataIn': newQuestion,
                        })
                        socket.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                        socket.broadcast.emit(
                            'millonario', {
                            'actionTodo': 'helpsUsed',
                            'dataIn': helpsUsed,
                        })
                    }, 3500)
                } else {
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName) {
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'stopRelojMultiPlayer',
                                    'dataIn': roomName
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'stopRelojMultiPlayer',
                                    'dataIn': roomName
                                })
                                millonariosPublicGames.array[i].helpNumber = 1
                                millonariosPublicGames.array[i].helps.help4 = false
                                setTimeout(() => {
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'preguntaSiguienteMultiPlayer',
                                        'dataIn': {
                                            roomName: roomName,
                                            pregunta: key.array[(key.level - 1) + key.helpNumber],
                                        },
                                    })
                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'preguntaSiguienteMultiPlayer',
                                        'dataIn': {
                                            roomName: roomName,
                                            pregunta: key.array[(key.level - 1) + key.helpNumber],
                                        },
                                    })
                                    socket.emit(
                                        'millonario', {
                                        'actionTodo': 'helpsUsedMultiPlayer',
                                        'dataIn': {
                                            helps: millonariosPublicGames.array[i].helps,
                                            roomName: roomName
                                        },
                                    })
                                    socket.broadcast.emit(
                                        'millonario', {
                                        'actionTodo': 'helpsUsedMultiPlayer',
                                        'dataIn': {
                                            helps: millonariosPublicGames.array[i].helps,
                                            roomName: roomName
                                        },
                                    })
                                }, 3500)
                            }
                        })
                    }
                    if (gameType === 'singlePlayer') {
                        console.log(dataIn, 'data', millonariosGames);
                        millonariosGames.array.map((key, i) => {
                            if (key.state) {
                                console.log(key, 'datas', i);

                                if (parseInt(key.playerData.ip) == parseInt(dataIn.ip) || key.playerData.participante.ip == parseInt(dataIn.ip)) {
                                    console.log(key, 'datas', i);

                                    millonariosGames.array[i].helps.help4 = false
                                    let newwArray = []
                                    for (let index = 1; index < key.array.length; index++) {
                                        const element = key.array[index];
                                        newwArray.push(element)
                                    }
                                    millonariosGames.array[i].array = newwArray
                                }
                            }
                        })
                    }
                }
                break;
            case 'helping':
                if (gameType === 'millonario') {
                    helpArray.push(msg.dataIn)
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'helpingRes',
                        'dataIn': helpArray,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'helpingRes',
                        'dataIn': helpArray,
                    })
                } else {
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName) {
                                let helpArrayAux = []
                                helpArrayAux.push(msg.dataIn)
                                millonariosPublicGames.array[i].helpArray = helpArrayAux
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'helpingResMultiPlayer',
                                    'dataIn': {
                                        helpArray: millonariosPublicGames.array[i].helpArray,
                                        roomName: roomName
                                    },
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'helpingResMultiPlayer',
                                    'dataIn': {
                                        helpArray: millonariosPublicGames.array[i].helpArray,
                                        roomName: roomName
                                    },
                                })
                            }
                        })
                    }
                }

                break;
            case 'EndMillonario':
                if (gameType === 'millonario') {
                    millonarioParticipants = []
                    contHelp = 0
                    nowInMillonario = false
                    nowClasific = false
                    helpArray = []
                    millonarioParticipantsPunt = []
                    helpsUsed = {
                        help1: true,
                        help2: true,
                        help3: true,
                        help4: true,
                    }
                    newArray = []
                    millonarioActualTurn = 0
                    ipInPlay = ''
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'millonarioActualTurn',
                        'dataIn': millonarioActualTurn,
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'millonarioActualTurn',
                        'dataIn': millonarioActualTurn,
                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'inpuntuacion',
                        'dataIn': millonarioParticipantsPunt,

                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'inpuntuacion',
                        'dataIn': millonarioParticipantsPunt,

                    })
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'offGame',
                    })
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'offGame',
                    })

                } else {
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName) {
                                millonariosPublicGames.array[i].state = false
                                socket.emit(
                                    'millonario', {
                                    'actionTodo': 'offGameMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName
                                    }
                                })
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'offGameMultiPlayer',
                                    'dataIn': {
                                        roomName: roomName
                                    }
                                })
                            }

                        })
                    }
                }

                break;
            case 'giveHelp':
                if (gameType === 'millonario') {
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'helpingResYes',
                        'dataIn': dataIn,
                    })
                } else {
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName) {
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'helpingResYesMultiPlayer',
                                    'dataIn': {
                                        'roomName': roomName,
                                        'res': dataIn
                                    }
                                })

                            }
                        })
                    }
                }

                break;
            case 'noHelp':
                if (gameType === 'millonario') {
                    socket.broadcast.emit(
                        'millonario', {
                        'actionTodo': 'helpingResNo',
                        'dataIn': dataIn,
                    })
                } else {
                    if (gameType === 'multiPlayer') {
                        millonariosPublicGames.array.map((key, i) => {
                            if (key.roomName === roomName) {
                                socket.broadcast.emit(
                                    'millonario', {
                                    'actionTodo': 'helpingResNoMultiPlayer',
                                    'dataIn': {
                                        'roomName': roomName,
                                    }
                                })

                            }
                        })
                    }
                }

                break;
            case 'singlePlay':

                min = 0
                max = 4
                let theNewQuestionSingle = {}
                let newArraySingle = []
                for (let index = 1; index < 7; index++) {
                    if (index === 1) {
                        const element = array.level1.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level1.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level1.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level1.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level1.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level1.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        newArraySingle.push(element, element2, element3, element4, element5, element6)
                    }
                    if (index === 2) {
                        const element = array.level2.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level2.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level2.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level2.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level2.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level2.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        newArraySingle.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 3) {
                        const element = array.level3.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level3.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level3.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level3.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level3.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level3.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        newArraySingle.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 4) {
                        const element = array.level4.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level4.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level4.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level4.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level4.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level4.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        newArraySingle.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 5) {
                        const element = array.level5.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level5.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level5.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level5.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level5.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level5.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        newArraySingle.push(element, element2, element3, element4, element5, element6)

                    }
                    if (index === 6) {
                        const element = array.level6.categoria1[Math.floor(Math.random() * (max - min)) + min];
                        const element2 = array.level6.categoria2[Math.floor(Math.random() * (max - min)) + min];
                        const element3 = array.level6.categoria3[Math.floor(Math.random() * (max - min)) + min];
                        const element4 = array.level6.categoria4[Math.floor(Math.random() * (max - min)) + min];
                        const element5 = array.level6.categoria5[Math.floor(Math.random() * (max - min)) + min];
                        const element6 = array.level6.categoria6[Math.floor(Math.random() * (max - min)) + min];
                        newArraySingle.push(element, element2, element3, element4, element5, element6)

                    }


                }
                if (millonariosGames.games === 0) {
                    millonariosGames.games = 1
                    theNewQuestionSingle = newArraySingle[0]
                    millonariosGames.array = [{

                        state: true,
                        level: 0,
                        array: newArraySingle,
                        helpNumber: 0,
                        category: 'random',
                        playerData: dataIn,
                        helps: {
                            help1: true,
                            help2: false,
                            help3: false,
                            help4: true,
                        }
                    }
                    ]
                } else {

                    theNewQuestionSingle = newArraySingle
                    millonariosGames.array[millonariosGames.length] = {
                        state: true,
                        level: 0,
                        array: newArraySingle,
                        helpNumber: 0,
                        category: 'random',
                        playerData: dataIn,
                        helps: {
                            help1: true,
                            help2: false,
                            help3: false,
                            help4: true,
                        }
                    }
                }
                socket.emit(
                    'millonario', {
                    'actionTodo': 'playerChooseSingle',
                    'dataIn': { ip: dataIn.participante.ip, array: [] },
                })
                setTimeout(() => {
                    socket.emit(
                        'millonario', {
                        'actionTodo': 'juegoSolitario',
                        'dataIn': newArraySingle,
                    })
                }, 7000)
                break;
        }
    })
    if (inVideo === false) {
        console.log
    }

    if (inGame === true) {
        socket.emit('createdGame', true)
    }

    
}