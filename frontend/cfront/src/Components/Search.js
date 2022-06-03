import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


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
    
    }
}

export default Search;
