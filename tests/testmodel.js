var mocha = require('mocha');
var chai = require('chai');
var model = require('../api/forum');
var assign = require('../api/userController')
var should = chai.should();
var expect = chai.expect();

describe('Forum', function() {
    it('should create forum item', function() {
	let testItem = new model.forumPost();
	should.exist(testItem);
	testItem.should.be.instanceof(model.Town);
    });
    it('should create and initialise a new forum', function() {
	let testItem = new model.forumPost(1,'Dundee','Sun','Town');
	testItem.id.should.equal(1);
	testItem.name.should.equal('Dundee');
	testItem.weatherID.should.equal('Sun');
  testItem.resource.should.equal('Town');

    });
    it('should initialise from JSON', function() {
	let testItem = new model.forumPost();
	testItem.fromJSON( { id:1, name:'Dundee', weatherID:'Sun', resource:'Town' } );

	testItem.id.should.equal(1);
	testItem.name.should.equal('Dundee');
	testItem.weatherID.should.equal('Sun');
  testItem.resource.should.equal('Town');
    });
    it('should reject incorrect initialisation', function() {
	let testItem = new model.forumPost();
	testItem.fromJSON( { id:-100, name:38, weatherID:"moop", resource:"Beach" } );

	testItem.id.should.not.equal(-100);
  testItem.name.should.not.equal(38);
	testItem.weatherID.should.not.equal("moop");
  testItem.resource.should.not.equal("Beach");

    });
});

describe('User', function() {
    it('should create a user', function() {
	let testUser = new assign.createUser();
	should.exist(testUser);
	testUser.should.be.instanceof(assign.User);
    });
    it('should create and initialise a new user', function() {
	let testUser = new model.createUser(1,'Bob','cs5003@st-andrews.ac.uk','plaintext');
  testUser.id.should.equal(1);
  testUser.name.should.equal('Bob');
	testUser.email.should.equal('cs5003@st-andrews.ac.uk');
  testUser.password.should.equal('plaintext');

    });
    it('should initialise User from JSON', function() {
	let testUser = new assign.createUser();
	testUser.fromJSON( { id:1, name:'Bob', email:'cs5003@st-andrews.ac.uk', password:'plaintext' } );

	testUser.id.should.equal(1);
	testUser.name.should.equal('Bob');
	testUser.email.should.equal('cs5003@st-andrews.ac.uk');
  testUser.password.should.equal('plaintext');
    });
    it('should reject incorrect initialisation', function() {
	let testUser = new assign.createUser();
	testUser.fromJSON( { id:999, name:12, weatherID:"compsci", resource:"asdf" } );

  testUser.id.should.not.equal(999);
  testUser.name.should.not.equal(12);
	testUser.email.should.not.equal("compsci");
  testUser.password.should.not.equal("asdf");

    });
});
