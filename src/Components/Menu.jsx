import React from 'react';
import './Menu.css';

const Menu = ({ foodItems, currentCustomer, update, billRef }) => {

    const addItem = (id) => {
        if (currentCustomer) {
            let currentCustomer_order_info = JSON.parse(localStorage.getItem(currentCustomer));

            // for time stamp
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // 12-hour format
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const timestamp = `${formattedHours}:${formattedMinutes} ${ampm}`;

            if (!(currentCustomer_order_info.paid)) {
                let order = {
                    item_id: id,
                    item_quantity: 1,
                    item_price: foodItems.find(food => food.id === id).price,
                    order_time: timestamp,
                }

                currentCustomer_order_info.ordered_items.push(order);
                localStorage.setItem(currentCustomer, JSON.stringify(currentCustomer_order_info));
                update();
                billRef.current.handleAddItem();
            }
        }
    }

    return (
        <div className='min-w-[16rem] w-[25%] relative flex flex-col h-full bg-light-primary py-1 gap-2 rounded-md font-gujarati overflow-auto scrollbar-custom border border-black'>

            {
                foodItems.map(item => {
                    return (

                        <div key={item.id} className="item cursor-pointer" onClick={() => { addItem(item.id) }}>
                            <img src={item.pic_path} />
                            <div className='bg-primary'>
                                <span>{item.name}</span>
                                <span>{item.price}.00 Rs</span>
                            </div>
                        </div>
                    )

                })
            }

        </div>
    )
}

export default Menu;
