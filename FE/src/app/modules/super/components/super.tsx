/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { getUserByToken, login } from '../core/_requests'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'
import { setAuth } from '../core/AuthHelpers'


export function Super() {
    const navigate = useNavigate();
    useEffect(() => {
        const root = document.getElementById('root')
        if (root) {
            root.style.height = '100%'
        }
        return () => {
            if (root) {
                root.style.height = 'auto'
            }
        }
    }, [])

    const [selectedStore, setSelectedStore] = useState('');

    const handleStoreSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStore(event.target.value);
    };

    const handleContinue = () => {
        if (selectedStore === 'toko1') {
            window.location.href = 'http://localhost:3011/auth';
        } else if (selectedStore === 'toko2') {
            window.location.href = 'http://localhost:3012/auth';
        }
    };

    return (
        <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
            <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-1 order-lg-2'>
                <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
                    <div className='w-lg-500px p-10'>
                        {/* <Outlet /> */}
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

                                <div className='fv-row '>
                                    <label className='form-label fs-6 fw-bolder text-dark'>Pilih Toko</label>
                                    <select
                                        className='form-select bg-transparent'
                                        value={selectedStore}
                                        onChange={handleStoreSelection}
                                        name="" id="">
                                        <option className='form-control bg-transparent' value="">Pilih</option>
                                        <option className='form-control bg-transparent' value="toko1">Toko 1</option>
                                        <option className='form-control bg-transparent' value="toko2">Toko 2</option>
                                    </select>
                                </div>
                                <div className='d-grid mt-10'>
                                    <button
                                        type='button'  // Ganti dari 'submit' ke 'button'
                                        id='kt_sign_in_submit'
                                        className='btn btn-primary'
                                        onClick={handleContinue}
                                        disabled={!selectedStore}
                                    >
                                        <span className='indicator-label'>Continue</span>
                                        {/* {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )} */}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* begin::Footer */}
                <div className='d-flex flex-center flex-wrap px-5'>
                    {/* begin::Links */}
                    <div className='d-flex fw-semibold text-primary fs-base'>
                        <a href='#' className='px-5 ' target='_blank'>
                            <img src={toAbsoluteUrl("/LogoProjo.png")} alt="" className='h-50px' />
                        </a>
                        {/* <img src={toAbsoluteUrl("/LogoProjo.png")} alt="" className='h-150px mt-20' /> */}
                    </div>
                    {/* end::Links */}
                </div>
                {/* end::Footer */}
            </div>
            <div
                className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-2 order-lg-1'
                style={{ backgroundImage: `url(${toAbsoluteUrl('/media/misc/auth-bg.png')})` }}
            >
                <div className='d-flex flex-column flex-center py-15 px-5 px-md-15 w-100'>
                    <img
                        className='mx-auto w-275px w-md-50 w-xl-250px mb-10 mb-lg-20'
                        src={toAbsoluteUrl('logo1.svg')}
                        alt=''
                    />
                    <h1 className='text-white fs-2qx fw-bolder text-center mb-7'>
                        POS Fast, Efficient and Productive
                    </h1>
                </div>
            </div>
        </div>
    )
}
