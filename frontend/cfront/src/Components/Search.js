import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table'
import axios from 'axios';

const lhost='http://localhost:5000/';

function Search() {
    const [stext,setStext]=useState('');
    const[keellsDataState,setkeellsDataState]=useState(false);
    const [keellsResData,setkeellsResData]=useState(null);

    const [mainData,setMainData]=useState(null);

    const [shop1Sel,setShop1Sel]=useState(false);
    const [shop2Sel,setShop2Sel]=useState(false);
    const [shop3Sel,setShop3Sel]=useState(false);

    useEffect(()=>{
      if(mainData!=null){
        
        // console.log("MAIN ARRAY : "+mainData[1]['size']);
        setkeellsDataState(true);
        console.log("NOT NULL IN EFFECT");
      }else{
        console.log("NULL IN EFFECT!");
      }
    },[mainData]);

  return (
    
    <div id = 'container' style={{width:700}}>
      <Form id='searchForm' onSubmit={formSubmit}>
        <Form.Group className='mb-3'>
          <Form.Check type='checkbox' id='shop1check' label='Shop 1' checked={shop1Sel} onClick={e=>{onShopSelect(e.target.id)}}/>
          <Form.Check type='checkbox' id='shop2check' label='Shop 2' checked={shop2Sel} onClick={e=>{onShopSelect(e.target.id)}}/>
          <Form.Check type='checkbox' id='shop3check' label='Shop 3' checked={shop3Sel} onClick={e=>{onShopSelect(e.target.id)}}/>
        </Form.Group>
        <Form.Group className='mb-3' controlId='searchText'>
          <Form.Label>Search for an item</Form.Label>
          <Form.Control type='text' onChange={e=>{onStextChange(e.target.value)}}/>
        </Form.Group>
        <Button variant='primary' type='submit'>Search</Button>
      </Form>
      {/* {keellsDataState && <Table striped bordered hover id='resTable'><thead><tr><th colSpan={3}>SHOP1</th></tr></thead><tr><th>Item</th><th>Price</th><th>IMG URL</th></tr><tbody>{<KeellsTable/>}</tbody></Table>}
      {keellsDataState && <Table striped bordered hover id='resTable'><thead><tr><th>Item</th><th>Price</th><th>IMG URL</th></tr></thead><tbody>{<FoodcityTable/>}</tbody></Table>} */}
      <Table striped bordered hover id='resTable'>
        <thead style={{width: "200"}}>
          <tr>{shop1Sel && <th>Keells</th>}{shop2Sel && <th>Food City</th>}{shop3Sel && <th>Arpico</th>}</tr>
          <tr>{shop1Sel && <td><Button>Sort</Button></td>}{shop2Sel && <td><Button>Sort</Button></td>}{shop3Sel && <td><Button>Sort</Button></td>}</tr>
        </thead>

        <tbody>
          <tr>
            {shop1Sel && <td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Item</td>
                    <td>Price</td>
                    <td>Image</td>
                  </tr>
                </thead>
                <tbody>
                  <KeellsTable/>
                </tbody>
              </Table>
            </td>}
            {shop2Sel && <td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Item</td>
                    <td>Price</td>
                    <td>Image</td>
                  </tr>
                </thead>
                <tbody>
                  <FoodcityTable/>
                </tbody>
              </Table>
            </td>}
            {shop3Sel && <td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Item</td>
                    <td>Price</td>
                    <td>Image</td>
                  </tr>
                </thead>
                <tbody>
                  <KeellsTable/>
                </tbody>
              </Table>
            </td>}
            
          </tr>
          {/* <tr>
            {shop1Sel && <td>Item</td>}
            {shop1Sel && <td>Price</td>}
            {shop1Sel && <td>Image</td>}

            {shop2Sel && <td>Item</td>}
            {shop2Sel && <td>Price</td>}
            {shop2Sel && <td>Image</td>}

            {shop3Sel && <td>Item</td>}
            {shop3Sel && <td>Price</td>}
            {shop3Sel && <td>Image</td>}
          </tr> */}
        </tbody>
        
      </Table>
    </div>
  );



    function onStextChange(val){
        setStext(val);
    }
    function onShopSelect(event){
      console.log(event);
      if(event==="shop1check"){
        setShop1Sel(!shop1Sel);
      }else if(event==="shop2check"){
        setShop2Sel(!shop2Sel);
      }else if(event==="shop3check"){
        setShop3Sel(!shop3Sel);
      }else{
        console.error("Invalid shop select event : "+event);
      }
    }
    function formSubmit(event){
    event.preventDefault();
    axios.get(lhost+'search?sitem='+stext+'&shop1='+shop1Sel+"&shop2="+shop2Sel+"&shop3="+shop3Sel)
        .then(res=>{
          let jsonstr=JSON.stringify(res.data);
          console.log("AXIOS: "+jsonstr);
          setMainData(res.data);
          if(mainData!=null){
            console.log("MainData SET!!");
            let kdata=[]
            kdata=mainData[0];
            // let size=kdata['size'];
            // console.log("MAIN ARRAY : "+mainData[0]);
            // setkeellsDataState(true);
          }else{
            console.log("MainData NOT SET!!");
          }
          // dataTable();
        })
        .catch(err=>{console.error("AXOS ERROR MSG :"+err.message+"\nAXIOS ERROR REQ:"+err.request+"\nAXIOS ERROR RES:"+err.response);})
    }

    function KeellsTable(){
      if(mainData==null){
        console.log("mainData IS NULL");
      }else{
        let mainDict=mainData;

        let s1dict=mainDict[0];
        console.log("Shop1 size : "+s1dict['size']);
        // console.log("Size of list = "+itemDict['size']);
        let dictSize=Number(s1dict['size']);
        let darray=[];
        for(let num=0;num<dictSize-1;num++){
          console.log("Item "+num.toString());
          console.log(s1dict[num.toString()][0]);
          darray.push(<tr key={num}><td width={200} key={num}>{s1dict[num.toString()][0]}</td><td>{s1dict[num.toString()][1]}</td><td><img className='prodimg' alt='Product' src={s1dict[num.toString()][2]} width="150" height="150"/></td></tr>);
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


    function FoodcityTable(){
      if(mainData==null){
        console.log("mainData IS NULL");
      }else{
        let mainDict=mainData;

        let s1dict=mainDict[1];
        console.log("Shop1 size : "+s1dict['size']);
        // console.log("Size of list = "+itemDict['size']);
        let dictSize=Number(s1dict['size']);
        let darray=[];
        for(let num=0;num<dictSize-1;num++){
          console.log("Item "+num.toString());
          console.log(s1dict[num.toString()][0]);
          darray.push(<tr key={num}><td key={num}>{s1dict[num.toString()][0]}</td><td>{s1dict[num.toString()][1]}</td><td><img className='prodimg' alt='Product' src={s1dict[num.toString()][2]} width="150" height="150"/></td></tr>);
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
