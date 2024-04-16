import { useEffect, useState } from "react"
import { useGetUrlList } from "./useGetUrlList"
import { useGetStatusList } from "./useGetStatusList"

export type UseVoiceBoxResult =
  | {
      inputText: string
      requestSuccess: boolean
      audioGenerateSuccess: boolean
      speakerName: string
      wavDownloadUrl: string
      mp3DownloadUrl: string
      mp3StreamingUrl: string
    }[]
  | undefined

export type UseVoiceVox = {
  result: UseVoiceBoxResult
  isPending: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  requestGenerateVoices: (inputTexts: string[]) => Promise<void>
}

export const useVoiceVox = (): UseVoiceVox => {
  const [inputTexts, setInputTexts] = useState<string[]>([])

  const {
    urlList,
    isPending: isPendingGetUrlList,
    isFetching: isFetchingGetUrlList,
    isSuccess: isSuccessGetUrlList,
    isError: isErrorGetUrlList,
    refetch: refetchGetUrlList, // eslint-disable-line
  } = useGetUrlList(inputTexts)

  const {
    isAudioReadyList,
    isPending: isPendingGetStatusList,
    isFetching: isFetchingGetStatusList,
    isSuccess: isSuccessGetStatusList,
    isError: isErrorGetStatusList,
    refetch: refetchGetStatusList,
  } = useGetStatusList(
    urlList ? urlList.map((voiceData) => voiceData.audioStatusUrl) : undefined,
  )

  const isPending = isPendingGetUrlList || isPendingGetStatusList
  const isFetching = isFetchingGetUrlList || isFetchingGetStatusList
  const isSuccess = isSuccessGetUrlList && isSuccessGetStatusList
  const isError = isErrorGetUrlList || isErrorGetStatusList

  useEffect(() => {
    refetchGetUrlList()
  }, [inputTexts]) // eslint-disable-line react-hooks/exhaustive-deps

  // 全てのテキストの URL を取得できたら status を確認する
  useEffect(() => {
    if (urlList?.length) {
      refetchGetStatusList()
    }
  }, [urlList]) // eslint-disable-line react-hooks/exhaustive-deps

  const requestGenerateVoices = async (inputTexts: string[]) => {
    setInputTexts(inputTexts)
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

  return {
    result: result,
    isPending: isPending,
    isFetching: isFetching,
    isSuccess: isSuccess,
    isError: isError,
    requestGenerateVoices: requestGenerateVoices,
  }
}
