const fetch = require("node-fetch");

const pubApiPrefix = {
  production: "https://ccc-webpub.leihuo.netease.com",
  development: "https://ccc-webpub.leihuo.netease.com/test",
};

const env = process.env.isTest === "1" ? "development" : "production";

const API = pubApiPrefix[env];
const PUBOS_TOKEN = "qb0ex45rdt78phwv";

exports.getConfig = function (projectPath) {
  return fetch(`${API}/api/project/get_by_path`, {
    method: "POST",
    body: JSON.stringify({
      project_path: projectPath,
    }),
    headers: {
      "pubos-auth-token": PUBOS_TOKEN,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code !== 0) return Promise.reject(res);
      return res.data;
    })
    .catch((e) => {
      console.log("webpub 查询项目失败: ", JSON.stringify(e));
      return Promise.reject(e);
    });
};

exports.getGroupConfig = function (group) {
  return fetch(`${API}/api/project_set/get_by_group/${group}`, {
    method: "GET",
    headers: {
      "pubos-auth-token": PUBOS_TOKEN,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code !== 0) return Promise.reject(res);
      return res.data;
    })
    .catch((e) => {
      console.log("webpub 查询项目组失败: ", JSON.stringify(e));
      return Promise.reject(e);
    });
};
