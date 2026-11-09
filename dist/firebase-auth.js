
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js';












const firebaseConfig = {
  apiKey: 'AIzaSyDWcDlrgOstgBe7QEh1SXxwpjkB_0fz4UY',
  authDomain: 'jungle-cook-hw7.firebaseapp.com',
  projectId: 'jungle-cook-hw7',
  storageBucket: 'jungle-cook-hw7.firebasestorage.app',
  messagingSenderId: '160131585783',
  appId: '1:160131585783:web:6936409ec3d3340fb6e5f2',
  measurementId: 'G-7KB66BLYX8'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const accountLink = document.querySelector('.main-menu .login-link');
const yourRecipesLink = document.querySelector('.main-menu .your-recipes-link');
const forms = document.querySelectorAll('.demo-form');
let signedIn = false;

onAuthStateChanged(auth, user => {
  signedIn = Boolean(user);
  if (accountLink) {
    accountLink.textContent = user ? 'Logout' : 'Login';
    accountLink.setAttribute('href', user ? '#' : 'login.html');
    if (user) accountLink.removeAttribute('aria-current');
  }
  if (yourRecipesLink) yourRecipesLink.hidden = !user;
});

if (accountLink) {
  accountLink.addEventListener('click', async event => {
    if (!signedIn) return; 
    event.preventDefault();
    try {
      await signOut(auth);
      window.location.href = 'login.html';
    } catch (error) {
      alert('Could not log out. Please try again.');
      console.error('Logout failed:', error.code);
    }
  });
}









function explainError(error) {
  switch (error.code) {
    case 'auth/email-already-in-use': return 'That email already has an account. Try Login instead.';
    case 'auth/invalid-email': return 'Please type a valid email address.';
    case 'auth/weak-password': return 'Password needs at least 6 characters.';
    case 'auth/invalid-credential': return 'Email or password is incorrect.';
    case 'auth/wrong-password': return 'Email or password is incorrect.';
    case 'auth/user-not-found': return 'Email or password is incorrect.';
    case 'auth/operation-not-allowed': return 'Email/Password sign-in is not enabled in Firebase.';
    case 'auth/network-request-failed': return 'Network problem. Check your connection.';
    case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
    default: return 'There was a problem. Please try again. (' + (error.code || 'unknown') + ')';
  }
}

forms.forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    const button = form.querySelector('button[type="submit"]');
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const signup = form.dataset.demoForm === 'signup';

    if (password.length < 6) {
      message.textContent = 'Password needs at least 6 characters.';
      return;
    }






    

    button.disabled = true;
    message.textContent = signup ? 'Creating account...' : 'Logging in...';
    try {
      if (signup) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const firstName = form.elements.firstName.value.trim();
        const lastName = form.elements.lastName.value.trim();
        if (firstName || lastName) {
          await updateProfile(result.user, {displayName: `${firstName} ${lastName}`.trim()});
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      message.textContent = 'Success! You are logged in.';
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Firebase authentication:', error.code);
      message.textContent = explainError(error);
    } finally {
      button.disabled = false;
    }
  });
});
