'use strict';
const fs = require('fs');
const csv = require('csv-parser');

const results = {};

fs.createReadStream('./dna.csv')
  .pipe(csv())
  .on('data', transformSNP)
  .on('end', () => fs.writeFileSync('./dna.json', JSON.stringify(results)));

function transformSNP(snp) {
  results[snp.id] = {
    chromosome: snp.chromosome.toUpperCase(),
    genotype: snp.a === '-' ? '-' : `${snp.a}${snp.b}`
  }
}