import { UseQueryResult, useQuery } from "@tanstack/react-query"
import {
  GetStatusListSuccessResult,
  GetStatusListFailureResult,
} from "../domain/type"

type GetStatus = {
  isAudioReadyList: boolean[] | undefined
}

export type UseGetStatusList = Omit<UseQueryResult, "data"> & GetStatus

const pollGetStatusList = async (
  audioStatusUrlList: string[],
): Promise<boolean[]> => {
  const timeout = 300000
  const startTime = Date.now()
  const urlsNum = audioStatusUrlList.length
  const isAudioReadyList = [...Array(urlsNum)].map(() => false)
  while (Date.now() - startTime < timeout) {
    for (let i = 0; i < urlsNum; i++) {
      if (isAudioReadyList[i] === true) continue
      const res = await fetch(audioStatusUrlList[i])
      if (res.ok) {
        const getStatusSuccessResult =
          (await res.json()) as GetStatusListSuccessResult
        if (getStatusSuccessResult.isAudioReady === true) {
          isAudioReadyList[i] = true
        }
        await new Promise((resolve) => setTimeout(resolve, 5000)) // 成功したら 5 秒空けて次のリクエスト
      } else {
        const getStatusFailureResult =
          (await res.json()) as GetStatusListFailureResult
        console.error("get status failed:", getStatusFailureResult)
        await new Promise((resolve) =>
          setTimeout(resolve, getStatusFailureResult.retryAfter * 1000),
        ) // 失敗したら retryAfter だけ空けて次のリクエスト
      }
    }
    if (
      isAudioReadyList.some((isAudioReady) => isAudioReady === false) === false
    )
      break
  }
  return isAudioReadyList
}

export const useGetStatusList = (
  audioStatusUrlList: string[] | undefined,
): UseGetStatusList => {
  const result = useQuery({
    queryKey: ["useGetStatusList"],
    queryFn: async () => {
      if (audioStatusUrlList === undefined) {
        return undefined
      }
      return pollGetStatusList(audioStatusUrlList)
    },
    enabled: false,
    retry: false,
  })
  return {
    ...result,
    isAudioReadyList: result.data,
  }
}
