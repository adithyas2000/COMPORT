import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Component, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import env from 'react-dotenv';

const lhost = env.LOCALHOST;




function UserWelcome() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    if(sessionStorage.getItem("auth")===null){
        return (
        
        
            <div style={{ alignItems: 'center',width:'100%' }}>
                <div class="shadow-lg bg-white rounded p-5" style={{ width: '50%', alignSelf: 'center',marginLeft:'25%',marginTop:'10%' }}>
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
                    <br/>
                    <a href='/userSignup'>No account? Signup</a>
    
                </div>
            </div>
        );
    }else{
        return <Navigate to="/search"/>
    }
   

    function login(event) {
        event.preventDefault();
        try {
            var form = new FormData();
            form.append("email",email);
            
            for(var rec of form.entries()){
                console.log(rec);
            }
            if(password!==""){
                form.append("password",password);
                const res = axios.post(lhost + 'login/',form,{headers:{'withCredentials':true}}).then(
                    resp=>{
                        console.log(resp.data);
                        if("Error" in resp.data){
                            console.log(resp.data["Error"])
                            alert(resp.data["Error"])
                        }else{
                            window.sessionStorage.setItem("auth",resp.data["auth"]);
                            var email="";
                            email=resp.data["email"];
                            var name=email.split('@')[0]
                            window.sessionStorage.setItem("name",name);
                            window.location.reload();
                            var keys=Object.keys(sessionStorage);
                            console.log(keys);
                        }
                        
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