import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import {useState} from 'react';
function TestPage(){
    const[remoteUrl,setRemoteUrl]=useState("NULL");
    return(
        <div id='container'>
            <Form id='testURL' onSubmit={onSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Control type='text' required onChange={e=>{onEditURL(e.target.value)}} value={remoteUrl}/>
                    <Button variant='primary' type='submit'>Run</Button>
                </Form.Group>

            </Form>
        </div>
    )

    function onSubmit(event){
        event.preventDefault();
        console.log("Connecting to : "+remoteUrl);
        axios.get(remoteUrl)
        .then(res=>{
            let jstr = JSON.stringify(res.data);
            console.log("AXIOS: "+jstr);
        })
        .catch(err=>{
            console.error("AXOS ERROR MSG :"+err.message+"\nAXIOS ERROR REQ:"+err.request+"\nAXIOS ERROR RES:"+err.response);
        })
    }
    function onEditURL(link){
        setRemoteUrl(link);
    }
}


export default TestPage;