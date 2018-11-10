let express = require('express');
const passport = require('passport');
const passportConfig = require('../../config/passportConfig');
const {
  User
} = require('../models/UserModel');
const {
  ClipWord
} = require('../models/ClipModel');

passportConfig();

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('errorMsg', 'You must be logged in to see this page');
    res.redirect('/login');
  }
}

// clipword

router.post('/teach', ensureAuthenticated, function (req, res, next) {
  let clipword = req.body.clipword;
  let url = req.body.url;
  let teacher = req.user;

  req.checkBody('clipword', 'Clipword is required').notEmpty().trim();
  req.checkBody('url', 'URL is required').notEmpty().trim();

  let videoId,
    r,
    rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

  r = url.match(rx);
  videoId = r[1];

  let errors = req.validationErrors();

  if (errors) {
    res.render('teach', {
      errors
    });
  } else {
    ClipWord.findOne({
        clipword
      },
      function (err, clip) {
        if (err) {
          return next(err);
        }
        if (clip) {
          req.flash('errorMsg', 'Clipword exists already');
          return res.redirect('/teach');
        }
        let newClip = new ClipWord({
          clipword,
          videoId
        });
        newClip
          .save()
          .then(() => {
            teacher.clipwords.push(newClip);
            teacher.save();
          })
          .then(() => {
            req.flash('successMsg', 'Clip added successfully');
            res.redirect('/teach');
          });
      }
    ).catch((err) => {
      req.flash('errorMsg', 'Some other error');
    });
  }
});

router.post('/learn', function (req, res, next) {
  let clipword = req.body.clipword;

  req.checkBody('clipword', 'Enter a keyword').notEmpty().trim();

  ClipWord.findOne({
      clipword
    },
    function (err, clip) {
      if (err) {
        return next(err);
      }
      if (!clip) {
        req.flash('errorMsg', "The clipword doesn't exist");
        return res.redirect('/learn');
      }

      let video = clip.videoId;
      res.render('watch', {
        video
      });
      // req.flash('video', video);
    }
  );
});

router.get('/playlist', function (req, res) {
  ClipWord.find({}).then((clips, err) => {
    if (err) {
      console.log(err);
      return res.redirect('/learn')
    }
    res.render('playlist', {
      clips
    });
  })
});

module.exports = router;