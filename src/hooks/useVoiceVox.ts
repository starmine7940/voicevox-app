import { useState, useMemo } from "react"
import { useGetUrlList } from "./useGetUrlList"
import { useGetStatusList } from "./useGetStatusList"

export type UseVoiceBoxSuccessResult = {
  inputText: string
  requestSuccess: boolean
  audioGenerateSuccess: boolean
  speakerName: string
  wavDownloadUrl: string
  mp3DownloadUrl: string
  mp3StreamingUrl: string
}[]

export type UseVoiceBoxResult = UseVoiceBoxSuccessResult | undefined

export type UseVoiceVox = {
  result: UseVoiceBoxResult
  isPending: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  requestGenerateVoices: (inputTexts: string[]) => Promise<void>
  clearGenerateVoices: () => void
}

export const useVoiceVox = (): UseVoiceVox => {
  const [inputTexts, setInputTexts] = useState<string[]>([])

  const {
    urlList,
    isPending: isPendingGetUrlList,
    isFetching: isFetchingGetUrlList,
    isSuccess: isSuccessGetUrlList,
    isError: isErrorGetUrlList,
    clearUseGetUrlList,
  } = useGetUrlList(inputTexts)

  const urlListMemo = useMemo(() => {
    return urlList
      ? urlList.map((voiceData) => voiceData.audioStatusUrl)
      : undefined
  }, [urlList])

  const {
    isAudioReadyList,
    isPending: isPendingGetStatusList,
    isFetching: isFetchingGetStatusList,
    isSuccess: isSuccessGetStatusList,
    isError: isErrorGetStatusList,
    clearUseGetStatusList,
  } = useGetStatusList(urlListMemo)

  const isPending = isPendingGetUrlList || isPendingGetStatusList
  const isFetching = isFetchingGetUrlList || isFetchingGetStatusList
  const isSuccess = isSuccessGetUrlList && isSuccessGetStatusList
  const isError = isErrorGetUrlList || isErrorGetStatusList

  const requestGenerateVoices = async (inputTexts: string[]) => {
    setInputTexts(inputTexts.filter((text) => text !== ""))
  }

  const result = urlList?.map((voiceData, index) => {
    return {
      inputText: (inputTexts.length && inputTexts[index]) || "",
      requestSuccess: voiceData.success,
      audioGenerateSuccess:
        (isAudioReadyList && isAudioReadyList[index] === true) ?? false,
      speakerName: voiceData.speakerName,
      wavDownloadUrl: voiceData.wavDownloadUrl,
      mp3DownloadUrl: voiceData.mp3DownloadUrl,
      mp3StreamingUrl: voiceData.mp3StreamingUrl,
    }
  })

  const clearGenerateVoices = () => {
    setInputTexts([])
    clearUseGetUrlList()
    clearUseGetStatusList()
  }

  return {
    result: result,
    isPending: isPending,
    isFetching: isFetching,
    isSuccess: isSuccess,
    isError: isError,
    requestGenerateVoices: requestGenerateVoices,
    clearGenerateVoices: clearGenerateVoices,
  }
}
