// urls.js
// 集成页面的路由
const webUrls = {
    "log": "http://localhost:5601/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))&_a=(columns:!(),filters:!(),index:'1857ccd0-4cba-11ef-9dad-951fd9d93520',interval:auto,query:(language:kuery,query:''),sort:!(!('@timestamp',desc)))",
    "skyWalking": "http://localhost:8088/general",
    "prometheus": "http://localhost:5601/",
    "nacos": "http://localhost:8848/nacos",
    "minio": "http://localhost:9090/",
    "juggle": "http://127.0.0.1:9127/#/flow/define",
    "largeScreenDisplay": "http://localhost:3011/#/project/items",
};

export default webUrls;
