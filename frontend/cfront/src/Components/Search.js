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
    axios.get(lhost+'search?a='+stext)
        .then(res=>console.log("AXIOS: "+res.data.a))
        .catch(err=>{console.error("AXOS ERROR\n"+err.message)})
    }
}

export default Search;
