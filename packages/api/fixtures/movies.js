const faker = require("faker");

faker.seed(123);

let data = [];

for (i = 0; i < 20; i++) {
  data.push({
    title: faker.lorem.words(),
    director: faker.name.findName(),
  });
}

module.exports = data;
