import { createUseStyles } from "react-jss"
import { FC, useState } from "react"
import "semantic-ui-css/semantic.min.css"
import { Input } from "./Input"
import { Preview } from "./Preview"
import { useVoiceVox } from "../hooks/useVoiceVox"
import React from "react"

const useStyles = createUseStyles({})

export const Body: FC = () => {
  const classes = useStyles() // eslint-disable-line

  const [inputTexts, setInputTexts] = useState<string[]>([])
  const updateInputTexts = (inputText: string) => {
    const inputTexts = inputText.split("\n")
    if (inputTexts.length === 1 && inputTexts[0] === "") {
      setInputTexts([])
      return
    }
    setInputTexts(inputTexts)
  }

  const {
    result,
    isPending,
    isFetching,
    isSuccess,
    isError,
    requestGenerateVoices,
    clearGenerateVoices,
  } = useVoiceVox()

  const handleOnRequest = async () => {
    await requestGenerateVoices(inputTexts)
  }

  const handleClearAllData = () => {
    setInputTexts([])
    clearGenerateVoices()
  }

  return (
    <>
      <Input
        isFetching={isFetching}
        inputTexts={inputTexts}
        updateInputTexts={updateInputTexts}
        onRequest={handleOnRequest}
        clearAllData={handleClearAllData}
      />
      <Preview
        inputTexts={inputTexts}
        result={result}
        isPending={isPending}
        isFetching={isFetching}
        isSuccess={isSuccess}
        isError={isError}
      />
    </>
  )
}
