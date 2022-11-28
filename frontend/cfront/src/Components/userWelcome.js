import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Component, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import env from 'react-dotenv';

const lhost = env.LOCALHOST;




function UserWelcome() {
    const [spinning,setspinning]=useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    if (sessionStorage.getItem("auth") === null) {
        return (


            <div style={{ alignItems: 'center', width: '100%', marginTop:'10%' }}>
                <div id='mainContainer' class="border border-5 border-primary shadow-lg bg-white">
                    <Form id='loginForm' onSubmit={login}>
                        <Form.Group className='mb-3' id='groupEmail'>
                            <Form.Label id='lblEmail'>Email</Form.Label>
                            <Form.Control  disabled={spinning} required type='email' id='txtEmail' onChange={e => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className='mb-3' id='groupPassword'>
                            <Form.Label id='lblPass'>Password</Form.Label>
                            <Form.Control  disabled={spinning} required type='password' id='txtPass' onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button disabled={spinning} variant='primary' type='submit'>
                            {spinning && <span class="spinner-border spinner-border-sm" style={{ marginRight: '10px' }} role="status" aria-hidden="true"></span>}
                            {spinning && <span class="sr-only">Logging in...</span>}
                            {!spinning && <span class="sr-only">Login</span>}
                        </Button>
                    </Form>
                    <br />
                    <a href='/userSignup'>No account? Signup</a>

                </div>
            </div>
        );
    } else {
        return <Navigate to="/search" />
    }


    function login(event) {
        event.preventDefault();
        setspinning(true);
        try {
            var form = new FormData();
            form.append("email", email);

            for (var rec of form.entries()) {
                console.log(rec);
            }
            if (password !== "") {
                form.append("password", password);
                const res = axios.post(lhost + 'login/', form, { headers: { 'withCredentials': true } }).then(
                    resp => {
                        setspinning(false);
                        console.log(resp.data);
                        if ("Error" in resp.data) {
                            console.log(resp.data["Error"])
                            alert(resp.data["Error"])
                        } else {
                            window.sessionStorage.setItem("auth", resp.data["auth"]);
                            var email = "";
                            email = resp.data["email"];
                            var name = email.split('@')[0]
                            window.sessionStorage.setItem("name", name);
                            window.location.reload();
                            var keys = Object.keys(sessionStorage);
                            console.log(keys);
                        }

                    }

                )
            } else {
                alert("Passwords do not match or is empty");
            }

        } catch (err) {
            console.log(err)
        }
    }
}

export default UserWelcome;