function getAuthState(){
    var authToken=window.sessionStorage.getItem("auth");
    return (authToken!==null)
}

export default getAuthState;