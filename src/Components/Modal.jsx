import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";

const Modal = ({ closeModal, setCurrent, updateList, setIspaid, list, getDateTime, addToken }) => {

    const modalBg = useRef();
    const customerNameRef = useRef();

    const [unavilabeToken, setUnavilabeToken] = useState([])

    useEffect(() => {
      let order_list = list.map(id => {
        let orderDetail = JSON.parse(localStorage.getItem(id) || '{}');
        const {name, paid} = orderDetail
        return {name, paid};
      });
  
      setUnavilabeToken((order_list.filter(order => order.paid === false)).map(tokenDetail => tokenDetail.name));
    }, [list])
  

    const closeModalFromBg = (e) => {
        if (modalBg.current === e.target) {
            closeModal();
        }
    }



    const add = (tokenNumber = null) => {
        const customerName = customerNameRef.current.value.trim();
        
        // If token is clicked or name is entered
        if (tokenNumber || customerName) {
            addToken(tokenNumber, customerName)
            closeModal();
        }
    };

    // Call Add function on hit the enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            add();
        }
    };

    return (
        <div
            ref={modalBg}
            onClick={closeModalFromBg}
            style={{ zIndex: 2 }}
            className="flex justify-center items-center w-full h-[100dvh] absolute inset-0 backdrop-blur-sm bg-black/50"
        >
            <div className="flex flex-col gap-4 p-4 bg-black rounded-lg w-full max-w-4xl border border-gray-600">
                <h2
                    className="place-self-end text-4xl font-bold text-white cursor-pointer"
                    onClick={closeModal}
                >
                    <IoClose />
                </h2>

                {/* Tokens Container */}
                <div className="tokens grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 p-4 bg-gray-800 border border-gray-600 rounded-lg h-[30rem] overflow-auto scrollbar-custom">
                     {Array.from({ length: 100 }, (_, i) => {
                        const tokenNumber = i + 1;
                        const isReserved = unavilabeToken.includes(`Token :- ${tokenNumber}`);

                        return (
                            <button
                                key={tokenNumber}
                                className={`border border-gray-600 rounded p-6 text-xl font-bold ${
                                    isReserved
                                        ? "bg-red-500 text-black cursor-not-allowed"
                                        : "text-white bg-gray-700 hover:bg-primary hover:text-black"
                                } transition`}
                                onClick={() => !isReserved && add(tokenNumber)}
                                disabled={isReserved}
                            >
                                {tokenNumber}
                            </button>
                        );
                    })}
                </div>

                {/* Input for Customer Name */}
                <div className="flex gap-2 items-center">
                    <input
                        ref={customerNameRef}
                        type="text"
                        className="flex-grow text-lg border border-gray-600 rounded p-2 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring focus:ring-primary"
                        placeholder="Enter Customer Name"
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={() => add(null)}
                        className="pop-effect-button px-4 py-2 text-black bg-primary rounded hover:bg-primary-dark transition"
                    >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Modal
