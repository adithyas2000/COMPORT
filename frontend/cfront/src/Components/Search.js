import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const lhost='http://localhost:5000/';

function Search() {
    const [stext,setStext]=useState('');
  return (
    <div id = 'container' style={{width:700}}>
      <Form id='searchForm' onSubmit={formSubmit}>
        <Form.Group className='mb-3' controlId='searchText'>
          <Form.Label>Search for an item</Form.Label>
          <Form.Control type='text' onChange={e=>{onStextChange(e.target.value)}}/>
          
        </Form.Group>
        <Button variant='primary' type='submit'>Search</Button>
      </Form>
    </div>
  );

    function onStextChange(val){
        setStext(val)
    }
    function formSubmit(event){
    event.preventDefault();
    axios.get(lhost+'search?sitem='+stext)
        .then(res=>{
          let jsonstr=JSON.stringify(res.data)
          console.log("AXIOS: "+jsonstr)
        })
        .catch(err=>{console.error("AXOS ERROR MSG :"+err.message+"\nAXIOS ERROR REQ:"+err.request+"\nAXIOS ERROR RES:"+err.response)})
    }
}

export default Search;
