"use client";

import { useState } from "react";
import { useShoppingCart } from "../(default)/cart/useShoppingCart";

type AmountSelectorProps = {

    initialQuantity: number;
    productID: string;
};

export function AmountSelector(props: AmountSelectorProps) {
    const { initialQuantity } = props;
    const { increaseAmount, decreaseAmount } = useShoppingCart();
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
        // If product ID present in local storage, update the quantity
        increaseAmount(props.productID);
    }


    const handleDecrement = () => {
        setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 1));
        // If product ID present in local storage, update the quantity
        decreaseAmount(props.productID);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Ensure the input value is a valid number or empty
        if (value === "" || /^[0-9]+$/.test(value)) {
            setQuantity(value === "" ? 0 : parseInt(value, 10));
        }
    };

    return (
        <div className="relative flex items-center max-w-[8rem]">
            <button
                type="button"
                id="decrement-button"
                onClick={handleDecrement}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
            >
                <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                    />
                </svg>
            </button>
            <input
                type="text"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={handleInputChange}
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-brand-500 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full"
                placeholder="0"
                required
            />
            <button
                type="button"
                id="increment-button"
                onClick={handleIncrement}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
            >
                <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                    />
                </svg>
            </button>
        </div>
    );
}
