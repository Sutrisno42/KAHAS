import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { useLayout } from '../../core'

const SidebarLogo = () => {
  const { config } = useLayout()
  const appSidebarDefaultMinimizeDesktopEnabled =
    config?.app?.sidebar?.default?.minimize?.desktop?.enabled
  const appSidebarDefaultCollapseDesktopEnabled =
    config?.app?.sidebar?.default?.collapse?.desktop?.enabled
  const toggleType = appSidebarDefaultCollapseDesktopEnabled
    ? 'collapse'
    : appSidebarDefaultMinimizeDesktopEnabled
      ? 'minimize'
      : ''
  const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? 'active' : ''
  const appSidebarDefaultMinimizeDefault = config.app?.sidebar?.default?.minimize?.desktop?.default
  return (
    <div className='app-sidebar-logo px-6 font-dark' id='kt_app_sidebar_logo'>
      <Link to='/dashboard'>
        {config.layoutType === 'dark-sidebar' ? (
          <div className="d-flex align-items-center">
            <img
              alt="Logo"
              src={toAbsoluteUrl("/logo1.svg")}
              className="h-50px app-sidebar-logo-default img-fluid"
            />
            <h4 className=" text-light ms-1 mx-2">D'HARJOSOEWARNO</h4>
          </div>

        ) : (
          <>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/logo1.svg')}
              className='h-50px app-sidebar-logo-default theme-light-show'
            />
          </>
        )}

        <img
          alt='Logo'
          src={toAbsoluteUrl('/media/logos/default-small.svg')}
          className='h-20px app-sidebar-logo-minimize'
        />
      </Link>

      {(appSidebarDefaultMinimizeDesktopEnabled || appSidebarDefaultCollapseDesktopEnabled) && (
        <div
          id='kt_app_sidebar_toggle'
          className={clsx(
            'app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary body-bg h-30px w-30px position-absolute top-50 start-100 translate-middle rotate',
            { active: appSidebarDefaultMinimizeDefault }
          )}
          data-kt-toggle='true'
          data-kt-toggle-state={toggleState}
          data-kt-toggle-target='body'
          data-kt-toggle-name={`app-sidebar-${toggleType}`}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr079.svg' className='svg-icon-2 rotate-180' />
        </div>
      )}
    </div>
  )
}

export { SidebarLogo }
