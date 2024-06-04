// const withAuth = (req, res, next) => {
//     // TODO: Add a comment describing the functionality of this if statement
//     // if the user not logged_in then it will redirect to the login page else move on to next step 
//     if (!req.session.passport.user.id) {
//       res.redirect('/login');
//     } else {
//       next();
//     }
//   };
  
//   module.exports = withAuth;
  
const withAuth = (req, res, next) => {
  // If the user isn't logged in, redirect them to the login route
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

module.exports = withAuth;
