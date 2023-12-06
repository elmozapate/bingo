function Objetos() {
    return ({
         millonariosGames : {
            games: 0,
            array: [
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
        },
        
         millonariosPublicGames : {
            games: 0,
            array: [
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
        }
    })
}
exports.Objetos = Objetos;