require("@babel/register")({
  "only": [
    function (filepath) {
      return filepath.includes("node_modules/@casimir.one") 
      || filepath.includes("casimir-frontend/packages") 
      || filepath.includes("node_modules/crc");
    },
  ]
});
require("./setup");