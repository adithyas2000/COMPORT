import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import env from 'react-dotenv';

const lhost = env.LOCALHOST;
console.log("ENV LHOST: " + lhost);


function UserSignup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [spinning, setspinning] = useState(false);
    return (
        <div class="border border-5 border-primary shadow bg-white p-5" style={{ width: '80%', padding: 50, margin:'10%', borderRadius: 50 }}>
            <Form id='loginForm' onSubmit={signup}>
                <Form.Group className='mb-3' id='groupEmail'>
                    <Form.Label id='lblEmail'>Email</Form.Label>
                    <Form.Control disabled={spinning} type='text' id='txtEmail' onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='groupPassword'>
                    <Form.Label id='lblPass'>Password</Form.Label>
                    <Form.Control disabled={spinning} type='password' id='txtPass' onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='groupConfPassword'>
                    <Form.Label id='lblConfPass'>Confirm Password</Form.Label>
                    <Form.Control disabled={spinning} type='password' id='txtConfPass' onChange={e => setConfirmPass(e.target.value)} />
                </Form.Group>
                <Button disabled={spinning} variant='primary' type='submit'>
                    {spinning && <span class="spinner-border spinner-border-sm" style={{ marginRight: '10px' }} role="status" aria-hidden="true"></span>}
                    {spinning && <span class="sr-only">Signing up...</span>}
                    {!spinning && <span class="sr-only">Sign Up</span>}
                </Button>
            </Form>
            <br />
            <a href='/userWelcome'>Already have an account? Login</a>

        </div>
    )

    function signup(event) {
        event.preventDefault();
        setspinning(true);
        try {
            var form = new FormData();
            form.append("email", email);

            for (var rec of form.entries()) {
                console.log(rec);
            }
            if ((password === confirmPass) && (password != "")) {
                form.append("password", password);
                const res = axios.post(lhost + 'signup/', form).then(
                    resp => {
                        setspinning(false);
                        if ("Error" in resp.data) {
                            alert(resp.data["Error"])
                        }
                        console.log(resp.data)
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

export default UserSignup;