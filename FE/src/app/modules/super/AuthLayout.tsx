/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../_metronic/helpers'

const AuthLayout = () => {
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

  return (
    <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100'>
      <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-1 order-lg-2'>
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          <div className='w-lg-500px p-10'>
            <Outlet />
          </div>
        </div>
        {/* begin::Footer */}
        <div className='d-flex flex-center flex-wrap px-5'>
          {/* begin::Links */}
          <div className='d-flex fw-semibold text-primary fs-base'>
            {/* <a href='#' className='px-5' target='_blank'>
              Terms
            </a>

            <a href='#' className='px-5' target='_blank'>
              Plans
            </a> */}

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

export { AuthLayout }
