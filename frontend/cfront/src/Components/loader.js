

function Loader() {
    return (
        <div id='container' style={{height:'100%', width:'100%'}}>
        {/* <div class="shadow-lg bg-white rounded p-5" style={{ width:'fit-content', alignSelf: 'center',margin:'auto', marginTop:'10%'}}>
            <div class="spinner-border text-primary" role="status">
            </div>
            <h2>Loading...</h2>
        </div> */}
        <div style={{display:'table'}}>
            <div style={{display:'table-cell',verticalAlign:'middle'}}>
                <div style={{marginLeft:'auto',marginRight:'auto'}}><div class="spinner-border text-primary" role="status">
            </div></div>
            </div>
        </div>
        </div>

        
    );
}

export default Loader;