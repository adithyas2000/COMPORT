import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/esm/Table';
import env from 'react-dotenv';
import axios from 'axios';
import { useEffect } from 'react';


const lhost = env.LOCALHOST;

function Favourites(){
  useEffect(()=>{
    sortFavs();
  })
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
}

export default Favourites;

function sortFavs(){
  var favList=axios.get(lhost+"getFavs/",{headers:{"Authorization":window.sessionStorage.getItem("auth")}}).then(res=>{
    console.log(res.data);
  })
}

function Keellstable(){
    var darray=[];

    darray.push(<tr><td>Keelsdata1</td><td>Keelsimage1</td><td>Keelsprice1</td></tr>);
    darray.push(<tr><td>Keelsdata2</td><td>Keelsimage2</td><td>Keelsprice2</td></tr>);
    darray.push(<tr><td>Keelsdata3</td><td>Keelsimage3</td><td>Keelsprice3</td></tr>);
    return(darray)
}