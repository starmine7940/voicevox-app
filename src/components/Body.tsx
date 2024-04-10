import { createUseStyles } from "react-jss"
import { FC, useState } from "react"
import "semantic-ui-css/semantic.min.css"
import { Input } from "./Input"
import { Preview } from "./Preview"

import { useVoiceVox } from "../hooks/useVoiceVox"

const useStyles = createUseStyles({})

export const Body: FC = () => {
  const classes = useStyles() // eslint-disable-line

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
    requestGenerateVoices,
  } = useVoiceVox()

  const handleOnRequest = async () => {
    await requestGenerateVoices(inputTexts)
  }

  // useVoiceVoxに求める役割
  // 入力：テキストの配列を渡す
  // 出力：音声データの作成ステータス
  // 出力2：音声データの作成データ（URL）

  return (
    <>
      <Input
        isFetching={isFetching}
        updateInputTexts={updateInputTexts}
        onRequest={handleOnRequest}
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
