import { createUseStyles } from "react-jss"
import { FC, useState } from "react"
import "semantic-ui-css/semantic.min.css"
import { Input } from "./Input"
import { Preview } from "./Preview"

import { useVoiceVox } from "../hooks/useVoiceVox"

const useStyles = createUseStyles({})

export const Body: FC = () => {
  const classes = useStyles()

  const [inputTexts, setInputTexts] = useState<string[]>([])
  const updateInputTexts = (inputTexts: string) => {
    setInputTexts(inputTexts.split("\n"))
  }

  const {
    urlList,
    isAudioReadyList,
    isPending,
    isFetching,
    isSuccess,
    isError,
    refetchGetVoice,
  } = useVoiceVox(inputTexts)

  return (
    <>
      <Input
        isFetching={isFetching}
        updateInputTexts={updateInputTexts}
        refetchGetVoice={refetchGetVoice}
      />
      <Preview
        inputTexts={inputTexts}
        urlList={urlList}
        isAudioReadyList={isAudioReadyList}
        isPending={isPending}
        isFetching={isFetching}
        isSuccess={isSuccess}
        isError={isError}
      />
    </>
  )
}
