var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var api = require('../api/server');
var server = require('../main');

describe('API', function() {
    it('should be able to POST items', function() {
	let items = { id:1, title:'Friday', desc:'Message', town:'Dundee', type:'Text', date:'25/04/18' }
	chai.request(server)
	    .post('/addForumPost')
	    .send(items)
	    .end( function(err,res) {
		res.should.have.status(201);
		res.text.should.be.a('string');
		let obj = JSON.parse(res.text);
		obj.should.have.property('id');
		obj.id.should.equal(1);
    obj.should.have.property('title');
    obj.title.should.equal('Friday');
		obj.should.have.property('desc');
		obj.desc.should.equal('Message');
    obj.should.have.property('town');
    obj.town.should.equal('Dundee');
    obj.should.have.property('type');
    obj.type.should.equal('Text');
    obj.should.have.property('date');
    obj.date.should.equal('25/04/18');
	    });
    });
    it('should be able to GET model', function() {
	chai.request(server)
	    .get('/getPosts')
	    .end( function(err,res) {
		res.should.have.status(200);
		let obj = JSON.parse(res.text);
		obj.should.have.property('allitems');
		obj.allitems.should.be.an('array');
	    });
    });
});
