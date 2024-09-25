import React, { useState } from 'react';

const FaqAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How many games do I have access to?',
      answer:
        'The YDot Games portal has multiple games to choose from and the games will be updated from time to time. The scores you get from each game that you play will be aggregated to a common leaderboard which will be the basis for awarding prizes.',
    },
    {
      question: 'How many chances will I get to play the games each day?',
      answer:
        'You can play the games as many times as you want each day as long as you are subscribed to the service.',
    },
    {
      question: 'How will I claim or get the prizes that I win when I play the games?',
      answer:
        'Airtime prizes will be automatically disbursed into the User’s mobile number that is subscribed to the service. Store vouchers will be automatically sent to eligible winners via SMS into the User’s mobile number that is subscribed to the service. Cash payments will be paid directly into the User’s mobile number that is subscribed to the service via eWallet or any equivalent electronic payment channel.',
    },
    {
      question: 'What type of questions are found in the games?',
      answer:
        'All questions are related to General Knowledge from all over the world.',
    },
    {
      question: 'How much time will I get to answer one question in the trivia games inside the portal?',
      answer: 'You will get 10 seconds to answer each question.',
    },
    {
      question: 'What prizes do I stand a chance to win when I play the game?',
      answer: (
        <>
        <p>Winners stand the chance to win the following prizes:</p>
        <table className="min-w-full border-collapse border border-gray-500 mt-2">
          <thead>
            <tr>
              <th className="border border-gray-500 px-4 py-2">DAILY PRIZES</th>
              <th className="border border-gray-500 px-4 py-2 ">MONTHLY PRIZES</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R60 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R1,000 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R55 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R750 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R50 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R500 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R45 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R450 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R40 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R400 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R35 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R350 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R30 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R300 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R25 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R250 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500 px-4 py-2">R20 Airtime</td>
              <td className="border border-gray-500 px-4 py-2">R200 Cash</td>
            </tr>
            <tr>
              <td className="border border-gray-500  px-4 py-2">R10 Airtime</td>
              <td className="border border-gray-500   px-4 py-2">R100 Cash</td>
            </tr>
          </tbody>
        </table>
      </>
      )
    },
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col  justify-center  ">
        <div className='bg-nav-gradient w-full h-[100%] text-white px-4 pt-8 '>
        <h1 className="font-mtn-brighter-bold text-[24px] leading-[24px] font-bold mb-6 text-center">FAQs</h1>

        </div>
      {faqs.map((faq, index) => (
        <div key={index} className=" p-4 cursor-pointer ">
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full text-left font-medium font-mtn-brighter-medium text-[18px] leading-[20.2px] p-4  text-[#000000] rounded-lg shadow-custom-shadow hover:bg-nav-gradient hover:text-white transition duration-200"
          >
            {faq.question}
          </button>
          {activeIndex === index && (
            <div className="p-4 bg-white  border font-mtn-brighter-regular font-regular text-[16px] text-justify leading-[18.2px] border-[#404040] border-t-0 rounded-b-[20px] shadow-box-shadow">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
