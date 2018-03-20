process.env.NODE_ENV = 'test'
const mongoose = require('mongoose');
 const chai = require('chai');
 var should = require('chai').should();
 var expect = require('chai').expect;
 var chaiHttp = require('chai-http');
 const app = require('../server')
 const User = require('../models/user')
 chai.use(chaiHttp);

var token = ''
var userCount = () => {
  User.count({},getUserCount)
}
var getUserCount = (err, count) =>{
  // console.log('this is the count',count);
  return count

}
describe('Basic Auth', function() {


  describe('login', () => {
    it("Should log user into API", (done)=>{
      chai.request(app)
        .post('/api/login')
        .send({'username': 'Username', 'password': 'password'})
        .end(function(err, res){
        res.body.success.should.equal(true);
        res.should.have.status(200);
        should.not.exist(err)
        done();
      });
    })
  })


    describe('signup', () => {
      var count = null

      beforeEach(function(done){
        User.count({},(err,c) => {
         count = c
        })
        done()
      })


      it("Should attempt sign up existing user", (done) => {
        chai.request(app)
          .post('/api/sign-up')
          .send({'username': 'Username', 'password': 'password'})
          .end(function(err, res){
            res.body.success.should.equal(false);
            done();
        })
        User.count({},(err,c) => {
          c.should.equal(count)
        })
      })


      it("Should create a new user", (done)=>{
        chai.request(app)
          .post('/api/sign-up')
          .send({'username': 'newuser', 'password': 'newpass'})
          .end(function(err, res){
            res.body.success.should.equal(true);
            console.log(res.body._id);
          })
            User.count({},(err,c) => {
              console.log(c);
              c.should.equal(count+1)
          })
          done();

      })

      after(function(done){
        User.find({username:'newuser'}).remove().then((user)=>{
          console.log(' user has been removed.');
        });
        done()
      })
  })
  describe('Manipulating Dreams', () => {
    var token = ''

    before(function(done){
      chai.request(app)
        .post('/api/login')
        .send({'username': 'Username', 'password': 'password'})
        .end(( err, res )=> {
          token = res.body.token
        })
    })


    it('Should post a dream to list', () => {
      chai.request(app)
      .post('api/dream/new')
      .send({'username': 'Username', 'password': 'password', token})
      .end((err,res)=> {
        res.should.have.status(200);
        res.body.success.should.equal(true);
        res.body.should.have.proprty('dream')
      })
    })
  })
})
