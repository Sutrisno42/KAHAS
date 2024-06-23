import React, { useEffect, useRef } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { KTSVG } from '../../../helpers'
import { Dropdown1 } from '../../content/dropdown/Dropdown1'
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils'

type Props = {
    className: string,
    productData: { name: string, data: number[] }[],
    predictionData: number[]
}

const ChartsWidget9: React.FC<Props> = ({ className, productData, predictionData }) => {
    const chartRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const chart = refreshChart()

        return () => {
            if (chart) {
                chart.destroy()
            }
        }
    }, [chartRef, productData, predictionData])

    const refreshChart = () => {
        if (!chartRef.current) {
            return
        }

        const height = parseInt(getCSS(chartRef.current, 'height'))

        const chart = new ApexCharts(chartRef.current, getChartOptions(height, productData, predictionData))
        if (chart) {
            chart.render()
        }

        return chart
    }

    return (
        <div className={`card ${className}`}>
            <div className='card-header border-0 pt-5'>
                {/* <h3 className='card-title align-items-start flex-column'>
                    <span className='card-label fw-bold fs-3 mb-1'>Prediksi Produk</span>
                    <span className='text-muted fw-semibold fs-7'>Sales Prediction for Selected Products</span>
                </h3> */}
                {/* <div className='card-toolbar'>
                    <button
                        type='button'
                        className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                    >
                        <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
                    </button>
                    <Dropdown1 />
                </div> */}
            </div>

            <div className='card-body'>
                <div ref={chartRef} id='kt_charts_widget_1_chart' style={{ height: '350px' }} />
            </div>
        </div>
    )
}

export { ChartsWidget9 }

function getChartOptions(height: number, productData: { name: string, data: number[] }[], predictionData: number[]): ApexOptions {
    const labelColor = getCSSVariableValue('--kt-gray-500')
    const borderColor = getCSSVariableValue('--kt-gray-200')
    const baseColor = getCSSVariableValue('--kt-primary')
    const secondaryColor = getCSSVariableValue('--kt-gray-300')

    const extendedProductData = productData.map(product => ({
        name: product.name,
        data: [...product.data, null] // Add a null value for the prediction slot
    }));

    const predictionSeries = predictionData.map((pred, index) => ({
        name: `Prediction ${productData[index].name}`,
        data: new Array(5).fill(null).concat(pred) // Add null values for the first 5 slots, then the prediction value
    }));

    return {
        series: [
            ...extendedProductData,
            ...predictionSeries
        ],
        chart: {
            fontFamily: 'inherit',
            type: 'bar',
            height: height,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '30%',
                borderRadius: 5,
            },
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: ['Bulan 1', 'Bulan 2', 'Bulan 3', 'Bulan 4', 'Bulan 5', 'Hasil prediksi'],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: labelColor,
                    fontSize: '12px',
                },
            },
        },
        fill: {
            opacity: 1,
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
        },
        tooltip: {
            style: {
                fontSize: '12px',
            },
            y: {
                formatter: function (val) {
                    return val !== null ? `${val} units` : 'No data'
                },
            },
        },
        colors: [baseColor, ...productData.map(() => baseColor), baseColor],
        grid: {
            borderColor: borderColor,
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
    }
}
