import React from "react";

const ThresholdModal = ({ isOpen, onClose, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-gray-100  rounded-lg shadow-lg p-6 max-w-md text-center">
        <p className="text-[17.5px] leading-[15.6px] font-bold font-mtn-brighter-medium text-yellow-600">
          🔥You've reached 10,000 points!🔥
        </p>
        <p className="mt-2 text-gray-700 font-mtn-brighter-medium">
          You're on a roll! To keep the momentum going and unlock the next
          level, continue playing for just{" "}
          <span className="font-bold text-yellow-800 font-mtn-brighter-medium">R5</span>.
        </p>
        <p className="mt-2 text-gray-700 font-mtn-brighter-medium">
          💰 Bigger rewards. 🎯 Greater challenges. 🏆 More fun.
        </p>
        <p className="mt-4 text-gray-700 font-semibold font-mtn-brighter-medium">
          Tap "Continue" now—-your next high score is waiting! 🎮
        </p>

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 font-mtn-brighter-medium hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="bg-yellow-500 font-mtn-brighter-medium hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThresholdModal;



