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
  const updateInputTexts = (inputTexts: string) => {
    setInputTexts(inputTexts.split("\n"))
  }

  const {
    result,
    isPending,
    isFetching,
    isSuccess,
    isError,
    requestGenerateVoices,
  } = useVoiceVox()

  const handleOnRequest = async () => {
    await requestGenerateVoices(inputTexts)
  }

  return (
    <>
      <Input
        isFetching={isFetching}
        updateInputTexts={updateInputTexts}
        onRequest={handleOnRequest}
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
