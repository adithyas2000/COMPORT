import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import {useState} from 'react';
import { Link } from 'react-router-dom';

function UserWelcome(){
    return(
        <div style={{alignItems:'center'}}>
            <div style={{width:'50%',alignSelf:'center'}}>
                <Form id='loginForm'>
                    <Form.Group className='mb-3' id='groupEmail'>
                        <Form.Label id='lblEmail'>Email</Form.Label>
                        <Form.Control type='text' id='txtEmail'/>
                    </Form.Group>
                    <Form.Group className='mb-3' id='groupPassword'>
                        <Form.Label id='lblPass'>Password</Form.Label>
                        <Form.Control type='password' id='txtPass'/>
                    </Form.Group>
                    <Button variant='primary' type='submit'>Login</Button>
                </Form>
                <a href='/userSignup'>No account? Signup</a>
                
            </div>
        </div>
    )
}

export default UserWelcome;