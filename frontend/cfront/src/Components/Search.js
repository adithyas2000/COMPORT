import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import getAuthState from './authRender';

const lhost = 'http://localhost:5000/';

function Search() {

  const s1Name = "Keels";
  const s2Name = "Food City";
  const s3Name = "Arpico";

  const [stext, setStext] = useState('');

  const [keelsFound, setKeelsFound] = useState(false);
  const [arpicoFound, setArpicoFound] = useState(false);
  const [foodcityFound, setFoodcityFound] = useState(false);

  const [mainData, setMainData] = useState(null);
  const [keellsdata, setkeellsdata] = useState(null);
  const [foodcitydata, setfoodcitydata] = useState(null);
  const [arpicodata, setarpicodata] = useState(null);

  const [shop1Sel, setShop1Sel] = useState(false);
  const [shop2Sel, setShop2Sel] = useState(false);
  const [shop3Sel, setShop3Sel] = useState(false);

  const [spinning, setspinning] = useState(false);

  const [keellsSortDir, setKeellsSortDir] = useState(false);
  const [foodcitySortDir, setFoodcitySortDir] = useState(false);
  const [arpicoSortDir, setArpicoSortDir] = useState(false);

  useEffect(() => {

    if (mainData != null) {
      if (mainData[0]['NULL'] !== undefined) {
        setKeelsFound(false);
        console.log("Keels : " + mainData[0]['NULL']);
      } else {
        setKeelsFound(true);

        setkeellsdata(mainData[0]);
      }
      if (mainData[1]['NULL'] !== undefined) {
        setFoodcityFound(false);
        console.log("Foodcity : " + mainData[1]['NULL']);
      } else {
        setFoodcityFound(true);

        setfoodcitydata(mainData[1])
      }
      if (mainData[2]['NULL'] !== undefined) {
        setArpicoFound(false);
        console.log("Arpico : " + mainData[2]['NULL']);
      } else {
        setArpicoFound(true);

        setarpicodata(mainData[2]);
      }
    } else {

    }
  }, [mainData]);


  return (

    <div id='container' class="border border-5 border-primary shadow bg-white p-5" style={{ width: '80%', padding: 50, margin: '10%', borderRadius: 50 }}>
      <Form id='searchForm' onSubmit={formSubmit}>
        <Form.Group className='mb-3'>
          <Form.Check disabled={spinning} type='checkbox' id='shop1check' label={s1Name} defaultChecked={shop1Sel} onClick={e => { onShopSelect(e.target.id) }} />
          <Form.Check disabled={spinning} type='checkbox' id='shop2check' label={s2Name} defaultChecked={shop2Sel} onClick={e => { onShopSelect(e.target.id) }} />
          <Form.Check disabled={spinning} type='checkbox' id='shop3check' label={s3Name} defaultChecked={shop3Sel} onClick={e => { onShopSelect(e.target.id) }} />
        </Form.Group>
        <Form.Group className='mb-3' controlId='searchText'>
          <Form.Label>Search for an item</Form.Label>
          <Form.Control disabled={spinning} style={{ width: '50%' }} type='text' required onChange={e => { onStextChange(e.target.value) }} />
        </Form.Group>
        <Button disabled={spinning || (!(shop1Sel || shop2Sel || shop3Sel))} variant='primary' type='submit'>
          {spinning && <span class="spinner-border spinner-border-sm" style={{ marginRight: '10px' }} role="status" aria-hidden="true"></span>}
          {spinning && <span class="sr-only">Searching...</span>}
          {!spinning && <span class="sr-only">Search</span>}
        </Button>
      </Form>
      {/* {keellsDataState && <Table striped bordered hover id='resTable'><thead><tr><th colSpan={3}>SHOP1</th></tr></thead><tr><th>Item</th><th>Price</th><th>IMG URL</th></tr><tbody>{<KeellsTable/>}</tbody></Table>}
      {keellsDataState && <Table striped bordered hover id='resTable'><thead><tr><th>Item</th><th>Price</th><th>IMG URL</th></tr></thead><tbody>{<FoodcityTable/>}</tbody></Table>} */}
      <Table striped bordered hover id='resTable'>
        <thead style={{ width: "200" }}>
          <tr>{shop1Sel && keelsFound && <th>Keells</th>}{shop2Sel && foodcityFound && <th>Food City</th>}{shop3Sel && arpicoFound && <th>Arpico</th>}</tr>
          <tr>{shop1Sel && keelsFound && <td><Button onClick={(e) => { e.preventDefault(); sortTable("keells"); }}>Sort{keellsSortDir && <div>▲</div>}{!keellsSortDir && <div>▼</div>}</Button></td>}{shop2Sel && foodcityFound && <td><Button onClick={(e) => { e.preventDefault(); sortTable("foodcity"); }}>Sort{foodcitySortDir && <div>▲</div>}{!foodcitySortDir && <div>▼</div>}</Button></td>}{shop3Sel && arpicoFound && <td><Button onClick={(e) => { e.preventDefault(); sortTable("arpico"); }}>Sort{arpicoSortDir && <div>▲</div>}{!arpicoSortDir && <div>▼</div>}</Button></td>}</tr>
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
                  <KeellsTable />
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
                  <FoodcityTable />
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
                  <ArpicoTable />
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

  function sortTable(shopname) {
    // setMainData([{"0":["Testitem","Rs. 2000","https://reactjs.org/logo-og.png"],"size":2},{"NULL":"NULL"},{"NULL":"NULL"}]);
    var shopList = {};
    switch (shopname) {
      case "keells":
        shopList = mainData[0];
        break;
      case "foodcity":
        shopList = mainData[1];
        break;
      case "arpico":
        shopList = mainData[2];
        break;
      default:
        console.log("No shop matching '" + shopname + "'");
        break;
    }
    // shopList = mainData[0];
    var ksize = Number(shopList["size"]);

    var lis = { "0": ["ITEM", "Rs 29,9 /", "https://reactjs.org/logo-og.png"], "1": ["ITEM1", "Rs 2,91 /", "https://reactjs.org/logo-og.png"], "2": ["ITEM2", "Rs 2,95 /", "https://reactjs.org/logo-og.png"], "size": 4 };
    var arr = Object.values(shopList);
    console.log(arr);
    arr.splice(arr.length - 1, 1);
    var resul = arr.sort((a, b) => {
      // console.log("A: "+a);
      // console.log("B: "+b);

      let priceFull = ["", ""];
      let price = [0, 0]
      let pricesplit = ["", ""];

      if (shopname == "keells") {
        console.log("Sorting keells");
        priceFull[0] = a[1];
        console.log("PRICE FULL A: " + priceFull[0]);
        if (priceFull[0].includes(" ")) {
          pricesplit[0] = priceFull[0].split(" ")[1].replace(",", "");
        } else {
          pricesplit[0] = priceFull[0].split(" ")[0].replace(",", "");
        }
        pricesplit[0] = priceFull[0].split(" ")[1].replace(",", "");
        price[0] = parseFloat(pricesplit[0]);

        priceFull[1] = b[1];
        if (priceFull[1].includes(" ")) {
          pricesplit[1] = priceFull[1].split(" ")[1].replace(",", "");
        } else {
          pricesplit[1] = priceFull[1].split(" ")[0].replace(",", "");
        }
        price[1] = parseFloat(pricesplit[1]);
        // console.log(price);
        if(keellsSortDir){
          return (price[1] - price[0]);
        }else{
          return (price[0] - price[1]);
        }
        
      } else if (shopname == "foodcity") {
        priceFull[0] = a[1];
        pricesplit[0] = priceFull[0].split(" ")[1].replace(",", "");
        price[0] = parseFloat(pricesplit[0]);

        priceFull[1] = b[1];
        pricesplit[1] = priceFull[1].split(" ")[1].replace(",", "");
        price[1] = parseFloat(pricesplit[1]);

        if(foodcitySortDir){
          return (price[1] - price[0]);
        }else{
          return (price[0] - price[1]);
        }
      } else if (shopname == "arpico") {
        priceFull[0] = a[1];
        pricesplit[0] = priceFull[0].replace("LKR", "").replace(",", "");
        price[0] = parseFloat(pricesplit[0]);

        priceFull[1] = b[1];
        pricesplit[1] = priceFull[1].replace("LKR", "").replace(",", "");
        console.log("Arpico Price:" + pricesplit[0] - pricesplit[1]);
        price[1] = parseFloat(pricesplit[1]);

        if(arpicoSortDir){
          return (price[1] - price[0]);
        }else{
          return (price[0] - price[1]);
        }
      }

    });
    var sortedList = {};
    for (let n = 0; n < arr.length; n++) {
      sortedList[n.toString()] = arr[n];
    }
    sortedList["size"] = arr.length;
    switch (shopname) {
      case "keells":
        setkeellsdata(sortedList);
        setKeellsSortDir(!keellsSortDir);
        break;
      case "foodcity":
        setfoodcitydata(sortedList);
        setFoodcitySortDir(!foodcitySortDir);
        break;
      case "arpico":
        setarpicodata(sortedList);
        setArpicoSortDir(!arpicoSortDir);
        break;
      default:
        console.log("No shop matching '" + shopname + "'");
        break;
    }
    console.log(sortedList);

    // for(let n=0;n<ksize-1;n++){
    // let priceFull="";
    // priceFull=keellsList[n.toString()][1];
    // let pricesplt=priceFull.split(" ")[1].replace(",","");
    // var price=parseFloat(pricesplt);
    // console.log(price);
    // }
  }


  function onStextChange(val) {
    setStext(val);
  }
  function onShopSelect(event) {
    console.log(event);
    if (event === "shop1check") {
      setShop1Sel(!shop1Sel);
    } else if (event === "shop2check") {
      setShop2Sel(!shop2Sel);
    } else if (event === "shop3check") {
      setShop3Sel(!shop3Sel);
    } else {
      console.error("Invalid shop select event : " + event);
    }
  }
  function formSubmit(event) {
    event.preventDefault();
    setspinning(true);
    axios.get(lhost + 'search?sitem=' + encodeURIComponent(stext) + '&shop1=' + encodeURIComponent(shop1Sel) + "&shop2=" + encodeURIComponent(shop2Sel) + "&shop3=" + encodeURIComponent(shop3Sel), { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
      .then(res => {
        let jsonstr = JSON.stringify(res.data);
        console.log("AXIOS: " + jsonstr);
        setMainData(res.data);
        // setkeellsdata(mainData[0]);
        // setfoodcitydata(mainData[1]);
        // setarpicodata(mainData[2]);
        setspinning(false);
        if (mainData != null) {
          console.log("MainData SET!!");
          // setkeellsdata(mainData[0]);
          // setfoodcitydata(mainData[1]);
          // setarpicodata(mainData[2]);
          console.log(mainData);
        } else {
          console.log("MainData NOT SET!!");
        }
        // dataTable();
      })
      .catch(err => { console.error("AXOS ERROR MSG :" + err.message + "\nAXIOS ERROR REQ:" + err.request + "\nAXIOS ERROR RES:" + err.response); })
  }

  function KeellsTable() {
    if (mainData == null) {
      console.log("mainData IS NULL");
    } else {
      let mainDict = mainData;

      // let s1dict = mainDict[0];
      let s1dict = keellsdata;
      console.log("Shop1 size : " + s1dict['size']);
      // console.log("Size of list = "+itemDict['size']);
      let dictSize = Number(s1dict['size']);
      let darray = [];
      for (let num = 0; num < dictSize - 1; num++) {
        console.log("Item " + num.toString());
        console.log(s1dict[num.toString()][0]);
        darray.push(<tr key={num}><td width={200} key={num}>{s1dict[num.toString()][0]}{getAuthState() && <Button id='keells' onClick={(e) => { addToFavs(e) }} variant='primary' style={{ width: "150px" }}>Add to favs</Button>}</td><td>{s1dict[num.toString()][1]}</td><td><img className='prodimg' alt='Product' src={s1dict[num.toString()][2]} width="150" height="150" /></td></tr>);

      }
      return darray;
    }

  }
  function addToFavs(e) {
    e.preventDefault();
    var itemName = "";
    itemName = e.target.parentNode.textContent;
    console.log("Fav item: " + itemName.replace("Add to favs", ""));
    var itemPrice = e.target.parentNode.nextSibling.textContent;
    var imageUrl = e.target.parentNode.nextSibling.nextSibling.childNodes["0"].src;
    var shop = e.target.id;

    axios.get(lhost + "addToFavs/?prodname=" + encodeURIComponent(itemName.replace("Add to favs", "")) + "&shop=" + encodeURIComponent(shop) + "&price=" + encodeURIComponent(itemPrice), { headers: { "Authorization": window.sessionStorage.getItem("auth") } }).then(
      res => {
        if ("Error" in res.data) {
          alert(res.data["Error"]);
        } else if ("Warn" in res.data) {
          alert(res.data["Warn"]);
        } else if ("Success" in res.data) {
          alert("Added to favourites");
        }
      }
    )
  }


  function FoodcityTable() {
    if (mainData == null) {
      console.log("mainData IS NULL");
    } else {
      // let mainDict = mainData;
      // Foodcity is 2nd shop so get dictionary @ 2nd index
      let s2dict = foodcitydata;
      console.log("Shop2 size : " + s2dict['size']);
      // console.log("Size of list = "+itemDict['size']);
      let dictSize = Number(s2dict['size']);
      let darray = [];
      for (let num = 0; num < dictSize; num++) {
        console.log("Item " + num.toString());
        console.log(s2dict[num.toString()][0]);
        darray.push(<tr key={num}><td key={num}>{s2dict[num.toString()][0]}{getAuthState() && <Button id='foodcity' variant='primary' style={{ width: "150px" }} onClick={e => addToFavs(e)}>Add to favs</Button>}</td><td>{s2dict[num.toString()][1].split("MRP")[0]}</td><td><img className='prodimg' alt='Product' src={s2dict[num.toString()][2]} width="150" height="150" /></td></tr>);
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


  function ArpicoTable() {
    if (mainData == null) {
      console.log("mainData IS NULL");
    } else {
      // let mainDict = mainData;

      let s2dict = arpicodata;
      console.log("Shop3 size : " + s2dict['size']);
      // console.log("Size of list = "+itemDict['size']);
      let dictSize = Number(s2dict['size']);
      let darray = [];
      for (let num = 0; num < dictSize - 1; num++) {
        console.log("Item " + num.toString());
        console.log(s2dict[num.toString()][0]);
        darray.push(<tr key={num}><td key={num}>{s2dict[num.toString()][0]}{getAuthState() && <Button id='arpico' variant='primary' style={{ width: "150px" }} onClick={e => addToFavs(e)}>Add to favs</Button>}</td><td>{s2dict[num.toString()][1]}</td><td><img className='prodimg' alt='Product' src={s2dict[num.toString()][2]} width="150" height="150" /></td></tr>);
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

  // function addToFavs(e,shop){
  //   var prodName=e.target.parentNode.textContent
  //   console.log(e.target.parentNode.textContent)
  //   axios.get(lhost+"addToFavs/?prodname="+prodName+"&shop="+shop)
  //   .then(
  //     res=>console.log("Add to fav return:"+JSON.stringify(res.data))
  //   )
  // }
}

export default Search;
