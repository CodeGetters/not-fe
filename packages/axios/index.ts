import { mergeConfig } from "./utils";
class Axios {
  defaultConfig: any;
  constructor(defaultConfig) {
    this.defaultConfig = defaultConfig;
  }

  request(url, options) {
    try {
      this._request(url, options);
    } catch (err) {}
  }
  _request(url, options) {
    console.log("发送请求", url, options);
  }
}

function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = Axios.prototype.request.bind(context);
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}

const axios = createInstance({
  timeout: 0,
  adapter: ["xhr", "http", "fetch"],
  baseURL: "",
  headers: {},
});

axios.Axios = Axios;
axios.default = axios;

export default axios;
