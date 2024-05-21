import usePageTitle from '../../functions/global/usePageTitle';
import { Route, Routes } from 'react-router-dom'
import { Registration } from './components/Registration'
import { ForgotPassword } from './components/ForgotPassword'
import { Super } from './components/super'
import { AuthLayout } from './AuthLayout'

const AuthPage = () => {
  usePageTitle('Login');

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='toko' element={<Super />} />
        <Route path='registration' element={<Registration />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route index element={<Super />} />
      </Route>
    </Routes>
  );
};

export { AuthPage }
