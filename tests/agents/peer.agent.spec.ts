import { expect } from 'chai';
import { stub } from 'sinon';
import { PeerAgent } from '../../src/agents/peer.agent';
import { SourceService } from '../../src/services/source.service';
import { Part, Predicate } from '../../src/interfaces/task.interface';
import { WaspAgent } from '../../src/agents/wasp.agent';
import { Actions } from '../../src/interfaces/query.interface';


describe('PeerAgent', () => {

  let sourceStub;
  let peerAgent;

  SourceService.peer = new PeerAgent('host_id');

  beforeEach(() => {
    sourceStub = stub(SourceService.prototype, 'request');
    peerAgent = new PeerAgent('peer_id');
  });

  afterEach(() => {
    peerAgent = undefined;
    sourceStub.restore();
  });

  it('getCores() should return value equal to 4', done => {
    sourceStub.callsFake((request, type) => {

        expect(type).to.equal('info');
        expect(request.subject).to.be.a('string');
        expect(request.agent).to.equal('peers');
        expect(request.data.property).to.equal('cores');

        return Promise.resolve(4);
      });

    peerAgent.getCores().then(cores => {
      expect(cores).to.be.equal(4);
      done();
    });

  });

  it('getDevices() should return value equal to 2', done => {
    sourceStub.callsFake((request, type) => {

        expect(type).to.equal('info');
        expect(request.subject).to.be.a('string');
        expect(request.agent).to.equal('peers');
        expect(request.data.property).to.equal('devices');

        return Promise.resolve(2);
      });

    peerAgent.getDevices().then(devices => {
      expect(devices).to.equal(2);
      done();
    });

  });

  it('setUID() should return true', done => {
    sourceStub.callsFake((request, type) => {

        expect(type).to.equal('task');
        expect(request.subject).to.be.a('string');
        expect(request.agent).to.equal('peers');
        expect(request.data.attribute).to.equal('uid');
        expect(request.data.value).to.equal('peer_id');

        return Promise.resolve({id: "peer_id", value: true});
      });

    peerAgent.setUID('peer_id').then(result => {
        expect(result).to.be.true;
        done();
    });

  });

  it ('join() should return true', done => {

    sourceStub.callsFake((request, type) => {
        expect(type).to.equal('task');
        expect(request.subject).to.be.a('string');
        expect(request.agent).to.equal('peers');
        expect(request.predicate).to.equal(Predicate.add);
        expect(request.data.attribute).to.equal('swarms');
        expect(request.data.part).to.equal(Part.name);
        expect(request.data.value).to.equal('swarm_name');

        return Promise.resolve(true);
      });

    peerAgent.join('swarm_name').then(result => {
      expect(result).to.be.true;
      done();
    });

  });

  it('leave() should return true', done => {

    sourceStub.callsFake((request, type) => {
        expect(type).to.equal('task');
        expect(request.subject).to.be.a('string');
        expect(request.agent).to.equal('peers');
        expect(request.predicate).to.equal(Predicate.exc);
        expect(request.data.attribute).to.equal('swarms');
        expect(request.data.part).to.equal(Part.name);
        expect(request.data.value).to.equal('swarm_name');

        return Promise.resolve(true);
      });

    peerAgent.leave('swarm_name').then(result => {
      expect(result).to.be.true;
      done();
    });

  });

  it('isOwner() should return false', done => {

    sourceStub.callsFake((request, type) => {
      expect(type).to.be.equal('task');
      expect(request.subject).to.be.a('string');
      expect(request.agent).to.equal('peers');
      expect(request.data.attribute).to.equal('owner');

      return Promise.resolve(false);
    });

    peerAgent.isOwner().then(result => {
      expect(result).to.be.false;
      done();
    });

  });

  it('isActive() should return true', done => {

    sourceStub.callsFake((request, type) => {
        expect(type).to.be.equal('info');
        expect(request.subject).to.be.a('string');
        expect(request.agent).to.equal('peers');
        expect(request.data.property).to.equal('active');

        return Promise.resolve(true);
      });

    peerAgent.isActive().then(result => {
      expect(result).to.be.true;
      done();
    });

  });


  it('remove() should return true', done => {
    sourceStub.callsFake((request, type) => {
      expect(request.agent).to.equal('peers');
      expect(request.action).to.equal(Actions.del);
      expect(request.data.attribute).to.equal('id');
      expect(request.data.value).to.equal('peer_id');

      return Promise.resolve(true);
    });

    peerAgent.remove().then(result => {
      expect(result).to.be.true;
      done();
    });
  });

});
