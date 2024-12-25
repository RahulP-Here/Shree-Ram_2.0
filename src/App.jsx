import { useCallback, useState, useEffect, useRef } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import LiveOrder from './Components/LiveOrder'
import Bill from './Components/Bill'
import Menu from './Components/Menu'
import Modal from './Components/Modal'

function App() {

  const [ShowModal, setShowModal] = useState(false)

  const [customerList, setCustomerList] = useState(Object.keys(localStorage).filter(item => item !== "last token"));

  const [lastToken, setLastToken] = useState(Number(localStorage.getItem('last token')) || 1);

  useEffect(() => {
    localStorage.setItem("last token", lastToken);
  }, [lastToken])
  

  const [currentCustomer, setCurrentCustomer] = useState(NaN);

  const [ispaid, setIspaid] = useState(false);

  const billRef = useRef();

  const FoodItems = [
    { id: 1, name: 'મીક્ષ પ્લેટ', price: 45, pic_path: '/images/foodItems/mix-plate.png' },
    { id: 2, name: 'મસાલા ઢોંસા', price: 60, pic_path: '/images/foodItems/masala-dhosa.png' },
    { id: 3, name: 'બ્રેડ પકોડા', price: 25, pic_path: '/images/foodItems/bread-pakoda.png' },
    { id: 4, name: 'સિંગલ નંગ ', price: 15, pic_path: '/images/foodItems/single-piece.png' },
    { id: 5, name: 'મસાલા નંગ ', price: 20, pic_path: '/images/foodItems/masala-piece.png' },
    { id: 6, name: 'પેપર ઢોંસા', price: 40, pic_path: '/images/foodItems/paper-dhosa.png' },
    { id: 7, name: 'પાણી ની બોટલ', price: 10, pic_path: '/images/foodItems/water-bottle.png' },
    { id: 8, name: 'મસાલા છાશ', price: 10, pic_path: '/images/foodItems/masala-chass.png' },
  ];


const getFormattedTimeAndDate = () =>{
  const now = new Date();

  // Format time: hour:minute:second AM/PM
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0-hour to 12 for 12-hour format
  const formattedTime = `${String(formattedHours).padStart(2, '0')}:${minutes}:${seconds} ${period}`;

  // Format date: date short name of month, year
  const date = now.getDate();
  const month = now.toLocaleString('default', { month: 'short' }); // Get short name of month
  const year = now.getFullYear();
  const formattedDate = `${date} ${month}, ${year}`;

  return [formattedTime, formattedDate];
}


  // For update CustomerList every CRUD operation in Local Storage
  const update = () => {
    setCustomerList(Object.keys(localStorage).filter(item => item !== "last token"));
  }

  const addToken = (tokenNumber = null, customerName = null) => {
    // const customerName = customerNameRef.current.value.trim();

    // If token is clicked or name is entered
    if (tokenNumber || customerName) {
        let customer_id = Date.now();
        let customer_order_info = {
            name: tokenNumber ? `Token :- ${tokenNumber}` : customerName,
            ordered_items: [],
            dateTime: getFormattedTimeAndDate(),
            paid: false,
        };

        // Save to localStorage
        localStorage.setItem(customer_id, JSON.stringify(customer_order_info));

        // Update current customer and UI
        setCurrentCustomer(customer_id);
        update();
        // closeModal();
        setIspaid(false);
    }
};

  return (
    <>
      <Navbar showModal={setShowModal} setLastToken={setLastToken}/>
      <div className="flex mx-auto w-full py-2 px-4 gap-2" style={{ height: 'calc(100dvh - 76px)' }}>

        <LiveOrder billRef={billRef} paid={ispaid} setIsPaid={setIspaid} list={customerList}  updateList={setCustomerList} currentCustomer={currentCustomer} setCurrent={setCurrentCustomer} addToken={addToken} updateLastToken={setLastToken} lastToken={lastToken} update={update}/>

        <Bill ref={billRef} foodItems={FoodItems} current={currentCustomer} update={update} isPaid={ispaid} setCurrent={setCurrentCustomer}/>

        <Menu billRef={billRef} foodItems={FoodItems} currentCustomer={currentCustomer} update={update} />

        {ShowModal && <Modal closeModal={() => { setShowModal(false) }} setCurrent={setCurrentCustomer} updateList={setCustomerList} setIspaid={setIspaid} list={customerList} paid={ispaid} addToken={addToken}/>}

      

      </div>

    </>

  )
}

export default App
