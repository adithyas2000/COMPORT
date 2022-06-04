import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table'
import axios from 'axios';

const lhost='http://localhost:5000/';

function Search() {
    const [stext,setStext]=useState('');
    const[dataState,setDataState]=useState(false);
    const [resdata,setResdata]=useState(null);
    let dat=null;

    useEffect(()=>{
      if(resdata!=null){
        setDataState(true);
        console.log("NOT NULL IN EFFECT");
      }else{
        console.log("NULL IN EFFECT!");
      }
    },[resdata]);

  return (
    
    <div id = 'container' style={{width:700}}>
      <Form id='searchForm' onSubmit={formSubmit}>
        <Form.Group className='mb-3' controlId='searchText'>
          <Form.Label>Search for an item</Form.Label>
          <Form.Control type='text' onChange={e=>{onStextChange(e.target.value)}}/>
        </Form.Group>
        <Button variant='primary' type='submit'>Search</Button>
      </Form>
      {dataState && <Table striped bordered hover id='resTable'><thead><tr><th>Item</th><th>Price</th></tr></thead><tbody>{<DataTable/>}</tbody></Table>}
    </div>
  );



    function onStextChange(val){
        setStext(val);
    }
    function formSubmit(event){
    event.preventDefault();
    axios.get(lhost+'search?sitem='+stext)
        .then(res=>{
          let jsonstr=JSON.stringify(res.data);
          console.log("AXIOS: "+jsonstr);
          setResdata(res.data);
          dat=res.data;
          if(resdata!=null){
            console.log("RESDATA SET!!");
            // setDataState(true);
          }else{
            console.log("RESDATA NOT SET!!");
          }
          // dataTable();
        })
        .catch(err=>{console.error("AXOS ERROR MSG :"+err.message+"\nAXIOS ERROR REQ:"+err.request+"\nAXIOS ERROR RES:"+err.response);})
    }

    function DataTable(){
      if(resdata==null){
        console.log("RESDAT IS NULL");
      }else{
        let itemDict=resdata;
        console.log("Size of list = "+itemDict['size']);
        let dictSize=Number(itemDict['size']);
        // let num=0;
        let darray=[];
        for(let num=0;num<dictSize;num++){
          console.log("Item "+num.toString());
          console.log(itemDict[num.toString()][0]);
          darray.push(<tr key={num}><td key={num}>{itemDict[num.toString()][0]}</td><td>{itemDict[num.toString()][1]}</td></tr>);
          // return(
          //   <tr>
          //     <td>{itemDict[num.toString()][0]}</td>
          //     <td>{itemDict[num.toString()][1]}</td>
          //   </tr>
          // )
        }
        return darray;
      }
      
    }
}

export default Search;
