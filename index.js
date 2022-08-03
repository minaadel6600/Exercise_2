const csv = require('csv-parser')
const fastcsv = require('fast-csv');
const fs = require('fs')
const results = [];
const average_results = [];
const most_popular_results = [];


fs.createReadStream('input_file_name.csv')
  .pipe(csv(['ID', 'Area', 'Name', 'Quantity', 'Brand']))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);

    // get the unique products 
    const uniqueProducts = [... new Set(results.map(data => data.Name))]



    // calculate the average for every unique product 
    uniqueProducts.forEach(element => {

      average_results.push({ Name: element, avg: getElmentAvg(element) })

    });

    // write the results to file
    writeDateToFile(average_results,' 0_order_log00.csv')
    


    // get most popular Brands for every product
    uniqueProducts.forEach(element => {

      most_popular_results.push({ Name: element, avg: getMostPopularBrand(element) })

    });

  // write the results to file
  writeDateToFile(most_popular_results,'1_order_log00.csv')

  });
const getElmentAvg = (elementName) => {
  let sum = 0;
  results.forEach(element => {
    if (element.Name == elementName) {
      sum += parseInt(element.Quantity);
    }

  });

  return sum / results.length;
}


const getMostPopularBrand = (elementName) => {

  let array = results.filter(item=> item.Name == elementName).map(item => item.Brand)
   
  if (array.length == 0)
    return null;
  var modeMap = {};
  var maxEl = array[0], maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null)
      modeMap[el] = 1;
    else
      modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
   
  return maxEl;
}


const writeDateToFile = (data,fileName) => {

 
const ws = fs.createWriteStream(fileName);
fastcsv.write(data, { headers: false })
  .pipe(ws);

console.log(`data written to file ${fileName} successfully` )
}