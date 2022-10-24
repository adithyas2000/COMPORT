import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import env from 'react-dotenv';

const lhost = env.LOCALHOST;



function UserWelcome() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div style={{ alignItems: 'center' }}>
            <div style={{ width: '50%', alignSelf: 'center' }}>
                <Form id='loginForm' onSubmit={login}>
                    <Form.Group className='mb-3' id='groupEmail'>
                        <Form.Label id='lblEmail'>Email</Form.Label>
                        <Form.Control required type='email' id='txtEmail' onChange={e=>setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-3' id='groupPassword'>
                        <Form.Label id='lblPass'>Password</Form.Label>
                        <Form.Control required type='password' id='txtPass' onChange={e=>setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant='primary' type='submit'>Login</Button>
                </Form>
                <a href='/userSignup'>No account? Signup</a>

            </div>
        </div>
    );

    function login(event) {
        event.preventDefault();
        try {
            var form = new FormData();
            form.append("email",email);
            
            for(var rec of form.entries()){
                console.log(rec);
            }
            if(password!=""){
                form.append("password",password);
                const res = axios.post(lhost + 'login/',form).then(
                    resp=>{
                        console.log(resp.data)
                    }
                )
            }else{
                alert("Passwords do not match or is empty");
            }
            
        } catch (err) {
            console.log(err)
        }
    }
}

export default UserWelcome;