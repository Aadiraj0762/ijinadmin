import { initializeApp } from 'firebase/app';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
// config
import { FIREBASE_API } from '../config-global';

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

const GOOGLE_PROVIDER = new GoogleAuthProvider();
const GITHUB_PROVIDER = new GithubAuthProvider();
const TWITTER_PROVIDER = new TwitterAuthProvider();

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
          let userRef = doc(DB, 'admin', user.uid);
          let docSnap = await getDoc(userRef);
          let profile;
          let role = 'admin';

          if (!docSnap.exists()) {
            userRef = doc(DB, 'operations', user.uid);
            docSnap = await getDoc(userRef);
            role = 'operations';
          }

          if (docSnap.exists()) {
            profile = docSnap.data();
            dispatch({
              type: 'INITIAL',
              payload: {
                isAuthenticated: true,
                user: {
                  ...user,
                  ...profile,
                  role,
                },
              },
            });
          } else {
            dispatch({
              type: 'INITIAL',
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        } else {
          dispatch({
            type: 'INITIAL',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(AUTH, email, password);
      const user = userCredential.user;
      let userRef = doc(DB, 'admin', user.uid);
      let docSnap = await getDoc(userRef);
      let role = '';

      if (docSnap.exists()) {
        role = 'admin';
      } else {
        userRef = doc(DB, 'users', user.uid);
        docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          role = 'operations';
        }
      }

      if (!docSnap.exists()) {
        await signOut(AUTH);
        throw new Error('User does not have proper permissions');
      } else {
        const userData = { ...user, ...docSnap.data(), role };
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user: userData,
          },
        });
        return userData;
      }
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    signInWithPopup(AUTH, GOOGLE_PROVIDER);
  }, []);

  const loginWithGithub = useCallback(() => {
    signInWithPopup(AUTH, GITHUB_PROVIDER);
  }, []);

  const loginWithTwitter = useCallback(() => {
    signInWithPopup(AUTH, TWITTER_PROVIDER);
  }, []);

  // REGISTER
  const register = useCallback((email, password, firstName, lastName) => {
    createUserWithEmailAndPassword(AUTH, email, password).then(async (res) => {
      const userRef = doc(collection(DB, 'admin'), res.user?.uid);

      await setDoc(userRef, {
        uid: res.user?.uid,
        email,
        displayName: `${firstName} ${lastName}`,
      });
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    signOut(AUTH);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'firebase',
      login,
      loginWithGoogle,
      loginWithGithub,
      loginWithTwitter,
      register,
      logout,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      login,
      loginWithGithub,
      loginWithGoogle,
      loginWithTwitter,
      register,
      logout,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
