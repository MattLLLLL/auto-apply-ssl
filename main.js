import acme from 'acme-client'
import fs from 'fs'
import { createCloudFlareRecordTXT } from './DNS/index.js'
import config from './config.js';

acme.setLogger((message) => {
  console.log(message);
});

function log(m) {
  process.stdout.write(`${m}\n`);
}

async function challengeCreateFn(authz, challenge, keyAuthorization) {
 if (challenge.type === 'dns-01') {
      const dnsRecord = `_acme-challenge.${authz.identifier.value}`;
      
      log(`Would create TXT record "${dnsRecord}" with value "${keyAuthorization}"`);

      await createCloudFlareRecordTXT(keyAuthorization)
  }
}

async function challengeRemoveFn(authz, challenge, keyAuthorization) {}

async function main() {
  /* Init client */
  const client = new acme.Client({
      directoryUrl: acme.directory.letsencrypt.staging,
      accountKey: fs.readFileSync('account.key'),
      backoffAttempts: 3,
      backoffMin: 3000,
      backoffMax: 8000
  });

  /* Create CSR */
  const [key, csr] = await acme.crypto.createCsr({
      commonName: 'souzuke.com'
  });

  /* Certificate */
  const cert = await client.auto({
      csr,
      email: config.email,
      challengePriority: ['dns-01'],
      termsOfServiceAgreed: true,
      challengeCreateFn,
      challengeRemoveFn
  });

  /* Done */
  const certificatePath = 'Certificate/souzuke.com'
  if (!fs.existsSync(certificatePath)) {
    fs.mkdirSync(certificatePath, { recursive: true });
  }

  try {
    fs.writeFile(certificatePath + '/privateKey.pem', key.toString(), (err) => {
      if (err) throw err;
      console.log('Private key has been saved to privateKey.pem');
    });
    fs.writeFile(certificatePath + '/certificate.pem', cert.toString(), (err) => {
      if (err) throw err;
      console.log('Private key has been saved to certificate.pem');
    });
  } catch(error) {
    console.log(error)
  }
};


main()