import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserByToken} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
    localStorage.clear();
  }

  return (
    <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { saveAuth, auth, logout, setCurrentUser, currentUser } = useAuth();
  const didRequest = useRef(false);
  const token = localStorage.getItem('token'); // Change here
  const userJSON = localStorage.getItem('user'); // Change here
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const fetchDataFromSessionStorage = () => {
      if (token && userJSON) {
        const user = JSON.parse(userJSON);
        setCurrentUser(user);
      } else {
        console.error('Data tidak ditemukan di sessionStorage');
        console.error('Data tidak ditemukan di sessionStorage',token);
        console.error('Data tidak ditemukan di sessionStorage',userJSON);
      }
    };

    if (!didRequest.current) {
      fetchDataFromSessionStorage();
      didRequest.current = true;
    }

    setShowSplashScreen(false);
  }, [token, userJSON, saveAuth, setCurrentUser, logout]);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};


export {AuthProvider, AuthInit, useAuth}
