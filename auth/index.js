'use strict';

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,

    ModelUser = require('../lib/models/user'),
    ModelContact = require('../lib/models/contact'),
    request = require('then-request'),
    kue = require('kue');


function serialization() {
  passport.serializeUser(function(user, done) {
    done(null, user.getID());
  });

  passport.deserializeUser(function(userID, done) {
    ModelUser.findByID(userID).then( (user) => {
      done(null, user);
    }, (error) => {
      done(error);
    });
  });
}

function Google() {
  passport.use(new GoogleStrategy({
      clientID: process.env.CONTACTLENS_GOOGLE_ID,
      clientSecret: process.env.CONTACTLENS_GOOGLE_SECRET,
      callbackURL: process.env.CONTACTLENS_HOST_PROTOCOL +
       "://" +
       process.env.CONTACTLENS_HOST_NAME +
       "/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done) {
      ModelUser.findByProvider(profile.provider, profile.id).then((user) => {
        if (user) {
          //TODO: update?? (yes)
          user = new ModelUser(user);
          user._members.token = accessToken;
          return user.sync().then(() => {
            return user;
          });
        } else {
          user = new ModelUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: profile.provider,
            providerID: profile.id,
            token: accessToken
          });
          return user.save();
        }
      }, (err) => {
        done(err);
      }).then((user) => {
        done(null, user);
      }, (err) => {
        console.log('google auth model error', err);
        done(err);
      });
    }
  ));
}

function getPhotosFromGoogle(user, batch) {
  let jobs = kue.createQueue({
    redis: {
      port: process.env.CONTACTLENS_REDIS_PORT,
      host: process.env.CONTACTLENS_REDIS_HOST,
      auth: process.env.CONTACTLENS_REDIS_PASSWORD,
      db: process.env.CONTACTLENS_REDIS_DB,
    }
  });
  batch.forEach((item) => {
    let job = jobs.create('gphoto', {
      link: item.link,
      id: item.id
    }).save( (err) => {
       if( !err ) {
        console.log( job.id, 'success' );
      } else {
        console.log( job.id, err );
      }
    });
  });

  jobs.process('gphoto', function(job, done){
    let params = {
    };

    let headers = {
      'Authorization': 'Bearer ' + user.getToken(),
    };

    request('GET', job.data.link, {
        qs: params,
        headers: headers,
      }).then( (response) => {
        ModelContact.findByID(job.data.id).then( (contact) => {
          //contact._members.tset.test = 'test';
          contact._members.avatar = {
            data: response.body,
            contentType: 'image/jpeg',
          };
          contact.sync().then(() => {
            done();
          }, done);
        }, done);
      }, done);
  });

  return true;
}

function importFromGoogle(user) {
  let url = 'https://www.google.com/m8/feeds/contacts/default/full';

  let params = {
    alt: 'json',
    'max-results': 1000,
    orderby: 'lastmodified',
    group: 'http://www.google.com/m8/feeds/groups/' + user.getEmail() + '/base/6', //'Contacts',
  };

  let headers = {
    'Authorization': 'Bearer ' + user.getToken(),
  };


  return request('GET', url, {
    qs: params,
    headers: headers,
  }).then( (response) => {
    let result = JSON.parse(response.body);
    let raw = [];
    result.feed.entry.forEach((contact) => {
      //console.log(contact);
      let name = contact.title.$t;
      let phone = contact.gd$phoneNumber && contact.gd$phoneNumber[0] ? contact.gd$phoneNumber[0].$t : null;

      let hasEmails = contact.gd$email && contact.gd$email.length > 0;

      let photo = false;
      if (contact.link) {
        contact.link.forEach((link) => {
          if (link.rel === 'http://schemas.google.com/contacts/2008/rel#photo') {
            photo = link.href;
          }
        });
      }

      if (name && (hasEmails || phone)) {

        let emails = [];
        if (hasEmails) {
          emails = contact.gd$email.map(email => email.address);
        }

        raw.push({
          name: name,
          emails: emails,
          phone: phone,
          address: contact.gd$postalAddress && contact.gd$postalAddress[0] ? contact.gd$postalAddress[0].$t : null,
          provider: 'google',
          providerID: contact.id.$t,
          providerPhoto: photo,
        });
      }
    });

    return ModelContact.insert(raw);
  }, (error) => {
    Error(error);
  });
}

module.exports.serialization = serialization;
module.exports.Google = Google;
module.exports.importFromGoogle = importFromGoogle;
module.exports.getPhotosFromGoogle = getPhotosFromGoogle;
