import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/')
        }
    })

    const handleLogin = async () => {
        console.warn(email, password);
        let result = await fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        result = await result.json()
        console.log(result);
        if (result.auth) {
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", JSON.stringify(result.auth));
            navigate('/');
        } else {
            alert('Please Enter Correct Details !!');
        }
    }

    return (
        <div className="login">
            <h1> Login </h1>

            <input
                className="inputBox"
                type="text"
                placeholder="Enter Your Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="inputBox"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin} className="btn" type="button"> Login </button>
        </div>
    )
}

export default Login;