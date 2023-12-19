import React, { useState } from "react";
import { Button } from "flowbite-react";

interface InputFieldComponentProps {
    dataChange: (word: string, columnName: string) => void;
}

const InptutFieldComponent: React.FC<InputFieldComponentProps> = ({ dataChange }) => {
    const [word, setWord] = useState("");
    const [columnName, setColumnName] = useState("");
    const [buttonClick, setButtonClick] = useState(true)

    const rightButtonOnClick = () => {
        if (!word || !columnName) {
            return;
        }
        setButtonClick(false)
        dataChange(word, columnName);
    };

    return (
        <div className="mt-5 w-full flex justify-between">
            <div>
                <label htmlFor="word" className="text-sm font-medium leading-6 text-white">
                    Word
                </label>
                <div className="mt-2">
                    <input
                        type="text"
                        name="word"
                        id="word"
                        className="w-[220px] bg-gray-400 rounded-md border-1 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setWord(e.target.value)}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="columnName" className="text-sm font-medium leading-6 text-white">
                    Column Name
                </label>
                <div className="mt-2 ">
                    <input
                        type="text"
                        name="columnName"
                        id="columnName"
                        className="w-[220px] rounded-md bg-gray-400 border-1 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setColumnName(e.target.value)}
                    />
                </div>
            </div>
            {
                buttonClick ?
                    <>
                        <div className="flex items-end">
                            <Button className="" onClick={rightButtonOnClick}>
                                <svg className="h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                </svg>
                            </Button>
                        </div>

                    </> : null
            }
        </div>
    );
};

export default InptutFieldComponent;
