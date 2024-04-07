import { useEffect } from "react"
import { useGetUrlList } from "./useGetUrlList"
import { useGetStatusList } from "./useGetStatusList"
import { GetUrlListSuccessResult } from "../domain/type"

export type UseVoiceVox = {
  urlList: GetUrlListSuccessResult[] | undefined
  isAudioReadyList: boolean[] | undefined
  isPending: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  refetchGetVoice: () => void
}

export const useVoiceVox = (inputTexts: string[]): UseVoiceVox => {
  const {
    urlList,
    isPending: isPendingGetUrlList,
    isFetching: isFetchingGetUrlList,
    isSuccess: isSuccessGetUrlList,
    isError: isErrorGetUrlList,
    refetch: refetchGetUrlList,
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

  // 全てのテキストの URL を取得できたら status を確認する
  useEffect(() => {
    isSuccessGetUrlList && refetchGetStatusList()
  }, [isSuccessGetUrlList])

  return {
    urlList: urlList,
    isAudioReadyList: isAudioReadyList,
    isPending: isPending,
    isFetching: isFetching,
    isSuccess: isSuccess,
    isError: isError,
    refetchGetVoice: refetchGetUrlList,
  }
}
