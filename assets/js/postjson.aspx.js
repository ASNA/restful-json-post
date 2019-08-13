'use strict';

const submitJsonPostRequest = function () {
    const customer = {
        CMCustNo: 0,
        CMName: 'Neil Young',
        CMAddr1: '123 Broken Arrow Road',
        CMCity: 'Sugar Mountain',  
        CMState: 'CA',
        CMCntry: 'USA',
        CMPostCode: 98216,
        CMActive: '1',
        CMFax: 2104040212,    
        CMPhone: '800-289-2762',  
    };        

    axios({
        url: 'api/customers',
        method: 'post',
        headers: {
            'x-custom-header': 'custom x value',
            'y-custom-header': 'custom y value',
        },
        data: customer,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',        
    })
    .then(
        (response) => {
            console.log(response.data.InfoMessage);
        }, 
        (error)  => {
            console.table(error);
        }
    );            
}




const ab = new rp.Autobind();

ab.addEventHandler('postJsonClickHandler', function (e) {
    submitJsonPostRequest();
});

ab.assignAutoboundEventHandlers();