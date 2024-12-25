import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { RiHandCoinFill } from "react-icons/ri";

const SingleOrder = ({
    billRef,
    paid,
    customer,
    customerId,
    updateList,
    currentCustomer,
    setCurrent,
    playAudio,
}) => {
    const [startX, setStartX] = useState(0);
    const [deltaX, setDeltaX] = useState(0);

    const del = (e) => {
        e.stopPropagation();
        localStorage.removeItem(customerId);
        updateList(Object.keys(localStorage));
        if (Number(currentCustomer) === Number(customer.id)) {
            setCurrent(NaN);
        }
    };

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        const movementX = e.touches[0].clientX - startX;
        if (movementX >= 0 && !paid) {
            setDeltaX(movementX); // Track swipe progress
        }

    };

    const handleTouchEnd = () => {
        if (deltaX > 125) { // Swipe left threshold
            markAsPaid(new Event("swipe"));
        }
        setDeltaX(0); // Reset swipe progress
    };

    const markAsPaid = (event) => {
        event.stopPropagation();
        let paid_order = JSON.parse(localStorage.getItem(customerId));
        let naam = paid_order.name;
        paid_order.paid = true;
        localStorage.setItem(customerId, JSON.stringify(paid_order));
        updateList(Object.keys(localStorage));
        if (Number(currentCustomer) === Number(customer.id)) {
            setCurrent(NaN);
        }
        playAudio(`${naam}  हटाया गया`);
    };

    const clickSetCurrent = (e) => {
        setCurrent(Number(customerId));
        billRef.current.handleAddItem();
    };

    let detail = JSON.parse(localStorage.getItem(customerId)) || customer;
    let customer_name = detail.name;
    let time = detail.dateTime[0].split('');
    time.splice(5, 3);
    let customer_arrived_time = time.join('');
    const total = detail.ordered_items.reduce((acc, item) => {
        return acc + item.item_price * item.item_quantity;
    }, 0);

    let extra_style = "border-b border-b-light-text bg-light-primary";
    if (Number(currentCustomer) === Number(customer.id)) {
        extra_style = "bg-white";
    }


    // Dynamic styles for fade/highlight
    const swipeStyle = {
        transform: `translateX(${deltaX}px)` // Visual swipe movement
    };

    return (
        <div className="relative ">
            <div className="redAnimation bg-[#388E3C] absolute inset-0 z-0 flex text-white items-center pl-3 text-3xl">
                <RiHandCoinFill />
            </div>
            <div
                onClick={clickSetCurrent}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={swipeStyle}
                className={"cursor-pointer relative h-full z-[1] flex px-2 py-2 w-full justify-between items-center " + extra_style}
            >
                <div className="flex flex-col flex-grow truncate">
                    <div className="">
                        <h4 className="font-semibold text-xl truncate w-full text-text">
                            {customer_name}
                        </h4>

                    </div>
                    <div className="label flex gap-2 items-center justify-between">
                        {paid ? (
                            <span className="font-extrabold text-lg">{total}.00 Rs</span>
                        ) : (
                            <>
                                <span className="font-bold text-accent text-lg">{total}.00 Rs</span>
                                <span className="font-semibold text-xs text-text">{customer_arrived_time}</span>
                            </>
                        )}
                    </div>
                </div>
                {paid && (
                    <div className="flex-shrink-0 ml-2">
                        <button
                            onClick={del}
                            className="text-3xl text-red-500 rounded-[50%] bg-alwhite"
                        >
                            <MdDeleteForever />
                        </button>
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default SingleOrder;
