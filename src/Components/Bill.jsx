import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useRef } from 'react'

const BillItem = ({ index, food_name, food_img, item, current, current_Order, update, isPaid }) => {

  let item_quantity = item.item_quantity;
  let updated_oreder = { ...current_Order };

  const addQty = () => {
    updated_oreder.ordered_items[index].item_quantity++;
    localStorage.setItem(current, JSON.stringify(updated_oreder));
    update();
  }

  const subQty = () => {
    if (item_quantity <= 1) {
      updated_oreder.ordered_items.splice(index, 1);
    }
    else {
      updated_oreder.ordered_items[index].item_quantity--;
    }
    localStorage.setItem(current, JSON.stringify(updated_oreder));
    update();
  }

  return (
    <>
      <tr className="border-b border-gray-400">

        {/* Item Index and TimeStamp */}
        <td className=" pr-2 ">
          {/* If you have an item image URL, uncomment and use this line */}
          <span className="font-medium px-2 bg-primary text-alwhite">{index + 1}</span>
          <span className="text-sm text-gray-500 pl-2">{item.order_time}</span>
        </td>

        {/* Item Name and Image */}
        <td className="py-2 px-4 flex items-center space-x-4">
          {/* If you have an item image URL, uncomment and use this line */}
          <img src={food_img} alt={food_name} className="w-10 h-10 rounded" />
          <span className="font-bold text-gray-800 text-lg">{food_name}</span>
        </td>

        {/* Item Price */}
        <td className="py-2 px-4 text-center text-gray-600 text-lg">
          ₹{item.item_price.toFixed(2)}
        </td>

        {/* Quantity */}
        <td className="py-2 px-4 text-center">

          {
            isPaid ? <span className="font-semibold text-gray-700 text-lg">X &nbsp; {item.item_quantity}</span> :
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={subQty}
                  className="pop-effect-button px-3 py-2 text-xl font-semibold bg-gray-300 hover:bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="font-semibold text-gray-700 text-lg">{item.item_quantity}</span>
                <button
                  onClick={addQty}
                  className="pop-effect-button px-3 py-2 text-xl font-semibold bg-gray-300 hover:bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
          }

        </td>

        {/* Total */}
        <td className="py-2 px-4 font-semibold text-orange-600 text-right text-lg">
          ₹{(item.item_quantity * item.item_price).toFixed(2)}
        </td>

      </tr>

    </>
  )
}


const Bill = forwardRef(({ foodItems, current, update, isPaid, setCurrent, playAudio }, ref) => {
  const billItemContainerRef = useRef(null);
  const [wasItemAdded, setWasItemAdded] = useState(false);

  let totalBill = 0;
  let current_Order = JSON.parse(localStorage.getItem(current));

  if (current_Order) {
    totalBill = current_Order.ordered_items.reduce((acc, item) => {
      return acc + item.item_price * item.item_quantity;
    }, 0);
  }

  const markAsPaid = () => {
    let paid_order = JSON.parse(localStorage.getItem(current));
    let naam = paid_order.name;
    let ispaid = paid_order.paid
    paid_order.paid = !ispaid;
    localStorage.setItem(current, JSON.stringify(paid_order));
    update();
    setCurrent(NaN);
    playAudio(ispaid ? `${naam}  वापस लाया गया` : `${naam}  हटाया गया`);
  };

  useEffect(() => {
    if (wasItemAdded && billItemContainerRef.current) {
      billItemContainerRef.current.scrollTop = billItemContainerRef.current.scrollHeight;
      setWasItemAdded(false); // Reset flag
    }
  }, [wasItemAdded]);

  const handleAddItem = () => {
    setWasItemAdded(true);
  };

  useImperativeHandle(ref, () => ({
    handleAddItem,
  }));


  return (
    <div className="w-full bill-container overflow-x-auto rounded-md relative py-1 bg-light-primary flex flex-col h-full">
      <div className="bg-alwhite px-4 font-bold text-2xl py-4 flex justify-between items-center">
        <h1 className="text-black flex flex-col gap-1">
          {current_Order ? current_Order.name : ""}
          <span className="text-xs text-text">{current_Order ? `${current_Order.dateTime[1]} | ${current_Order.dateTime[0]}` : ""}</span>
        </h1>
        {current_Order && <span className="font-bold text-accent">₹{totalBill.toFixed(2)}</span>}
      </div>

      <div ref={billItemContainerRef} className="flex flex-col gap-4 overflow-auto scrollbar-custom h-full rounded-md pt-1">
        {current_Order ? (
          current_Order.ordered_items.length ? (
            <table className="w-full bg-alwhite rounded-lg overflow-hidden ">
              <tbody>
                {current_Order.ordered_items.map((item, index) => {
                  let ordered_food = foodItems.find(food => food.id === item.item_id);
                  return (
                    <BillItem
                      key={index}
                      index={index}
                      food_name={ordered_food.name}
                      food_img={ordered_food.pic_path}
                      item={item}
                      current={current}
                      current_Order={current_Order}
                      update={update}
                      isPaid={isPaid}
                    />
                  );
                })}
              </tbody>
            </table>
          ) : (
            "Please Add Items"
          )
        ) : (
          "Not Found"
        )}
      </div>

      {current ? (
        <div className="sticky border-t border-t-black bg-alwhite py-2 px-1 pr-6 flex justify-between items-center">
          <div className="flex gap-4">
            {current_Order.ordered_items.length !== 0 && (
              <button onClick={() => window.print()} className="pop-effect-button bg-blue-500 text-white px-4 py-2">
                Print Bill
              </button>)}
            {(!isPaid && current_Order.ordered_items.length !== 0) && (
              <button onClick={markAsPaid} className="pop-effect-button bg-[#388E3C] text-white px-4 py-2">
                Paid
              </button>
            )}
            {isPaid && (
              <button onClick={markAsPaid} className="pop-effect-button bg-[#EF4444] text-white px-4 py-2">
                UnPaid
              </button>
            )}
          </div>
          <span className="text-text font-bold text-2xl">
            Total : <span className="text-accent">{totalBill}</span>
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
});

export default Bill;

