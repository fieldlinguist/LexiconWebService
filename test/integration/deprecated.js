'use strict';
/* globals Promise */

var expect = require('chai').expect;
var supertest = require('supertest');

var api = require('../../');

describe('/v1', function() {
  it('should load the service', function(){
    expect(api).to.be.defined;
  });
});
