import * as namazu from './raidboss/namazu';

console.log('test');

namazu.Mark({Name: 'Trim', MarkType: 'attack1'}).then(res => {
  console.log(res);
}).catch(e => {
  throw e;
});
