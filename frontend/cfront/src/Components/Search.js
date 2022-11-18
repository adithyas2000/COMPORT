import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import getAuthState from './authRender';

const lhost='http://localhost:5000/';

function Search() {

  const s1Name="Keels";
  const s2Name="Food City";
  const s3Name="Arpico";

    const [stext,setStext]=useState('');
    
    const [keelsFound,setKeelsFound]=useState(false);
    const [arpicoFound,setArpicoFound]=useState(false);
    const [foodcityFound,setFoodcityFound]=useState(false);

    const [mainData,setMainData]=useState(null);

    const [shop1Sel,setShop1Sel]=useState(false);
    const [shop2Sel,setShop2Sel]=useState(false);
    const [shop3Sel,setShop3Sel]=useState(false);

    useEffect(()=>{
      
      if(mainData!=null){
        if(mainData[0]['NULL']!==undefined){
          setKeelsFound(false);
          console.log("Keels : "+mainData[0]['NULL']);
        }else{
          setKeelsFound(true);
        }
        if(mainData[1]['NULL']!==undefined){
          setFoodcityFound(false);
          console.log("Foodcity : "+mainData[1]['NULL']);
        }else{
          setFoodcityFound(true);
        }
        if(mainData[2]['NULL']!==undefined){
          setArpicoFound(false);
          console.log("Arpico : "+mainData[2]['NULL']);
        }else{
          setArpicoFound(true);
        }
      }else{
        
      }
    },[mainData]);

  return (
    
    <div id = 'container' class="shadow-lg bg-white rounded p-5" style={{width:'80%',padding:50, marginLeft:'10%',marginTop:'5%'}}>
      <Form id='searchForm' onSubmit={formSubmit}>
        <Form.Group className='mb-3'>
          <Form.Check type='checkbox' id='shop1check' label={s1Name} defaultChecked={shop1Sel} onClick={e=>{onShopSelect(e.target.id)}}/>
          <Form.Check type='checkbox' id='shop2check' label={s2Name} defaultChecked={shop2Sel} onClick={e=>{onShopSelect(e.target.id)}}/>
          <Form.Check type='checkbox' id='shop3check' label={s3Name} defaultChecked={shop3Sel} onClick={e=>{onShopSelect(e.target.id)}}/>
        </Form.Group>
        <Form.Group className='mb-3' controlId='searchText'>
          <Form.Label>Search for an item</Form.Label>
          <Form.Control style={{width:'50%'}} type='text' required onChange={e=>{onStextChange(e.target.value)}}/>
        </Form.Group>
        <Button variant='primary' type='submit'>Search</Button>
      </Form>
      {/* {keellsDataState && <Table striped bordered hover id='resTable'><thead><tr><th colSpan={3}>SHOP1</th></tr></thead><tr><th>Item</th><th>Price</th><th>IMG URL</th></tr><tbody>{<KeellsTable/>}</tbody></Table>}
      {keellsDataState && <Table striped bordered hover id='resTable'><thead><tr><th>Item</th><th>Price</th><th>IMG URL</th></tr></thead><tbody>{<FoodcityTable/>}</tbody></Table>} */}
      <Table striped bordered hover id='resTable'>
        <thead style={{width: "200"}}>
          <tr>{shop1Sel && keelsFound && <th>Keells</th>}{shop2Sel && foodcityFound && <th>Food City</th>}{shop3Sel && arpicoFound && <th>Arpico</th>}</tr>
          <tr>{shop1Sel && keelsFound && <td><Button>Sort</Button></td>}{shop2Sel && foodcityFound && <td><Button>Sort</Button></td>}{shop3Sel && arpicoFound && <td><Button>Sort</Button></td>}</tr>
        </thead>

        <tbody>
          <tr>
            {shop1Sel && keelsFound && <td>
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
            {shop2Sel && foodcityFound && <td>
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
            {shop3Sel && arpicoFound && <td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Item</td>
                    <td>Price</td>
                    <td>Image</td>
                  </tr>
                </thead>
                <tbody>
                  <ArpicoTable/>
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
    axios.get(lhost+'search?sitem='+stext+'&shop1='+shop1Sel+"&shop2="+shop2Sel+"&shop3="+shop3Sel, { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
        .then(res=>{
          let jsonstr=JSON.stringify(res.data);
          console.log("AXIOS: "+jsonstr);
          setMainData(res.data);
          if(mainData!=null){
            console.log("MainData SET!!");
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
          darray.push(<tr key={num}><td width={200} key={num}>{s1dict[num.toString()][0]}{getAuthState() && <Button onClick={(e)=>{testItemNames(e)}} variant='primary' style={{width:"150px"}}>Add to favs</Button>}</td><td>{s1dict[num.toString()][1]}</td><td><img className='prodimg' alt='Product' src={s1dict[num.toString()][2]} width="150" height="150"/></td></tr>);
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
    function testItemNames(e){
      e.preventDefault();
      console.log("Fav btn: ");
      console.log(e.target.parentNode.textContent);
    }


    function FoodcityTable(){
      if(mainData==null){
        console.log("mainData IS NULL");
      }else{
        let mainDict=mainData;
        // Foodcity is 2nd shop so get dictionary @ 2nd index
        let s2dict=mainDict[1];
        console.log("Shop2 size : "+s2dict['size']);
        // console.log("Size of list = "+itemDict['size']);
        let dictSize=Number(s2dict['size']);
        let darray=[];
        for(let num=0;num<dictSize;num++){
          console.log("Item "+num.toString());
          console.log(s2dict[num.toString()][0]);
          darray.push(<tr key={num}><td key={num}>{s2dict[num.toString()][0]}<Button variant='primary' style={{width:"150px"}} onClick={e=>addToFavs(e,"keells")}>Add to favs</Button></td><td>{s2dict[num.toString()][1]}</td><td><img className='prodimg' alt='Product' src={s2dict[num.toString()][2]} width="150" height="150"/></td></tr>);
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


    function ArpicoTable(){
      if(mainData==null){
        console.log("mainData IS NULL");
      }else{
        let mainDict=mainData;

        let s2dict=mainDict[2];
        console.log("Shop3 size : "+s2dict['size']);
        // console.log("Size of list = "+itemDict['size']);
        let dictSize=Number(s2dict['size']);
        let darray=[];
        for(let num=0;num<dictSize-1;num++){
          console.log("Item "+num.toString());
          console.log(s2dict[num.toString()][0]);
          darray.push(<tr key={num}><td key={num}>{s2dict[num.toString()][0]}</td><td>{s2dict[num.toString()][1]}</td><td><img className='prodimg' alt='Product' src={s2dict[num.toString()][2]} width="150" height="150"/></td></tr>);
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

    function addToFavs(e,shop){
      var prodName=e.target.parentNode.textContent
      console.log(e.target.parentNode.textContent)
      axios.get(lhost+"addToFavs/?prodname="+prodName+"&shop="+shop)
      .then(
        res=>console.log("Add to fav return:"+JSON.stringify(res.data))
      )
    }
}

export default Search;
