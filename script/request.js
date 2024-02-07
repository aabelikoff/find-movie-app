const movieUrl = `https://www.omdbapi.com/?`;
const apikey = "apikey=2858c7e4";

function sendRequest(url = movieUrl, callback, parametresObj) {
  if (parametresObj) {
    for (let key in parametresObj) {
      url += `${key}=${parametresObj[key]}&`;
    }
  }
  url += apikey;
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.send();
  request.onload = () => {
    if (request.status == 200) {
      const obj = JSON.parse(request.response);
      callback(obj);
    } else {
      throw new Error("Request wasn't successfull.");
    }
  };
}
