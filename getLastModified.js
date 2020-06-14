process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const http = require("https");
const fs = require("fs");
const path = require("path");

const targets = {
  WHATS: function (currentCountry, environment) {
    return `https://nsx.sec.${environment}.dl.playstation.net/nsx/sec/Xz78TMQ1Uf31VCYr/c/NSXWSV/NSXWSV-PN.P3.${currentCountry}-WHATSNEW00000001.xml`;
  },
  TV: function (currentCountry, environment) {
    return `https://nsx.sec.${environment}.dl.playstation.net/nsx/sec/Xz78TMQ1Uf31VCYr/c/NSXWSV/NSXWSV-PN.P3.${currentCountry}-XMB_TV_INSTALL01.xml`;
  },
  GAME: function (currentCountry, environment) {
    return `https://nsx.sec.${environment}.dl.playstation.net/nsx/sec/Xz78TMQ1Uf31VCYr/c/NSXWSV/NSXWSV-PN.P3.GAME.${currentCountry}-BILLBOARD0000001.xml`;
  },
  VIDEO: function (currentCountry, environment) {
    return `https://nsx.sec.${environment}.dl.playstation.net/nsx/sec/Xz78TMQ1Uf31VCYr/c/NSXWSV/NSXWSV-PN.P3.VIDEO.${currentCountry}-BILLBOARD0000001.xml`;
  },
};

const environments = [
  "c1-np",
  "d1-np",
  "d2-np",
  "d3-np",
  "d1-pmgt",
  "d2-pmgt",
  "d3-pmgt",
  "d1-pqa",
  "d2-pqa",
  "d3-pqa",
  "d1-spint",
  "d2-spint",
  "d3-spint",
  "d-np",
  "d-pmgt",
  "d-pqa",
  "d-spint",
  "e1-np",
  "e1-pmgt",
  "e1-pqa",
  "e1-spint",
  "hf",
  "hf-np",
  "hf-pmgt",
  "hf-pqa",
  "hf-spint",
  "h-np",
  "h-pmgt",
  "h-pqa",
  "h-spint",
  "mgmt",
  "np",
  "pmgt",
  "pqa",
  "prod-qa",
  "q1",
  "q2",
  "q1-np",
  "q2-np",
  "q1-pmgt",
  "q2-pmgt",
  "q1-pqa",
  "q2-pqa",
  "q1-spint",
  "q2-spint",
  "q-np",
  "q-pmgt",
  "q-pqa",
  "q-spint",
  "rc",
  "rc-np",
  "r-np",
  "r-pmgt",
  "r-pqa",
  "r-spint",
  "sp-int",
];
const countries = [
  "AE",
  "AR",
  "AT",
  "AU",
  "BE",
  "BG",
  "BH",
  "BO",
  "BR",
  "CA",
  "CH",
  "CL",
  "CN",
  "CO",
  "CR",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EC",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "GT",
  "HK",
  "HN",
  "HR",
  "HU",
  "ID",
  "IE",
  "IL",
  "IN",
  "IS",
  "IT",
  "JP",
  "KR",
  "KW",
  "LB",
  "LU",
  "MT",
  "MX",
  "MY",
  "NI",
  "NL",
  "NO",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PH",
  "PL",
  "PT",
  "PY",
  "QA",
  "RO",
  "RS",
  "RU",
  "SA",
  "SE",
  "SG",
  "SI",
  "SK",
  "SV",
  "TH",
  "TR",
  "TW",
  "UA",
  "UM",
  "US",
  "UY",
  "VE",
  "ZA",
  "PEPE",
];

const countryMeta = {};
let currentCountryPos = 0;

const target = process.argv[2];
const environment = process.argv[3] || "np";

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function downloadXML(currentCountry) {
  const url = targets[target](currentCountry, environment);
  http.get(url, (response) => {
    countryMeta[currentCountry] = {
      last: response.headers["last-modified"],
      size: response.headers["content-length"],
      iso: currentCountry,
    };
    let body = "";
    response.on("data", function (chunk) {
      body += chunk;
    });

    response.on("end", function () {
      const urlFile = url.split("/").pop();
      const targetSourceFile = path.resolve(
        __dirname,
        `../src/metadata/xmls/${target}/${environment}/${urlFile}`
      );
      ensureDirectoryExistence(targetSourceFile);
      fs.writeFileSync(targetSourceFile, body, "utf8");
    });

    if (countries[currentCountryPos + 1]) {
      downloadXML(countries[currentCountryPos++]);
    } else {
      const targetFile = path.resolve(
        __dirname,
        "../src/metadata/" + target.toLowerCase() + ".ts"
      );

      console.log("PEPE");

      fs.writeFileSync(
        targetFile,
        `export const ${target.toLowerCase()}Countries: Countries = ${JSON.stringify(
          countryMeta,
          null,
          4
        )};`,
        "utf8"
      );
    }
  });
}

downloadXML(countries[0]);
