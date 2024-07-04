/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { getUserByToken, login } from '../core/_requests'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'
import { setAuth } from '../core/AuthHelpers'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Min 3 simbol')
    .max(50, 'Maximum 50 symbols')
    .required('Username harus diisi!'),
  password: Yup.string()
    .min(3, 'Min 3 simbol')
    .max(50, 'Maximum 50 symbols')
    .required('Password harus diisi!'),
})

const initialValues = {
  username: '',
  password: '',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        const auth = await login(values.username, values.password);
        const { token, user } = auth.data;
        setCurrentUser(user);
        setAuth(token)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.log('errorlogin', error);
        saveAuth(undefined);
        setCurrentUser(undefined);
        setStatus('The login details are incorrect');
        toast.error("Username atau Password yang anda masukkan salah, Hubungi admin");
      } finally {
        setLoading(false);
      }
    },
  })

  return (
    <div className='d-flex flex-column align-items-center'>
      <form
        className='form w-100'
        noValidate
        id='kt_login_signin_form'
      >
        <div className='text-center flex-column'>
          <h1 className='text-dark fw-bolder '>POS </h1>
          <h1 className='text-dark fw-bolder '>D'HARJOSOEWARNO </h1>
        </div>

        {/* <div className='fv-row '>
          <label className='form-label fs-6 fw-bolder text-dark'>Pilih Toko</label>
          <select
            className='form-select bg-transparent'
            name="" id="">
            <option className='form-control bg-transparent' value="">Toko 1</option>
            <option value="">Toko 2</option>
          </select>
        </div> */}

        <div className='fv-row '>
          <label className='form-label fs-6 fw-bolder text-dark'>Username</label>
          <input
            type='username'
            {...formik.getFieldProps('username')}
            placeholder='Username'
            name='username'
            className=
            'form-control bg-transparent'

            autoComplete='off'
          />
          {formik.touched.username && formik.errors.username && (
            <div className='fv-plugins-message-container'>
              <span role='alert'>{formik.errors.username}</span>
            </div>
          )}
        </div>

        <div className='fv-row '>
          <label className='form-label fw-bolder text-dark fs-6 mt-5'>Password</label>
          <input
            type='password'
            {...formik.getFieldProps('password')}
            placeholder='Password'
            autoComplete='off'
            name='password'
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                formik.handleSubmit();
              }
            }}
            className=
            'form-control bg-transparent'
          />

          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>

        <div className='d-grid mt-10'>
          <button
            type='button'  // Ganti dari 'submit' ke 'button'
            id='kt_sign_in_submit'
            className='btn btn-primary'
            onClick={() => formik.handleSubmit()}  // Tangani submit secara manual
            disabled={loading || formik.isSubmitting || !formik.isValid}
          >
            <span className='indicator-label'>Continue</span>
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          {/* <div className='text-center mt-20'>
          <div className='mt-20'>
            <img src={toAbsoluteUrl("/LogoProjo.png")} alt="" className='h-150px mt-10 ' />
          </div>
        </div> */}

        </div>
        {/* <div className='row g-3 mt-20 align-center' >
        <div className='col-md-6 mt-15' >
          <img src={toAbsoluteUrl("/LogoProjo.png")} alt="" className='h-150px mt-20' />
        </div>
      </div> */}

      </form>
      {/* <footer className='mt-20 text-center'>
        <img src={toAbsoluteUrl("/LogoProjo.png")} alt="" className='h-150px ' />
      </footer> */}
      <ToastContainer />
    </div>
  )
}
