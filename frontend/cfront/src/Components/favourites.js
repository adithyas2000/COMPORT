import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/esm/Table';
import env from 'react-dotenv';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';


const lhost = env.LOCALHOST;

function Favourites(){
  const [keellsData,setkeellsdata]=useState([]);
  const [foodcityData,setfcdata]=useState([]);
  const [arpicoData,setarpicodata]=useState([]);
  useEffect(()=>{
    sortFavs();
  },["hehe"]);

    return(
        <div id='mainContainer' class="border border-5 border-primary shadow bg-white p-5" style={{ width: '80%', padding: 50, margin:'10%', borderRadius: 50 }}>
            <h1>Favourites</h1><br/>
            <Table striped bordered hover id='resTable'>
        <thead style={{width: "200"}}>
          <tr>{  <th>Keells</th>}{<th>Food City</th>}{arpicoData.length>0 &&  <th>Arpico</th>}</tr>
        </thead>

        <tbody>
          <tr>
            {<td>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {keellsData.length>0 && <td>Item</td>}
                    {keellsData.length>0 && <td>Image</td>}
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
                    {foodcityData.length>0 && <td>Item</td>}
                    {foodcityData.length>0 && <td>Image</td>}
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
                    {arpicoData.length>0 && <td>Item</td>}
                    {arpicoData.length>0 && <td>Image</td>}
                  </tr>
                </thead>
                <tbody>
                  <ArpicoTable/>
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
     if(keellsData.length==0 && foodcityData.length==0 && arpicoData.length==0){ 
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
        if(res.data['Error']){
          window.location.href='/userWelcome';
        }
        for (var item in res.data){
          console.log("Item : "+item);
          if(res.data[item]["URL"].includes("keells")){
            localkdata.push({"timestamp":item,...res.data[item]})
          }else if(res.data[item]["URL"].includes("cargills")){
            localfcdata.push({"timestamp":item,...res.data[item]})
          }else if(res.data[item]["URL"].includes("arpico")){
            localarpicodata.push({"timestamp":item,...res.data[item]})
          }else{
            console.warn("No matching shop: "+res.data[item]["URL"])
          }
          
          setkeellsdata(localkdata);
          setfcdata(localfcdata);
          setarpicodata(localarpicodata);
          
        }
        
        console.log(localkdata);
        console.log(localfcdata);
        console.log(localarpicodata);
      })}
    }

    function Keellstable(){
      
      if((keellsData.length>0)&&(foodcityData.length>0)&&(arpicoData.length>0)){
        console.log("Keels favs  len: "+keellsData.length);
      }else{
        console.log("Keels fav len:"+keellsData.length)
        // sortFavs();
      }
        var darray=[];
        for(var item in keellsData){
          darray.push(<tr ><td><div style={{color:'blue',cursor:'pointer'}}  data-item={keellsData[item]["name"]} onClick={(e)=>{chartFav(e)}}>{keellsData[item]["name"]}</div> <br/><br/><Button data-timestamp={keellsData[item]["timestamp"]} onClick={(e)=>{removeFav(e)}}>Remove</Button></td><td><img src={keellsData[item]["image"]} width="150" height="150"/></td></tr>);
        }
        
        return(darray)
    }
    function FoodcityTable(){
      
      if((keellsData.length>0)&&(foodcityData.length>0)&&(arpicoData.length>0)){
        console.log("Foodcity favs  len: "+foodcityData.length);
      }else{
        console.log("Foodcity fav len:"+foodcityData.length)
        sortFavs();
      }
        var darray=[];
        for(var item in foodcityData){
          darray.push(<tr><td><div style={{color:'blue',cursor:'pointer'}}  data-item={foodcityData[item]["name"]} onClick={(e)=>{chartFav(e)}}>{foodcityData[item]["name"]}</div> <br/><br/><Button data-timestamp={foodcityData[item]["timestamp"]} onClick={(e)=>{removeFav(e)}}>Remove</Button></td><td><a style={{textDecoration:'inherit',color:'inherit'}} href={foodcityData[item]["URL"]}><img src={foodcityData[item]["image"]} width="150" height="150"/></a></td></tr>);
        }
        
        return(darray)
    }
    function ArpicoTable(){
      
      if((keellsData.length>0)&&(foodcityData.length>0)&&(arpicoData.length>0)){
        console.log("Arpico favs  len: "+arpicoData.length);
      }else{
        console.log("Arpico fav len:"+arpicoData.length)
        sortFavs();
      }
        var darray=[];
        for(var item in arpicoData){
          darray.push(<tr><td><div style={{color:'blue',cursor:'pointer'}}  data-item={arpicoData[item]["name"]} onClick={(e)=>{chartFav(e)}}>{arpicoData[item]["name"]}</div> <br/><br/><Button data-timestamp={arpicoData[item]["timestamp"]} onClick={(e)=>{removeFav(e)}}>Remove</Button></td><td><a style={{textDecoration:'inherit',color:'inherit'}} href={arpicoData[item]["URL"]}><img src={arpicoData[item]["image"]} width="150" height="150"/></a></td></tr>);
        }
        
        return(darray)
    }

    function removeFav(e){
      e.preventDefault();
      var time=e.target.getAttribute("data-timestamp");
      console.log(e.target.getAttribute("data-timestamp"));
      var removeFav=axios.get(lhost+'removeFromFavs/?timestamp='+encodeURIComponent(time),{headers:{"Authorization":window.sessionStorage.getItem("auth")}}).then(res=>{
        if(res.data["Updated"]){
          alert("Removed fromfavourites");
          window.location.reload();
        }
      })
    }

    function chartFav(e){
      e.preventDefault();
      var chartitem=e.target.getAttribute("data-item");
      console.log(chartitem);
      window.sessionStorage.setItem("chartitem",chartitem);
      window.sessionStorage.setItem("chartdatafound","false");
      window.location.href="/chart";
    }
}

export default Favourites;



