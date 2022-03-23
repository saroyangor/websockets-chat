import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";

const App = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')

    function connect(e) {
        e.preventDefault()
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }

        socket.current.onmessage = event => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }

        socket.current.onclose = () => {
            console.log('Socket has been closed')
        }

        socket.current.onerror = () => {
            console.log('Socket have any errors')
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: "message"
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div className='center'>
                <form className="form" onSubmit={connect}>
                    <input
                        type="text"
                        placeholder='Введите свое имя'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <button>Войти</button>
                </form>
            </div>
        )
    }


    return (
        <div className='center'>
            <div>
                <form className="form" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                    <button>Отправить</button>
                </form>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className='connection'>Пользователь {mess.username} подключился</div>
                                : <div className='message'>{mess.username}. {mess.message}</div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
