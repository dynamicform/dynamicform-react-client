/**
 * Created by KangYe on 2017/6/22.
 */
import 'whatwg-fetch';

export function get(url,parameter) {
    return fetch(url, {
        method: 'GET',
        body: JSON.stringify(parameter),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((response) => response.json())
      .catch((error)=> {
          console.log('error',error);
    });
}

export function post(url,parameter){
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(parameter),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((response) => response.json())
      .catch((error)=>{
          console.log('error',error);
    });
}