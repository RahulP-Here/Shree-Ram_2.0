import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { MdFastfood, MdNoFood, MdDeleteForever } from "react-icons/md";
// import { FcPaid } from "react-icons/fc";
import SingleOrder from './SingleOrder';

const LiveOrder = ({ paid, billRef, setIsPaid, list, updateList, currentCustomer, setCurrent, addToken, updateLastToken, lastToken, update, playAudio }) => {


  const [orders, setOrders] = useState([])

  useEffect(() => {
    let order_list = list.map(id => {
      let orderDetail = JSON.parse(localStorage.getItem(id) || '{}');
      return { id, ...orderDetail };
    });

    // Filter orders based on `paid` and sort by `id` (customer_id, which is a timestamp)
    const filteredOrders = order_list
      .filter(order => order.paid === paid)
      .sort((a, b) => Number(b.id) - Number(a.id)); // Newest to oldest by customer_id

    setOrders(filteredOrders);
  }, [list, paid]);

  const newToken = () => {
    addToken(lastToken);
    updateLastToken(lastToken + 1);
  };

  const clear = () =>{
    orders.forEach((order) => {
      localStorage.removeItem(order.id);
      update();

    })
    setCurrent(NaN);
  }

  const change = () => {
    setIsPaid(!paid);
    setCurrent(NaN);
  }

  return (
    <aside className='border border-black min-w-[15rem] w-[25%] relative flex flex-col h-full bg-light-primary px-2 py-1 gap-2 rounded-md'>
      <div className='bg-alwhite flex justify-between items-center rounded-md px-2 cursor-pointer select-none' onClick={change}>
        {!paid && <>
          <span className='font-bold text-3xl text-accent'><MdFastfood /></span>
          <h3 className='font-bold text-2xl py-4 pl-2 text-text'>Live Orders</h3>
        </>}
        {paid && <>
          <span className='font-bold text-3xl text-accent'><MdNoFood /></span>
          <h3 className='font-bold text-2xl py-4 pl-2 text-text'>Closed Orders</h3>
        </>}
      </div>


      <div className="order-list flex flex-col gap-4 overflow-auto scrollbar-custom h-full ">
        {orders.map((customer, index) => {
          return <SingleOrder billRef={billRef} paid={paid} customer={customer} customerId={customer.id} key={customer.id} updateList={updateList} currentCustomer={currentCustomer} setCurrent={setCurrent} playAudio={playAudio} />
        })}
      </div>

{
  // paid && <button className='p-4 rounded-md bg-red-600 text-white font-bold sticky bottom-2 w-full' onClick={() => { localStorage.clear(); update(); setCurrent(NaN); }}>Clear</button>
  paid && <button className='pop-effect-button p-4 rounded-md bg-red-600 text-white font-bold sticky bottom-2 w-full' onClick={clear}>Clear</button>
}
      <button className='pop-effect-button p-4 rounded-md bg-primary text-white font-bold sticky bottom-2 w-full' onClick={newToken}>New Token</button>

    </aside>
  )
}

export default LiveOrder;
