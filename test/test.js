const chai  = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
console.log('\x1Bc');
const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');


chai.should();
chai.use(chaiHttp);

function seedPostData(){
  const seedData = [];

  for(let i = 0; i < 4; i++){
    const generatePost = {
       'title': faker.lorem.sentence(),
       'content': faker.lorem.paragraph(),
       'author': {
          'firstName': faker.name.firstName(),
          'lastName': faker.name.lastName()
        }
     };
    seedData.push(generatePost);
  }
  return BlogPost.insertMany(seedData);    
}

function tearDownDb() {
  return BlogPost.db.dropDatabase();
}

describe('Blog server startup',() => {
  
  before(() => {
    runServer();
  });

  beforeEach(() => {
    return seedPostData();
  });

  afterEach(() => {
    return tearDownDb();
  });

  after(() => {
    closeServer();
  });

  describe('Testing GET endpoint',() => {
    it('Should return all 5 blogposts',()=>{
      return chai.request(app)
      .get('/posts')
      .then((result)=>{
        console.dir(result.body);
        result.should.have.status(200);
        result.should.be.json;
        result.body.should.be.a('array');
        result.body.should.have.length.of(4);
      });
    });
  });
});
