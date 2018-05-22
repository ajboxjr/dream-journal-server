process.env.NODE_ENV = 'test'
const mongoose = require('mongoose');
const chai = require('chai');
var should = require('chai').should();
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
const app = require('../server')
const User = require('../models/user')
chai.use(chaiHttp);


describe('Basic Auth', function() {

  describe('signup', () => {

    it("Should create a new user", (done)=>{
      chai.request(app)
        .post('/api/sign-up')
        .send({username: 'Username', password: 'password!@3V', verifyPassword:'password!@3V'})
        .end(function(err, res){
          // res.body.success.should.equal(true);
          res.body.should.have.property('success')
          res.should.have.status(200);
          done()
        })
    })

})

  describe('login', () => {

    it("Should log user into API", (done)=>{
      chai.request(app)
        .post('/api/login')
        .send({'username': 'Username', 'password': 'password!@3V'})
        .end(function(err, res){
        res.body.success.should.equal(true);
        res.should.have.status(200);
        should.not.exist(err)
        done();
      });
    })

  })
})


describe('Manipulating Dreams', () => {
  var token = ''

  before(function(done){
    chai.request(app)
      .post('/api/login')
      .send({username: 'Username', password : 'password!@3V'})
      .end(( err, res )=> {
        token = res.body.token
        done()
      })
  })

  var dreamId = ""
  it('Should post a dream to list', (done) => {
    chai.request(app)
    .post('/api/dream/new')
    .send({'entry': 'this is the entry', 'tags': ['one','tow','cow'], title:'title', token})
    .end((err,res)=> {
      res.should.have.status(201);
      res.body.success.should.equal(true);
      res.body.should.have.property('dream')
      dreamId = res.body.dream._id
      done()
    })
  })

  it('Should Get the current Dream', (done) => {
    console.log(dreamId);
    chai.request(app)
    .get('/api/dream/'+dreamId )
    .send({token})
    .end((err, res)=>{
      res.should.have.status(200)
      res.body.dream.should.have.property('title')
      res.body.dream.should.have.property('tags')
      res.body.dream.should.have.property('entry')
      res.body.dream.should.have.property('author')
      res.body.dream.should.have.property('_id')
      done()
    })

  })
  it('Should edit the current Dream', (done) => {
    chai.request(app)
      .post('/api/dream/'+dreamId+'/edit')
      .send({'entry': 'this is the editied entry', 'tags': ['moo','two','seven','running','screaming','zombie','commas','elephant'], title:'new_title_ladies', token})
      .end((err, res)=>{
        res.body.dream.title.should.equal('new_title_ladies')
        res.body.dream.tags.should.have.lengthOf(8)
        done()
      })
  })
  it('should delete the current Dream', (done) => {
    chai.request(app)
    .del('/api/dream/'+dreamId+'/delete')
    .send({token})
    .end((err, res) => {
      res.should.have.status(200);
      // res.body..should.not.exist;
      //Search for dream should not exists
      done()
    })
  })
})

describe('Editing User info', function() {

  var token = ''
  before(function(done){
    chai.request(app)
      .post('/api/login')
      .send({'username': 'Username', 'password': 'password!@3V'})
      .end(( err, res )=> {
        token = res.body.token
        done()
      })
  })

  it('change user password',(done) => {
    chai.request(app)
    .post('/api/user/change-password')
    .send({token, oldpassword: 'password!@3V', newpassword: 'thispAssword!_k'})
    .end((err, res) =>{
      res.should.have.status(200);
      res.body.should.have.property('message')
      done()
    })
  })

  it('should delete user and dreams from database', (done)=> {
    console.log(token);
    chai.request(app)
    .del('/api/user/delete')
    .send({ token, oldpassword:'thispAssword!_k' })
    .end((err, res) => {
      res.should.have.status(200)
      // res.body.should.have.property('message')
      // console.log(res.body.message);
      done()
    })
  })

  after(function(done){
    User.find({username:'Username'}).remove().then((user)=>{
      console.log(' user has been removed.');
    }).catch(err => {
      console.log(err)
    })
    done()
  })

})
