
// Signup Route (Force Auth0 to show signup page)
export const DisplaySignUpPage = async (req: any, res: any) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/profile');
  } else {
    res.oidc.login({
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  }
}

// Login Route (No DB interaction, just redirect)
export const DisplayLogInPage = async (req: any, res: any) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.oidc.login();  // Redirect to Auth0 login page
  }
}