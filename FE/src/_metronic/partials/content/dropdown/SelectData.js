import React, {useRef, useEffect, useState} from 'react'

/**
 *
 * @param {*} props {
 * title: string
 * disabled: boolean
 * default: string
 * data: {text: string, value: string}
 * className: string
 * setFieldValue: () => void
 * search: boolean
 * search_dynamic: boolean
 * scroll_behaviour?: (val: HTMLUListElement) => void
 * scroll_loading?: boolean
 * setSearch?: (val: string) => void
 * }
 * @returns
 */

export default function SelectData(props) {
  const [showOption, setShowOption] = useState(false)
  // console.log(props, "props");
  // console.log(props.data);
  const open = () => {
    if (!props.disabled) {
      setShowOption(true)
      setTesValue(selected)
    }
  }
  const close = () => setShowOption(false)

  const [selected, setSelected] = useState('')
  const [search, setSearch] = useState('')
  const [tes_value, setTesValue] = useState('')

  useEffect(() => {
    if (props.default !== undefined) {
      const value_default = props.data.find(
        (data) => data.value.toString() === props.default.toString()
      )
      setSelected(value_default === undefined ? props.default : value_default.text)
    }
  }, [props.data])

  const wrapperRef = useRef(null)

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        close()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  const list = useRef(null)

  useEffect(() => {
    const el = list.current
    if (el !== null && props.scroll_behaviour) {
      el.addEventListener(
        'scroll',
        () => {
          props.scroll_behaviour(el)
        },
        false
      )
    }
    return () => {
      if (el !== null && props.scroll_behaviour) {
        el.removeEventListener(
          'scroll',
          () => {
            props.scroll_behaviour(el)
          },
          false
        )
      }
    }
  }, [props.scroll_behaviour])

  useEffect(() => {
    if (props.search || props.search_dynamic) {
      setTimeout(() => {
        props.setSearch(search)
      }, 1000)
    }
  }, [search])

  return (
    <div
      ref={wrapperRef}
      className={`
      menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px
        ${props.disabled ? 'bg-gray-200' : 'bg-white'}
        ${props.className}
      `}
      data-kt-menu='true'
    >
      <div onClick={open} className='flex justify-between items-center cursor-pointer'>
        <span className={selected === '' ? 'text-gray-500' : 'text-black'}>
          {selected === '' ? props.title : selected}
        </span>
        <img src='/icons/chevron-down.svg' alt='icon chevron down' />
      </div>
      {props.disabled ? null : (
        <ul
          className={`
          card shadow absolute z-10 left-0 w-full bg-white
          overflow-auto max-h-40
          ${showOption ? 'block' : 'hidden'}`}
          style={{padding: 8, top: 0}}
          ref={props.scroll_behaviour ? list : null}
        >
          {props.search || props.search_dynamic ? (
            <li className='-mx-2 py-2 px-3'>
              <input
                type='text'
                name='search'
                id=''
                autoComplete='off'
                placeholder={props.title}
                value={tes_value}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setTesValue(e.target.value)
                }}
                className='w-full outline-none border rounded px-3 py-2 focus:outline-none'
              />
            </li>
          ) : null}

          {props.scroll_loading ? (
            <li className='-mx-2 py-2 px-3 text-center font-bold'>Loading</li>
          ) : props.search ? (
            props.data.length === 0 ? (
              <li className='-mx-2 py-2 px-3 transition-all hover:bg-gray-50 cursor-pointer'>
                Data tidak ditemukan
              </li>
            ) : (
              props.data.map((data) => (
                <li
                  key={data.value}
                  onClick={() => {
                    setSelected(data.text)
                    setShowOption(false)
                    props.setFieldValue(data.value.toString())
                  }}
                  className='-mx-2 py-2 px-3 transition-all hover:bg-gray-50 cursor-pointer'
                >
                  {data.text}
                </li>
              ))
            )
          ) : props.search_dynamic ? (
            props.data.length === 0 ? (
              <li
                onClick={() => {
                  setSelected(search)
                  setShowOption(false)
                  props.setFieldValue(search)
                }}
                className='-mx-2 py-2 px-3 transition-all hover:bg-gray-50 cursor-pointer'
              >
                {search}
              </li>
            ) : (
              props.data.map((data) => (
                <li
                  key={data.value}
                  onClick={() => {
                    setSelected(data.text)
                    setShowOption(false)
                    props.setFieldValue(data.value.toString())
                  }}
                  className='-mx-2 py-2 px-3 transition-all hover:bg-gray-50 cursor-pointer'
                >
                  {data.text}
                </li>
              ))
            )
          ) : (
            props.data.map((data) => (
              <li
                key={data.value}
                onClick={() => {
                  setSelected(data.text)
                  setShowOption(false)
                  props.setFieldValue(data.value.toString())
                }}
                className='-mx-2 py-2 px-3 transition-all hover:bg-gray-50 cursor-pointer'
              >
                {data.text}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
