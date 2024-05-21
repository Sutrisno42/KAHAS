/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { KTSVG } from '../../../helpers'
import { Dropdown1 } from '../../content/dropdown/Dropdown1'
import { convertIDR } from '../../../../app/functions/global'
import { showKeuangan } from '../../../../app/functions/global/api'

type Props = {
  className: string
  searchType: string;
}
interface Data {
  summary_product: any;
  summary: any;
}

const ListsWidget1: React.FC<Props> = ({ className, searchType }) => {
  const [keuangan, setKeuangan] = useState<Data | null>(null);
  const showData = () => {
    showKeuangan()
      .then(data => {
        console.log(data);
        setKeuangan(data);
        // setProductSummary(data?.summary_product?.data || []);
      })
      .catch(error => {
        console.error('Error fetching suppliers:', error);
      });
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <div className={`card ${className}`}>
      <li className="d-flex align-items-center py-2">
        <span className="bullet me-5"></span>Total HPP :  {convertIDR(keuangan?.summary?.total_hpp || 0)}
      </li>
      <li className="d-flex align-items-center py-2">
        <span className="bullet me-5"></span>Total Omzet : {convertIDR(keuangan?.summary?.total_omset || 0)}
      </li>
      <li className="d-flex align-items-center py-2">
        <span className="bullet me-5"></span>Total Profit : {convertIDR(keuangan?.summary?.total_profit || 0)}
      </li>
    </div>
  )
}

export { ListsWidget1 }
