const mocha = require('mocha');
const chai  = require('chai')
const chaiHttp = require('chai-http');
const faker = require('faker')
console.log('\x1Bc');
const {app, runServer, closeServer} = require('../server');


chai.should();
chai.use(chaiHttp);

describe('Blog server startup',()=>{

  beforeEach(()=>{
    runServer();
    for(let i = 0; i< 3; i++){
      let entry = {
        "title" : faker.lorem.sentence(),
        "content" : faker.lorem.paragraph(),
        "author" : {
          "firstName": faker.name.firstName(),
          "lastName" : faker.name.lastName()
        }
      };
      chai.request(app)
      .post('/posts')
      .send(entry).then(()=>{
        console.log(entry);

      }).done();
    }
  });

  afterEach(()=>{

    closeServer();
  })

  describe('Testing Endpoints',()=>{
    it('Should do something',()=>{
      return chai.request(app)
      .get('/posts')
      .then((result)=>{
        console.dir(result.body);
        result.should.be.json;
      })
    })
  });
})
