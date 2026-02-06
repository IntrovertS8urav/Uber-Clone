import React from 'react'

const WaitingForDriver = (props) => {
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          props.waitingForDriver(false);
        }}
      >
        <i className=" text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <div className='flex tems-center justify-between'>
        <img
          className="h-12"
          src="https://tse4.mm.bing.net/th/id/OIP.ymjpxr4RPlwbLenCbbpYywHaE7?pid=Api&P=0&h=180"
        />
        <div className='text-reight'>
        <h2 className='text-lg font-medium'>{props.ride?.captain.fullname.firstname} </h2>
        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>
        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
        <p className='text-lg font-semibold'>{props.ride?.otp}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">  
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{props.ride?.pickup}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Ahmedabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">$193.20</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Ahmedabad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver
