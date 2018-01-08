export const post = (url, data) => {

    return fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json',
        }
    })
        .then(response => {
            return response.json();
        })
};

export const postProtected = (url , data) => {
    return fetch(url , {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(response => {
        return response.json();
    })
}