const chai  = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
console.log('\x1Bc');

 {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');


chai.should();
chai.use(chaiHttp);

function generatePost(){
  return {
     'title': faker.lorem.sentence(),
     'content': faker.lorem.paragraph(),
     'author': {
        'firstName': faker.name.firstName(),
        'lastName': faker.name.lastName()
      }
  }
}

function seedPostData(){
  const seedData = [];
  for(let i = 0; i < 4; i++){
    seedData.push(generatePost());
  };
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
        //console.dir(result.body);
        result.should.have.status(200);
        result.should.be.json;
        result.body.should.be.a('array');
        result.body.should.have.length.of(4);
      });
    });
  });
  describe('\nTesting POST Endpoint',() => {
    it('\nShould return 201 for create',() => {
      return chai.request(app)
      .post('/posts')
      .send(generatePost())
      .then((result) => {
          console.log(result.body);
          result.should.have.status(201);
          result.should.be.json;
          result.body.should.be.a('object');
          result.body.should.have.ownProperty('author');
      })
    })
  })
  describe('\nTesting Put',() => {
    it('\nShould return 201',() => {
      const updateData = {
        "title"   : "!!!!!FOO!!!!!",
        "content" : "iiiiiBARiiiii"
      }
      return BlogPost
      .findOne()
      .then(function(postData) {
        updateData.id = postData.id;
        return chai.request(app).put(`/posts/${postData.id}`)
        .send(updateData);
      }).then(function(postData){
        postData.should.have.status(201);
        postData.should.be.json;
        postData.body.should.be.a('object');
        postData.body.should.include.keys('id','author','content');
      })
    })
  })
  describe('\nTesting DELETE endpoint', () => {
    it('\nShould delete a blogpost by id', function() {
      let blogpost;

      return BlogPost
        .findOne()
        .then(function(postData) {
          blogpost = postData;
          return chai.request(app).delete(`/posts/${blogpost.id}`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return BlogPost.findById(blogpost.id).exec();
        })
        .then(function(postData) {
          console.dir(postData);
          chai.should().not.exist;
        })
    })
  })
});
