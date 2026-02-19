'use strict';
import fs from 'fs';
import { open } from 'node:fs/promises';

const result = {};

function addMarker(rsid, chromosome, position, genotype) {
  if (!result[rsid] || `${rsid},${chromosome},${position},${genotype}`.includes(' ')) {
    result[rsid] = {
      rsid,
      chromosome,
      position,
      genotype
    }
  }
}

// parse snp markers from csv and txt data files
(async () => {

  // 23andme
  let file = await open('./dna-23andme.txt');
  for await (const line of file.readLines()) {
    if (line[0] != '#') {
      const tokens = line.split('\t').map(s => s.replaceAll(' ', ''));
      addMarker(tokens[0], tokens[1], tokens[2], tokens[3]);
    }
  }

  // helix
  file = await open('./dna-helix.csv');
  for await (const line of file.readLines()) {
    const tokens = line.split(',');
    if (tokens[0] != 'id') {
      addMarker(tokens[0], tokens[1], 0, `${tokens[2]}${tokens[3]}`)
    }
  }

  // output json to ./results.json
  const json = JSON.stringify(result)
  fs.writeFileSync('./results.json', json);
  
  // output csv to ./results.csv
  let csv = "rsid,chromosome,position,genotype\n";
  for (let rsid in result) {
    const o = result[rsid];
    csv += `${o.rsid},${o.chromosome},${o.position},${o.genotype}\n`
  }
  fs.writeFileSync('./results.csv', csv);
})();