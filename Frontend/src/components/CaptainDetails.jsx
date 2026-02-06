import React, {useContext} from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {

  const {captain} = useContext(CaptainDataContext);
  //console.log("Current Captain Data:", captain);
  if (!captain || !captain.fullname) {
    return (
      <div className="p-6">
        <p>Loading captain information...</p>
      </div>
    );
  }

  return (
    <div>
      
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <img className="h-10 w-10 rounded-full object-cover" src="https://tse2.mm.bing.net/th/id/OIP.LmhFJgCh91ZTEJoOMEEtSQHaHa?pid=Api&P=0&h=180" alt="" />
            
          <h4 className="text-lg font-medium">
          {captain.fullname.firstname} {captain.fullname.lastname}
          </h4>
          </div>
          <div>
            <h4 className="text-xl font-semibold">$29</h4>
            <p className="text-sm text-gray-600">Earned</p>
          </div>
        </div>
       <div className="flex p-3 mt-6 bg-gray-100 rounded-xl justify-center gap-5 items-start">
  <div className="text-center">
    <i className='text-2xl font-thin ri-timer-2-line'></i>
    <h5 className='text-lg font-medium'>10.2</h5>
    <p className='text-sm text-gray-600'>Hours Online</p>
  </div>
  <div className="text-center">
    <i className='text-2xl font-thin ri-speed-up-line'></i>
    <h5 className='text-lg font-medium'>30.5</h5>
    <p className='text-sm text-gray-600'>Total KM</p> {/* FIXED LABEL */}
  </div>
  <div className="text-center">
    <i className='text-2xl font-thin ri-booklet-line'></i>
    <h5 className='text-lg font-medium'>20</h5>
    <p className='text-sm text-gray-600'>Jobs Done</p> {/* FIXED LABEL */}
  </div>
</div>
      
    </div>
  )
}

export default CaptainDetails
