export default class Api {
  constructor() {
    this.API_URL = "http://" + process.env.REACT_APP_API_URL;
    this.fetch = this.fetch.bind(this);
  }
  postData(route, data) {
    return this.fetch(this.API_URL + route, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  getData(route) {
    return this.fetch(this.API_URL + route, {
      method: "GET"
    });
  }

  deleteData(route) {
    return this.fetch(this.API_URL + route, {
      method: "DELETE"
    });
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Api-key": this.getToken()
    };

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("jwt_token");
  }
}
