import React from "react";
import { useNavigate } from "react-router-dom"; //https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router

export default function LogIn() {
    const [loginMode , setLoginMode] = React.useState(0)
    const navigate = useNavigate();

    function toRegister() {
        setLoginMode(0)
    }

    function toLogin() {
        setLoginMode(1)
    }

    function simulateLogin() {
        navigate("/planner")
    }

    //Register States
    const [registerFieldUsername , setRegisterFieldUsername] = React.useState("");
    const [registerFieldPassword , setRegisterFieldPassword] = React.useState("");
    
    function handleRegisterUsername() {
            setRegisterFieldUsername(event.target.value)
    }

    function handleRegisterPassword() {
        setRegisterFieldPassword(event.target.value)
}

    async function registerUser() {
        createJWTKey()
        const JWTKey = window.localStorage.getItem("JWTKey");
        const user = {"username" : registerFieldUsername, "password" : registerFieldPassword , "JWTKey" : JWTKey};
        try {
        const response = await fetch("http://localhost:3000/register" , {
            method: "POST",
            body : JSON.stringify(user),
            headers: {
                "Content-type" : "application/json; charset=UTF-8"
            }
        })
        .then((res) => {return res.json()})
        .then((res) => {if (res.success) {
            window.localStorage.setItem("accessKey" , res.data)
            loginUserPassthrough()

        }
            else {
                alert(res.message);
            }
    })
        }
        catch {
            alert("Error")
        }
    }

    //Login States
    const [loginFieldUsername , setLoginFieldUsername] = React.useState("");
    const [loginFieldPassword , setLoginFieldPassword] = React.useState("");

    function handleLoginUsername() {
        setLoginFieldUsername(event.target.value)
    }

    function handleLoginPassword() {
        setLoginFieldPassword(event.target.value)
    }

    async function loginUser() {
        const JWTKey = window.localStorage.getItem("JWTKey");
        const accessKey = window.localStorage.getItem("accessKey");
        const user = {"username" : loginFieldUsername, "password" : loginFieldPassword , "JWTKey" : JWTKey}
        try {
            const response = await fetch("http://localhost:3000/load" , {
            method: "PUT",
            body : JSON.stringify(user),
            headers: new Headers({
                "Content-type" : "application/json; charset=UTF-8",
                "Authorization" : `Bearer ${accessKey}`
            })
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if (res.success == true) {
                window.sessionStorage.setItem("user" , JSON.stringify(user));
                window.localStorage.setItem("userData", JSON.stringify(res.data))
                navigate("/planner")
            }
            else {
                alert("Invalid Login")
            }
        })
        }
        catch (e) {
            console.log("Error", e.stack);
            console.log("Error", e.name);
            console.log("Error", e.message)
            alert("Error in Auth")
        }
    }

    async function loginUserPassthrough() {
        const JWTKey = window.localStorage.getItem("JWTKey");
        const accessKey = window.localStorage.getItem("accessKey");
        const user = {"username" : registerFieldUsername, "password" : registerFieldPassword , "JWTKey" : JWTKey}
        console.log(user)
        try {
            const response = await fetch("http://localhost:3000/load" , {
            method: "PUT",
            body : JSON.stringify(user),
            headers: new Headers({
                "Content-type" : "application/json; charset=UTF-8",
                "Authorization" : `Bearer ${accessKey}`
            })
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if (res.success == true) {
                window.sessionStorage.setItem("user" , JSON.stringify(user));
                window.localStorage.setItem("userData", res.data)
                navigate("/planner")
            }
        })
        }
        catch (e) {
            console.log("Error", e.stack);
            console.log("Error", e.name);
            console.log("Error", e.message)
            alert("Error in Auth")
        }
    }

    //Local Storage State
    function createJWTKey() {
        if (window.localStorage.getItem("JWTKey") == null) {
            const newKey = Math.random().toString(36).slice(2) //source: https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript

            window.localStorage.setItem("JWTKey" , newKey);
        }
    }

    return (
        <>
            <div className="login-container-main">
                <div className="login-tabs-container">
                    <div className="login-register-tab" style={{"backgroundColor": loginMode == 0 ? "#778DA9" : "grey"}} onClick={toRegister}>
                        REGISTER
                    </div>
                    <div className="login-login-tab" style={{"backgroundColor": loginMode == 1 ? "#778DA9" : "grey"}} onClick={toLogin}>
                        LOG-IN
                    </div>
                </div>
                <div className="login-credentials-register-container">
                    
                    <form className="login-register-form" name="login-register-form" style={{"display": loginMode == 0 ? "block" : "none"}}>
                        <label>
                            <input className= "login-element" value={registerFieldUsername} type="username" name="registerUsername" id="registerUsername" placeholder="USERNAME" onChange={handleRegisterUsername}></input>
                        </label>
                        <label>
                            <input className= "login-element" value={registerFieldPassword} type="password" name="registerPassword" id="registerPassword" placeholder="PASSWORD" onChange={handleRegisterPassword}></input>
                        </label>
                        <label>
                            <button className="login-element" type="button" onClick={registerUser}>REGISTER</button>
                        </label>
                    </form>

                    <form className="login-login-form" name="login-login-form" style={{"display": loginMode == 1 ? "block" : "none"}}>
                        <label>
                            <input className= "login-element" value={loginFieldUsername} type="username" name="loginUsername" id="loginUsername" placeholder="USERNAME" onChange={handleLoginUsername}></input>
                        </label>
                        <label>
                            <input className= "login-element" value={loginFieldPassword} type="password" name="loginPassword" id="loginPassword" placeholder="PASSWORD" onChange={handleLoginPassword}></input>
                        </label>
                        <label>
                            <button type="button" className="login-element" onClick={loginUser}>LOG-IN</button>
                        </label>
                    </form>
                </div>
            </div>
        </>
    )
}