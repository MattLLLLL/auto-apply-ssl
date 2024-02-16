import axios from "axios";
import config from "../config.js"

const createCloudFlareRecordTXT = async (txt) => {
  await axios({
    method: 'post',
    url: `https://api.cloudflare.com/client/v4/zones/${config.cloudflare.zoneId}/dns_records`,
    data: {
      "content": txt,
      "name": "_acme-challenge",
      "proxied": false,
      "type": "TXT",
      "comment": "Domain verification record",
      "ttl": 3600
    },
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Key": config.cloudflare.authKey,
      "X-Auth-Email": config.cloudflare.authEmail
    }
  })
}

export { createCloudFlareRecordTXT }