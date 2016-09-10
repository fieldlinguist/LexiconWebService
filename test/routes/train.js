'use strict';

var expect = require('chai').expect;

var train = require('./../../routes/train');

describe('train routes', function() {
  it('should load', function() {
    expect(train).to.be.a('object');
    expect(train.router).to.be.a('function');
    expect(train.trainLexicon).to.be.a('function');
  });
});
