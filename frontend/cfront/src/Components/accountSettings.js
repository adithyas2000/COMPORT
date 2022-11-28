import Table from "react-bootstrap/esm/Table";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from "react";
import axios from "axios";
import env from 'react-dotenv';

const lhost = env.LOCALHOST;
function AccountSettings() {


    const [spinning, setspinning] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [history, sethistory] = useState({});

    useEffect(() => {
        console.log("History updated");
    }, [history]);
    return (
        <div id="mainContainer" class="border border-5 border-primary shadow bg-white p-5" style={{ width: '80%', padding: 50, margin: '10%', borderRadius: 50 }}>
            <h2>Account settings</h2>
            <hr />
            <h5>Change password</h5>
            <Form id='loginForm' onSubmit={changePass}>
                <Form.Group className='mb-3' id='groupCurrentPass'>
                    <Form.Label id='lblCurrentPass'>Current Password</Form.Label>
                    <Form.Control disabled={spinning} type='Password' id='txtCurrentPass' onChange={e => setCurrentPass(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='groupNewPassword'>
                    <Form.Label id='lblPass'>New Password</Form.Label>
                    <Form.Control disabled={spinning} type='Password' id='txtPass' onChange={e => setNewPass(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='groupConfPassword'>
                    <Form.Label id='lblConfPass'>Confirm Password</Form.Label>
                    <Form.Control disabled={spinning} type='password' id='txtConfPass' onChange={e => setConfirmPass(e.target.value)} />
                </Form.Group>
                <Button disabled={spinning} variant='primary' type='submit'>
                    {spinning && <span class="spinner-border spinner-border-sm" style={{ marginRight: '10px' }} role="status" aria-hidden="true"></span>}
                    {spinning && <span class="sr-only">Please wait...</span>}
                    {!spinning && <span class="sr-only">Update</span>}
                </Button>
            </Form>
            <br />
            <hr />
            <br />
            <h5>Search history</h5><br />
            <table><tbody><tr>
                <td>
                    <Button disabled={spinning} variant='primary' type='button' onClick={e => { getHistory(e) }}>
                        {spinning && <span class="spinner-border spinner-border-sm" style={{ marginRight: '10px' }} role="status" aria-hidden="true"></span>}
                        {spinning && <span class="sr-only">Please wait...</span>}
                        {!spinning && <span class="sr-only">View history</span>}
                    </Button>
                </td>
                <td>
                    <Button disabled={spinning} variant='info' type='button' onClick={e => { hideHistory(e) }}>Hide history</Button>
                </td>
                <td>
                    <Button disabled={spinning} variant='danger' type='button' onClick={e => { clearHistory(e) }}>Clear history</Button>
                </td>
            </tr></tbody></table>


            <br /><br />
            <Table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Search</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <HistoryTable />
                </tbody>
            </Table>
        </div>
    )

    function changePass(event) {
        setspinning(true);
        event.preventDefault();
        try {
            var form = new FormData();
            if ((newPass != "") && (newPass === confirmPass) && (currentPass != "")) {

                form.append("currentPass", currentPass);
                form.append("newPass", newPass);
                var changepass = axios.post(lhost + "changepass/", form, { headers: { "Authorization": window.sessionStorage.getItem("auth"), 'withCredentials': true } })
                    .then(res => {
                        console.log(res.data);
                        alert(res.data["Success"]);
                        setspinning(false);
                    })
                    .catch(err => {
                        console.error("Axios : " + err);
                        setspinning(false);
                    });
            } else {
                alert("Invalid password");

                setspinning(false);
            }

        } catch (e) {
            console.log("Error : " + e);
        }
        // changepassword=axios.post
    }

    function getHistory(e) {
        if (e != null) {
            e.preventDefault();
        }
        setspinning(true);
        var hist = axios.get(lhost + "getHistory/", { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
            .then(res => {
                console.log(res.data);
                sethistory(res.data);
                setspinning(false);
            })
            .catch(err => {
                console.error("Axios: " + err);
                setspinning(false);
            });
    }

    function HistoryTable() {
        if (history != null) {
            var tdata = [];
            for (let item in history) {
                let date = item.split("T")[0];
                let time = item.split("T")[1];
                tdata.push(<tr key={item}><td>{date}</td><td>{time}</td><td>{history[item]}</td><td><img data-timestamp={item} src={require('../icons/icons8-remove-24.png')} onClick={(e) => { removeHistory(e) }} /></td></tr>)
            }
            return tdata;
        } else {
            return null
        }
    }

    function hideHistory(e) {
        e.preventDefault();
        sethistory({});
    }

    function clearHistory(e) {
        e.preventDefault();
        if (window.confirm("Are you sure you want to CLEAR your history?")) {
            axios.get(lhost + "clearHistory/", { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
                .then(res => {
                    if (res.data["Deleted count"] > 0) {
                        console.log(res.data);
                        alert("History cleared!");
                        window.location.reload();
                    }
                })
                .catch(err => {
                    console.error("Axios : " + err);
                })
        } else {
            console.log("Cancelled history clear");
        }
    }

    function removeHistory(e) {
        e.preventDefault();
        var time = e.target.getAttribute("data-timestamp");
        console.log(time);
        axios.get(lhost + "deleteSpecHistory/?timestamp=" + encodeURIComponent(time), { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
            .then(res => {
                console.log(res.data);
                if (res.data["Updated"] > 0) {


                    alert("Removed from history");
                    getHistory(null);
                    // window.location.reload();
                }
            })
    }
}

export default AccountSettings;