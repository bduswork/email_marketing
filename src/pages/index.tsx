import {Inter} from 'next/font/google'
import {Button} from "flowbite-react"
import InptutFieldComponent from "@/Components/InptutFieldComponent"
import React, {useState} from "react"
import LogoImage from "@/Components/LogoImage"
import * as XLSX from "xlsx"
import Footer from "@/Components/Footer"


const inter = Inter({subsets: ['latin']})

export default function Home() {
    const [componentCount, setComponentCount] = useState(1)
    const [emailBody, setEmailBody] = useState("")
    const [excelData, setExcelData] = useState([])
    const [excelDataRowNo, setExcelDataRowNo] = useState(1)
    const [outputEmailBody, setOutputEmailBody] = useState("")
    const [isCopied, setIsCopied] = useState(false)
    const [subjectLine, setSubjectLine] = useState("")
    const [subjectOutput, setSubjectOutput] = useState("")
    const [subjectCopy, setSubjectCopy] = useState(false)
    const [email, setEmail] = useState("")
    const [personLinkedInUrl, setPersonLinkedInUrl] = useState("")


    const buttonOnClick = () => {
        setComponentCount(componentCount + 1)
    }

    const handleSubjectBody = (word: string, columnName: string) => {
        let columnIndex
        if (excelData) {
            // @ts-ignore
            columnIndex = excelData[0].indexOf(columnName)
            if (columnIndex === -1) {
                console.error(`Column '${columnName}' not found.`)
                return null
            }
            const columnData: any = excelData[excelDataRowNo][columnIndex]
            let data: string
            if (subjectOutput) {
                data = subjectLine.replace(word, columnData)
                setSubjectOutput(data)
            } else {
                data = subjectLine.replace(word, columnData)
                setSubjectOutput(data)
            }
        }
    }

    const handleEmailBody = (word: string, columnName: string) => {
        let columnIndex
        if (excelData) {
            // @ts-ignore
            columnIndex = excelData[0].indexOf(columnName)
            if (columnIndex === -1) {
                console.error(`Column '${columnName}' not found.`)
                return null
            }

            // @ts-ignore
            const emailIndex: any = excelData[0].indexOf('Email')
            if (emailIndex === -1) {
                console.error(`Column Email not found.`)
            } else {
                setEmail(excelData[excelDataRowNo][emailIndex])
            }
            // @ts-ignore
            const personLinkedInIndex: any = excelData[0].indexOf('Person Linkedin URL')
            if (personLinkedInIndex === -1) {
                console.error(`Column Person Linkedin URL not found.`)
            } else {
                setPersonLinkedInUrl(excelData[excelDataRowNo][personLinkedInIndex])
            }
            const columnData: any = excelData[excelDataRowNo][columnIndex]
            let data: string
            if (outputEmailBody) {
                data = outputEmailBody.replace(word, columnData)
                setOutputEmailBody(data)
            } else {
                data = emailBody.replace(word, columnData)
                setOutputEmailBody(data)
            }
        }
    }

    const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [file]: any = e.target.files
        const reader = new FileReader()

        reader.onload = (evt: ProgressEvent<FileReader>) => {
            const bstr: string | ArrayBuffer | null = evt.target?.result as string | ArrayBuffer | null
            const wb: XLSX.WorkBook = XLSX.read(bstr, {type: "binary"})
            const wsname: string = wb.SheetNames[0]
            const ws: XLSX.WorkSheet = wb.Sheets[wsname]
            const jsonData: any | [] = XLSX.utils.sheet_to_json(ws, {header: 1})
            const headers: string[] = jsonData[0] || []
            console.log(headers)
            setExcelData(jsonData)
        }
        reader.readAsBinaryString(file)
    }

    const nextButtonOnclick = () => {
        setExcelDataRowNo(excelDataRowNo + 1)
        setOutputEmailBody("")
        setSubjectOutput("")
        setEmail("")
    }

    const handleSubjectLineCopy = () => {
        navigator.clipboard.writeText(subjectOutput)
        setSubjectCopy(true)

        // Reset the button text after 3 seconds (adjust the duration as needed)
        setTimeout(() => {
            setSubjectCopy(false)
        }, 3000)
    }
    const handleCopyClick = () => {
        navigator.clipboard.writeText(outputEmailBody)
        setIsCopied(true)

        // Reset the button text after 3 seconds (adjust the duration as needed)
        setTimeout(() => {
            setIsCopied(false)
        }, 3000)
    }

    const handleBack = () => {
        setExcelDataRowNo(excelDataRowNo - 1)
        setOutputEmailBody("")
        setSubjectOutput("")
        setEmail("")
    }

    // todo: add react-email to send email.
    return (
        <main
            className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
        >
            <div className="mb-2">
                <LogoImage/>
            </div>

            <div className="w-2/4">
                <label className="block mb-2 text-sm font-medium text-white dark:text-white" htmlFor="file_input">
                    Upload file</label>
                <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-400 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input" type="file" accept=".xlsx, .xls"
                    onChange={fileUpload}/>
            </div>

            <div className="w-2/4 mt-5">
                <label htmlFor="Subject Line" className="block text-sm font-medium leading-6 text-white">
                    Subject Line
                </label>
                <div className=" mt-2">
                    <input
                        id="subjectLine"
                        name="subjectLine"
                        className="block bg-gray-400 w-full rounded-md border-b-white border-2 px-1.5 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={subjectLine}
                        onChange={(e) => setSubjectLine(e.target.value)}
                    />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">Paste Your Subject Line here</p>
            </div>
            {
                subjectLine ? (
                    <>
                        <div className="justify-between w-2/4">
                            <InptutFieldComponent dataChange={handleSubjectBody}/>
                        </div>
                    </>
                ) : null
            }

            <div className="w-2/4 mt-5">
                <label htmlFor="Email Body" className="block text-sm font-medium leading-6 text-white">
                    Email Body
                </label>
                <div className=" mt-2">
                <textarea
                    id="emailBody"
                    name="emailBody"
                    rows={3}
                    className="block w-full rounded-md bg-gray-400 border-b-white border-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    style={{
                        minHeight: "150px"
                    }}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">Paste Your Email Body here</p>
            </div>


            {excelData && emailBody ?
                <div className="justify-between w-2/4">
                    {Array.from({length: componentCount}, (_, index) => (
                        <div key={index}>
                            <InptutFieldComponent dataChange={handleEmailBody}/>
                        </div>
                    ))}
                    <Button
                        className="mt-10 mx-auto text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
                        hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium
                        rounded-lg text-sm px-5 py-2.5 text-center"
                        size="xs" onClick={buttonOnClick}>Add</Button>
                </div>
                : null}
            <br/>


            {
                email ? (
                    <div className="w-2/4 mb-5 flex align-middle justify-between">
                        <div className="w-full flex justify-between" >
                            <label htmlFor="Email" className="text-sm font-medium leading-6 text-white mr-5">
                                Email
                            </label>

                            <input className="w-full h-[45px] ps-1 rounded-md bg-gray-400 border-0 py-2.5 text-gray-900 shadow-sm ring-1
                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                 sm:text-sm sm:leading-6"
                                   value={email}
                                   readOnly
                            />

                        </div>

                        <Button
                            className="ml-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl
                             focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg
                              text-sm px-5 py-0.5 text-center "
                            style={{alignSelf: 'center'}}
                            size="xs"
                            onClick={() => navigator.clipboard.writeText(email)}
                        >
                            Copy Email
                        </Button>
                    </div>
                ) : null
            }

            {
                personLinkedInUrl ? (
                    <div className="w-2/4 mb-5 flex align-middle justify-between">
                        <div className="w-full flex justify-between" >
                            <label htmlFor="Email" className="text-sm font-medium leading-6 text-white mr-5">
                                Personal LinkedIn Url
                            </label>

                            <input className="w-full h-[45px] ps-1 rounded-md bg-gray-400 border-0 py-2.5 text-gray-900 shadow-sm ring-1
                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600
                 sm:text-sm sm:leading-6"
                                   value={personLinkedInUrl}
                                   readOnly
                            />

                        </div>

                        <Button
                            className="ml-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl
                             focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg
                              text-sm px-5 py-0.5 text-center "
                            style={{alignSelf: 'center'}}
                            size="xs"
                            onClick={() => navigator.clipboard.writeText(personLinkedInUrl)}
                        >
                            Copy Linkedin URL
                        </Button>
                    </div>
                ) : null
            }


            <div className="w-2/4 flex flex-col">
                {
                    subjectOutput ? (
                        <>
                            <label htmlFor="Subject Line" className="block text-sm font-medium leading-6 text-white">
                                Output Subject Line
                            </label>
                            <div className="mt-2">
                                <input
                                    id="subjectLine"
                                    name="subjectLine"
                                    className="block w-full bg-gray-400 rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={subjectOutput}
                                    readOnly
                                />
                            </div>
                            <Button
                                className="mt-5 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                style={{alignSelf: 'center'}}
                                size="xs"
                                onClick={handleSubjectLineCopy}
                            >
                                {subjectCopy ? 'Copied' : 'Click to copy'}
                            </Button>
                        </>
                    ) : null
                }

            </div>

            <div className="w-2/4 flex flex-col">
                {
                    outputEmailBody ? (
                        <>
                            <label htmlFor="Email Body" className="block text-sm font-medium leading-6 text-white">
                                Output Email Body
                            </label>
                            <div className="mt-2">
                  <textarea
                      id="emailBody"
                      name="emailBody"
                      rows={3}
                      className="block w-full bg-gray-400 rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={outputEmailBody}
                      style={{
                          minHeight: "150px"
                      }}
                      readOnly
                  />
                            </div>
                            <Button
                                className="mt-5 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                style={{alignSelf: 'center'}}
                                size="sm"
                                onClick={handleCopyClick}
                            >
                                {isCopied ? 'Copied' : 'Click to copy'}
                            </Button>
                        </>
                    ) : null
                }

            </div>

            <div className="flex mt-10 space-x-20">
                {
                    excelDataRowNo > 1 ? (
                        <Button
                            onClick={handleBack}
                            className="mr-8 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                            Back
                        </Button>
                    ) : null
                }

                {
                    excelDataRowNo < excelData?.length ? (
                        <Button
                            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            onClick={nextButtonOnclick}>
                            Next
                        </Button>

                    ) : (
                        <p className="mt-10 text-pink-300">You complete all the data</p>
                    )
                }
            </div>
            <Footer/>
        </main>
    )
}
