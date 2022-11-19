import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/esm/Table';
import env from 'react-dotenv';
import axios from 'axios';
import { useEffect, useState } from 'react';


const lhost = env.LOCALHOST;


function Favourites(){
  const [keellsData,setkeellsdata]=useState([]);
  const [foodcityData,setfcdata]=useState([]);
  const [arpicoData,setarpicodata]=useState([]);
  // useEffect(()=>{
  //   sortFavs();
  // });

    return(
        <div class="shadow-lg bg-white rounded p-5" style={{width:'80%',padding:50, marginLeft:'10%',marginTop:'5%'}}>
            <Table striped bordered hover id='resTable'>
        <thead style={{width: "200"}}>
          <tr>{  <th>Keells</th>}{<th>Food City</th>}{ <th>Arpico</th>}</tr>
        </thead>

        <tbody>
          <tr>
            {<td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Item</td>
                    <td>Price</td>
                    <td>Image</td>
                  </tr>
                </thead>
                <tbody>
                  <Keellstable/>
                </tbody>
              </Table>
            </td>}
            {<td>
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
            {<td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <td>Item</td>
                    <td>Price</td>
                    <td>Image</td>
                  </tr>
                </thead>
                <tbody>
                  <Keellstable/>
                </tbody>
              </Table>
            </td>}
            
          </tr>
          {/* <tr>
            { && <td>Item</td>}
            { && <td>Price</td>}
            { && <td>Image</td>}

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
    )


    function sortFavs(){
      // first clear the arrays
      // setkeellsdata([]);
      // setarpicodata([]);
      // setfcdata([]);
      var favList=axios.get(lhost+"getFavs/",{headers:{"Authorization":window.sessionStorage.getItem("auth")}}).then(res=>{
        console.log(res.data);
    
    
        // var keellsimages=[];
        // var keellsnames=[];
        // var keellsurls=[];
    
        // var foodcityimages=[];
        // var foodcitynames=[];
        // var foodcityurls=[];
    
        // var arpicoimages=[];
        // var arpiconames=[];
        // var arpicourls=[];
        var localkdata=[];
        var localfcdata=[];
        var localarpicodata=[];
        for (var item in res.data){
          console.log("Item : "+res.data[item]["URL"]);
          if(res.data[item]["URL"].includes("keells")){
            localkdata.push(res.data[item])
          }else if(res.data[item]["URL"].includes("cargills")){
            localfcdata.push(res.data[item])
          }else if(res.data[item]["URL"].includes("arpico")){
            localarpicodata.push(res.data[item])
          }else{
            console.warn("No matching shop: "+res.data[item]["URL"])
          }
          setkeellsdata(localkdata);
          setfcdata(localfcdata);
          setarpicodata(localarpicodata);

          console.log(keellsData);
          console.log(foodcityData);
          console.log(arpicoData);
        }
      })
    }


    function Keellstable(){
      
      if(keellsData.length>0){
        console.log("Keels favs  len: "+keellsData.length);
      }else{
        console.log("Keels fav len:"+keellsData.length)
        sortFavs();
      }
        var darray=[];
        for(var item in keellsData){
          darray.push(<tr><a style={{textDecoration:'inherit',color:'inherit'}} href={keellsData[item]["URL"]}><td>{keellsData[item]["name"]}</td><td>Keelsprice1</td><td><img src={keellsData[item]["Image"]} width="150" height="150"/></td></a></tr>);
        }
        
        return(darray)
    }

    function FoodcityTable(){
      
      if(foodcityData.length>0){
        console.log("Keels favs  len: "+foodcityData.length);
      }else{
        console.log("Keels fav len:"+foodcityData.length)
        sortFavs();
      }
        var darray=[];
        for(var item in foodcityData){
          darray.push(<tr><a style={{textDecoration:'inherit',color:'inherit'}} href={foodcityData[item]["URL"]}><td>{foodcityData[item]["name"]}</td><td>Keelsprice1</td><td><img src={foodcityData[item]["Image"]} width="150" height="150"/></td></a></tr>);
        }
        
        return(darray)
    }
}

export default Favourites;



